import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_SETTINGS_REPOSITORY,
  UserSettingsRepositoryPort,
} from '../../../account/application/ports/user-settings-repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  CARD_REPOSITORY,
  CardRepositoryPort,
} from '../../../decks/application/ports/card-repository.port';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../../../decks/application/ports/deck-repository.port';
import { DeckPermissionService } from '../../../decks/domain/services/deck-permission.service';
import { Card } from '../../../decks/domain/types';
import { CardReviewState } from '../../domain/types';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';
import {
  STUDY_SESSION_REPOSITORY,
  StudySessionRepositoryPort,
} from '../ports/study-session-repository.port';

export type LessonCard = {
  cardId: string;
  front: string;
  back: string;
  example: string | null;
  notes: string | null;
  position: number;
  reviewState: CardReviewState | null;
};

export type StartLessonUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  lessonSize?: number;
};

export type StartLessonUseCaseResult = {
  sessionId: string | null;
  deckId: string;
  cards: LessonCard[];
  lessonSize: number;
  totalCards: number;
};

const LESSON_SIZE_DEFAULT = 20;
const LESSON_SIZE_MIN = 5;
const LESSON_SIZE_MAX = 100;

@Injectable()
export class StartLessonUseCase {
  private readonly deckPermissionService = new DeckPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
    @Inject(STUDY_SESSION_REPOSITORY)
    private readonly studySessionRepository: StudySessionRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
  ) {}

  async execute(
    input: StartLessonUseCaseInput,
  ): Promise<StartLessonUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const deck = await this.deckRepository.findById(input.deckId);

    if (!deck) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    const canStudy = this.deckPermissionService.canManageDeck({
      user: input.currentUser,
      deck,
    });

    if (!canStudy) {
      throw new ApplicationError(ErrorCodes.DECK_NOT_FOUND, 'Deck not found');
    }

    let settings = await this.userSettingsRepository.findByUserId(
      input.currentUser.id,
    );

    if (!settings) {
      settings = await this.userSettingsRepository.createForUser(
        input.currentUser.id,
      );
    }

    const lessonSize = this.resolveLessonSize(
      input.lessonSize,
      settings.lessonSize,
    );
    const totalCards = await this.cardRepository.countByDeckId(input.deckId);
    const cards = await this.selectLessonCards({
      userId: input.currentUser.id,
      deckId: input.deckId,
      lessonSize,
    });

    if (cards.length === 0) {
      return {
        sessionId: null,
        deckId: input.deckId,
        cards: [],
        lessonSize,
        totalCards,
      };
    }

    await this.studySessionRepository.abandonActiveForUserAndDeck({
      userId: input.currentUser.id,
      deckId: input.deckId,
    });

    const session = await this.studySessionRepository.create({
      userId: input.currentUser.id,
      deckId: input.deckId,
      lessonSize,
    });

    return {
      sessionId: session.id,
      deckId: input.deckId,
      cards,
      lessonSize,
      totalCards,
    };
  }

  private resolveLessonSize(
    requested: number | undefined,
    userDefault: number,
  ): number {
    const raw = requested ?? userDefault ?? LESSON_SIZE_DEFAULT;

    return Math.min(LESSON_SIZE_MAX, Math.max(LESSON_SIZE_MIN, raw));
  }

  private async selectLessonCards(input: {
    userId: string;
    deckId: string;
    lessonSize: number;
  }): Promise<LessonCard[]> {
    const now = new Date();
    const allCards = await this.cardRepository.findByDeckId(input.deckId);
    const cardsById = new Map(allCards.map((card) => [card.id, card]));
    const dueCardIds =
      await this.cardReviewStateRepository.findDueCardIdsForDeck({
        userId: input.userId,
        deckId: input.deckId,
        now,
        limit: input.lessonSize,
      });
    const selectedCards: LessonCard[] = [];
    const selectedCardIds = new Set<string>();

    for (const cardId of dueCardIds) {
      const card = cardsById.get(cardId);

      if (!card || selectedCardIds.has(cardId)) {
        continue;
      }

      const reviewState =
        await this.cardReviewStateRepository.findByUserAndCard(
          input.userId,
          cardId,
        );

      selectedCards.push(this.toLessonCard(card, reviewState));
      selectedCardIds.add(cardId);
    }

    const remainingCapacity = input.lessonSize - selectedCards.length;

    if (remainingCapacity <= 0) {
      return selectedCards;
    }

    for (const card of allCards) {
      if (selectedCardIds.has(card.id)) {
        continue;
      }

      const reviewState =
        await this.cardReviewStateRepository.findByUserAndCard(
          input.userId,
          card.id,
        );

      if (reviewState !== null) {
        continue;
      }

      selectedCards.push(this.toLessonCard(card, null));
      selectedCardIds.add(card.id);

      if (selectedCards.length >= input.lessonSize) {
        break;
      }
    }

    return selectedCards;
  }

  private toLessonCard(
    card: Card,
    reviewState: CardReviewState | null,
  ): LessonCard {
    return {
      cardId: card.id,
      front: card.front,
      back: card.back,
      example: card.example,
      notes: card.notes,
      position: card.position,
      reviewState,
    };
  }
}

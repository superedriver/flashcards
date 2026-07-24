import { Inject, Injectable } from '@nestjs/common';
import { learningGroupForStep, resolvePromptDirection } from '@flashcards/srs';
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
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';
import {
  STUDY_SESSION_REPOSITORY,
  StudySessionRepositoryPort,
} from '../ports/study-session-repository.port';
import { EnsureCardReviewStatesService } from '../services/ensure-card-review-states.service';
import { PromptDirectionRandomBitService } from '../services/prompt-direction-random-bit.service';
import { LessonCard } from './start-lesson.use-case';

export type StartHomeLessonUseCaseInput = {
  currentUser: AuthUser;
  lessonSize?: number;
};

export type StartHomeLessonUseCaseResult = {
  sessionId: string | null;
  deckId: string | null;
  scope: 'HOME_ACTIVE_TARGET';
  cards: LessonCard[];
  lessonSize: number;
  totalCards: number;
};

const LESSON_SIZE_DEFAULT = 20;
const LESSON_SIZE_MIN = 5;
const LESSON_SIZE_MAX = 100;

@Injectable()
export class StartHomeLessonUseCase {
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
    private readonly ensureCardReviewStatesService: EnsureCardReviewStatesService,
    private readonly promptDirectionRandomBitService: PromptDirectionRandomBitService,
  ) {}

  async execute(
    input: StartHomeLessonUseCaseInput,
  ): Promise<StartHomeLessonUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    let settings = await this.userSettingsRepository.findByUserId(
      input.currentUser.id,
    );

    if (!settings) {
      settings = await this.userSettingsRepository.createForUser(
        input.currentUser.id,
      );
    }

    if (!settings.activeTargetLanguage) {
      throw new ApplicationError(
        ErrorCodes.LANGUAGES_REQUIRED,
        'Active target language is required',
      );
    }

    const targetLanguage = settings.activeTargetLanguage;
    const lessonSize = this.resolveLessonSize(
      input.lessonSize,
      settings.lessonSize,
    );

    const ownedDecks = (
      await this.deckRepository.findByOwner(input.currentUser.id)
    ).filter((deck) => deck.targetLanguage === targetLanguage);

    let totalCards = 0;
    const allCardIds: string[] = [];

    for (const deck of ownedDecks) {
      const cards = await this.cardRepository.findByDeckId(deck.id);
      totalCards += cards.length;
      allCardIds.push(...cards.map((card) => card.id));
    }

    const now = new Date();

    await this.ensureCardReviewStatesService.ensureInitialForCards({
      userId: input.currentUser.id,
      cardIds: allCardIds,
      now,
    });

    const dueCardIds =
      await this.cardReviewStateRepository.findDueCardIdsForOwnDecksWithTargetLanguage(
        {
          userId: input.currentUser.id,
          targetLanguage,
          now,
          limit: lessonSize,
        },
      );

    const cards: LessonCard[] = [];
    const selectedCardIds = new Set<string>();

    for (const cardId of dueCardIds) {
      if (selectedCardIds.has(cardId)) {
        continue;
      }

      const card = await this.cardRepository.findById(cardId);

      if (!card) {
        continue;
      }

      const reviewState =
        await this.cardReviewStateRepository.findByUserAndCard(
          input.currentUser.id,
          cardId,
        );

      if (!reviewState) {
        continue;
      }

      const learningStep = reviewState.learningStep;
      const randomBit = this.promptDirectionRandomBitService.nextBit();

      cards.push({
        cardId: card.id,
        deckId: card.deckId,
        front: card.front,
        back: card.back,
        example: card.example,
        notes: card.notes,
        position: card.position,
        learningStep,
        learningGroup: learningGroupForStep(learningStep),
        promptDirection: resolvePromptDirection({ learningStep, randomBit }),
        reviewState,
      });
      selectedCardIds.add(cardId);
    }

    if (cards.length === 0) {
      return {
        sessionId: null,
        deckId: null,
        scope: 'HOME_ACTIVE_TARGET',
        cards: [],
        lessonSize,
        totalCards,
      };
    }

    await this.studySessionRepository.abandonActiveForUser({
      userId: input.currentUser.id,
    });

    const session = await this.studySessionRepository.create({
      userId: input.currentUser.id,
      deckId: null,
      scope: 'HOME_ACTIVE_TARGET',
      lessonSize,
    });

    return {
      sessionId: session.id,
      deckId: null,
      scope: 'HOME_ACTIVE_TARGET',
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
}

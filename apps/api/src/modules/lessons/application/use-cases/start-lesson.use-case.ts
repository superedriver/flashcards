import { Inject, Injectable } from '@nestjs/common';
import {
  learningGroupForStep,
  LearningGroup,
  resolveReviewPresentationMode,
  ReviewPresentationMode,
  toEffectivePresentationMode,
} from '@flashcards/srs';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
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
import {
  createLessonQueueState,
  selectNextLessonCard,
} from '../../domain/services/select-next-lesson-card';
import { CardReviewState, LessonQueueState } from '../../domain/types';
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

export type LessonCard = {
  cardId: string;
  deckId: string;
  front: string;
  back: string;
  example: string | null;
  notes: string | null;
  position: number;
  learningStep: number;
  learningGroup: LearningGroup;
  presentationMode: ReviewPresentationMode;
  reviewState: CardReviewState;
};

export type StartLessonUseCaseInput = {
  currentUser: AuthUser;
  deckId: string;
  lessonSize?: number;
};

export type StartLessonUseCaseResult = {
  sessionId: string | null;
  deckId: string;
  scope: 'DECK';
  cards: LessonCard[];
  lessonSize: number;
  totalCards: number;
};

const UNUSED_DECK_LESSON_SIZE = 0;

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
    private readonly ensureCardReviewStatesService: EnsureCardReviewStatesService,
    private readonly promptDirectionRandomBitService: PromptDirectionRandomBitService,
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

    const totalCards = await this.cardRepository.countByDeckId(input.deckId);
    const emptyPayload: StartLessonUseCaseResult = {
      sessionId: null,
      deckId: input.deckId,
      scope: 'DECK',
      cards: [],
      lessonSize: UNUSED_DECK_LESSON_SIZE,
      totalCards,
    };

    const selection = await this.selectFirstLessonCard({
      userId: input.currentUser.id,
      deckId: input.deckId,
    });

    if (!selection) {
      return emptyPayload;
    }

    await this.studySessionRepository.abandonActiveForUser({
      userId: input.currentUser.id,
    });

    const session = await this.studySessionRepository.create({
      userId: input.currentUser.id,
      deckId: input.deckId,
      scope: 'DECK',
      lessonSize: UNUSED_DECK_LESSON_SIZE,
      snapshotCardIds: [],
      queueState: selection.queueState,
    });

    return {
      sessionId: session.id,
      deckId: input.deckId,
      scope: 'DECK',
      cards: [selection.card],
      lessonSize: UNUSED_DECK_LESSON_SIZE,
      totalCards,
    };
  }

  private async selectFirstLessonCard(input: {
    userId: string;
    deckId: string;
  }): Promise<{
    card: LessonCard;
    queueState: LessonQueueState;
  } | null> {
    const now = new Date();
    const allCards = await this.cardRepository.findByDeckId(input.deckId);

    await this.ensureCardReviewStatesService.ensureInitialForCards({
      userId: input.userId,
      cardIds: allCards.map((card) => card.id),
      now,
    });

    const cardsById = new Map(allCards.map((card) => [card.id, card]));
    const candidates = (
      await this.cardReviewStateRepository.findDueCandidatesForDeck({
        userId: input.userId,
        deckId: input.deckId,
        now,
      })
    ).filter((candidate) => cardsById.has(candidate.cardId));

    const initialState = createLessonQueueState({
      scope: 'DECK',
    });
    const firstCardId = selectNextLessonCard({
      state: initialState,
      candidates,
    });

    if (!firstCardId) {
      return null;
    }

    const card = cardsById.get(firstCardId);

    if (!card) {
      return null;
    }

    const reviewState = await this.cardReviewStateRepository.findByUserAndCard(
      input.userId,
      firstCardId,
    );

    if (!reviewState) {
      return null;
    }

    return {
      card: this.toLessonCard(card, reviewState, false),
      queueState: initialState,
    };
  }

  private toLessonCard(
    card: Card,
    reviewState: CardReviewState,
    audioOnlyDisabled: boolean,
  ): LessonCard {
    const learningStep = reviewState.learningStep;
    const randomBit = this.promptDirectionRandomBitService.nextBit();
    const baseMode = resolveReviewPresentationMode({ learningStep, randomBit });

    return {
      cardId: card.id,
      deckId: card.deckId,
      front: card.front,
      back: card.back,
      example: card.example,
      notes: card.notes,
      position: card.position,
      learningStep,
      learningGroup: learningGroupForStep(learningStep),
      presentationMode: toEffectivePresentationMode(
        baseMode,
        audioOnlyDisabled,
      ),
      reviewState,
    };
  }
}

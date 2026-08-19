import { Inject, Injectable } from '@nestjs/common';
import {
  calculateNextLearningState,
  learningGroupForStep,
  resolvePromptDirection,
} from '@flashcards/srs';
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
import { Card } from '../../../decks/domain/types';
import {
  createLessonQueueState,
  recordLessonCardAnswer,
  selectNextLessonCard,
} from '../../domain/services/select-next-lesson-card';
import {
  CardReviewState,
  LessonQueueCandidate,
  LessonQueueState,
  ReviewAnswer,
  StudySession,
} from '../../domain/types';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';
import {
  STUDY_SESSION_REPOSITORY,
  StudySessionRepositoryPort,
} from '../ports/study-session-repository.port';
import { PromptDirectionRandomBitService } from '../services/prompt-direction-random-bit.service';
import { LessonCard } from './start-lesson.use-case';

export type SubmitReviewUseCaseInput = {
  currentUser: AuthUser;
  sessionId: string;
  cardId: string;
  answer: ReviewAnswer;
};

export type SubmitReviewUseCaseResult = {
  sessionId: string;
  cardId: string;
  reviewState: CardReviewState;
  reviewedCards: number;
  nextCard: LessonCard | null;
};

const MAX_SHOWINGS = 3;

@Injectable()
export class SubmitReviewUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
    @Inject(STUDY_SESSION_REPOSITORY)
    private readonly studySessionRepository: StudySessionRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    private readonly promptDirectionRandomBitService: PromptDirectionRandomBitService,
  ) {}

  async execute(
    input: SubmitReviewUseCaseInput,
  ): Promise<SubmitReviewUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    if (input.answer !== 'KNOW' && input.answer !== 'DONT_KNOW') {
      throw new ApplicationError(
        ErrorCodes.INVALID_REVIEW_ANSWER,
        'Invalid review answer',
      );
    }

    const session = await this.studySessionRepository.findById(input.sessionId);

    if (!session || session.userId !== input.currentUser.id) {
      throw new ApplicationError(
        ErrorCodes.LESSON_NOT_FOUND,
        'Lesson not found',
      );
    }

    if (session.status !== 'ACTIVE') {
      throw new ApplicationError(
        ErrorCodes.LESSON_NOT_ACTIVE,
        'Lesson is not active',
      );
    }

    const card = await this.cardRepository.findById(input.cardId);

    if (!card || card.deletedAt !== null) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    await this.assertCardBelongsToSession(session, card, input.currentUser.id);

    const reviewedAt = new Date();
    const previousReviewState =
      await this.cardReviewStateRepository.createInitialIfMissing({
        userId: input.currentUser.id,
        cardId: input.cardId,
        now: reviewedAt,
      });

    const nextState = calculateNextLearningState({
      answer: input.answer,
      previousLearningStep: previousReviewState.learningStep,
      previousLongReviewSuccessCount:
        previousReviewState.longReviewSuccessCount,
      reviewedAt,
    });

    const reviewState = await this.cardReviewStateRepository.upsert({
      userId: input.currentUser.id,
      cardId: input.cardId,
      learningStep: nextState.learningStep,
      longReviewSuccessCount: nextState.longReviewSuccessCount,
      dueAt: nextState.dueAt,
      lastReviewedAt: reviewedAt,
    });

    await this.studySessionRepository.createReview({
      sessionId: input.sessionId,
      userId: input.currentUser.id,
      deckId: card.deckId,
      cardId: input.cardId,
      answer: input.answer,
      reviewedAt,
      previousLearningStep: previousReviewState.learningStep,
      previousLongReviewSuccessCount:
        previousReviewState.longReviewSuccessCount,
      nextLearningStep: nextState.learningStep,
      nextLongReviewSuccessCount: nextState.longReviewSuccessCount,
      nextDueAt: nextState.dueAt,
    });

    const reviewedCards = await this.studySessionRepository.countReviews(
      input.sessionId,
    );

    const nextCard = await this.selectAndPersistNextCard({
      userId: input.currentUser.id,
      session,
      answeredCardId: input.cardId,
      now: reviewedAt,
    });

    return {
      sessionId: input.sessionId,
      cardId: input.cardId,
      reviewState,
      reviewedCards,
      nextCard,
    };
  }

  private async assertCardBelongsToSession(
    session: StudySession,
    card: Card,
    userId: string,
  ): Promise<void> {
    if (session.scope === 'DECK') {
      if (!session.deckId || card.deckId !== session.deckId) {
        throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
      }

      return;
    }

    const snapshotCardIds =
      session.queueState?.snapshotCardIds ?? session.snapshotCardIds;

    if (!snapshotCardIds.includes(card.id)) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    const deck = await this.deckRepository.findById(card.deckId);

    if (!deck || deck.ownerId !== userId || deck.deletedAt !== null) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }
  }

  private async selectAndPersistNextCard(input: {
    userId: string;
    session: StudySession;
    answeredCardId: string;
    now: Date;
  }): Promise<LessonCard | null> {
    let queueState =
      input.session.queueState ??
      createLessonQueueState({
        scope: input.session.scope,
        snapshotCardIds: input.session.snapshotCardIds,
      });

    const accessibleCandidates = await this.loadAccessibleCandidates({
      userId: input.userId,
      session: { ...input.session, queueState },
      now: input.now,
    });

    queueState = recordLessonCardAnswer({
      state: accessibleCandidates.queueState,
      answeredCardId: input.answeredCardId,
      candidates: accessibleCandidates.candidates,
    });

    const nextCardId = selectNextLessonCard({
      state: queueState,
      candidates: accessibleCandidates.candidates,
    });

    if (!nextCardId) {
      await this.persistQueueState(input.session.id, queueState);
      return null;
    }

    const nextCard = await this.cardRepository.findById(nextCardId);
    const reviewState = await this.cardReviewStateRepository.findByUserAndCard(
      input.userId,
      nextCardId,
    );

    if (!nextCard || !reviewState) {
      queueState = excludeCardFromQueue(queueState, nextCardId);
      await this.persistQueueState(input.session.id, queueState);
      return null;
    }

    await this.persistQueueState(input.session.id, queueState);

    return this.toLessonCard(nextCard, reviewState);
  }

  private async loadAccessibleCandidates(input: {
    userId: string;
    session: StudySession;
    now: Date;
  }): Promise<{
    candidates: LessonQueueCandidate[];
    queueState: LessonQueueState;
  }> {
    let queueState =
      input.session.queueState ??
      createLessonQueueState({
        scope: input.session.scope,
        snapshotCardIds: input.session.snapshotCardIds,
      });

    const rawCandidates = await this.loadDueCandidates({
      userId: input.userId,
      session: { ...input.session, queueState },
      now: input.now,
    });

    const candidates: LessonQueueCandidate[] = [];

    for (const candidate of rawCandidates) {
      const isAccessible = await this.isCandidateAccessible({
        userId: input.userId,
        session: { ...input.session, queueState },
        cardId: candidate.cardId,
      });

      if (!isAccessible) {
        queueState = excludeCardFromQueue(queueState, candidate.cardId);
        continue;
      }

      candidates.push(candidate);
    }

    return { candidates, queueState };
  }

  private async loadDueCandidates(input: {
    userId: string;
    session: StudySession;
    now: Date;
  }): Promise<LessonQueueCandidate[]> {
    if (input.session.scope === 'DECK' && input.session.deckId) {
      return this.cardReviewStateRepository.findDueCandidatesForDeck({
        userId: input.userId,
        deckId: input.session.deckId,
        now: input.now,
      });
    }

    const settings = await this.userSettingsRepository.findByUserId(
      input.userId,
    );
    const targetLanguage = settings?.activeTargetLanguage;

    if (!targetLanguage) {
      return [];
    }

    const snapshotCardIds =
      input.session.queueState?.snapshotCardIds ??
      input.session.snapshotCardIds;
    const snapshot = new Set(snapshotCardIds);

    const due =
      await this.cardReviewStateRepository.findDueCandidatesForOwnDecksWithTargetLanguage(
        {
          userId: input.userId,
          targetLanguage,
          now: input.now,
        },
      );

    return due.filter((candidate) => snapshot.has(candidate.cardId));
  }

  private async isCandidateAccessible(input: {
    userId: string;
    session: StudySession;
    cardId: string;
  }): Promise<boolean> {
    const card = await this.cardRepository.findById(input.cardId);

    if (!card || card.deletedAt !== null) {
      return false;
    }

    if (input.session.scope === 'DECK') {
      return Boolean(
        input.session.deckId && card.deckId === input.session.deckId,
      );
    }

    const snapshotCardIds =
      input.session.queueState?.snapshotCardIds ??
      input.session.snapshotCardIds;

    if (!snapshotCardIds.includes(card.id)) {
      return false;
    }

    const deck = await this.deckRepository.findById(card.deckId);

    return Boolean(
      deck && deck.ownerId === input.userId && deck.deletedAt === null,
    );
  }

  private async persistQueueState(
    sessionId: string,
    queueState: LessonQueueState,
  ): Promise<void> {
    await this.studySessionRepository.update({
      sessionId,
      snapshotCardIds: queueState.snapshotCardIds,
      queueState,
    });
  }

  private toLessonCard(card: Card, reviewState: CardReviewState): LessonCard {
    const learningStep = reviewState.learningStep;
    const randomBit = this.promptDirectionRandomBitService.nextBit();

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
      promptDirection: resolvePromptDirection({ learningStep, randomBit }),
      reviewState,
    };
  }
}

function excludeCardFromQueue(
  state: LessonQueueState,
  cardId: string,
): LessonQueueState {
  const pendingRepeats = { ...state.pendingRepeats };
  delete pendingRepeats[cardId];

  return {
    scope: state.scope,
    snapshotCardIds: state.snapshotCardIds.filter((id) => id !== cardId),
    showCounts: {
      ...state.showCounts,
      [cardId]: MAX_SHOWINGS,
    },
    pendingRepeats,
  };
}

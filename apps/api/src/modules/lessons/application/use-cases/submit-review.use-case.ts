import { Inject, Injectable } from '@nestjs/common';
import { calculateNextReview, Sm2Quality } from '@flashcards/srs';
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
import { CardReviewState, ReviewAnswer } from '../../domain/types';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../ports/card-review-state-repository.port';
import {
  STUDY_SESSION_REPOSITORY,
  StudySessionRepositoryPort,
} from '../ports/study-session-repository.port';

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
};

const ANSWER_QUALITY_MAP: Record<ReviewAnswer, Sm2Quality> = {
  KNOW: 4,
  DONT_KNOW: 1,
};

@Injectable()
export class SubmitReviewUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
    @Inject(STUDY_SESSION_REPOSITORY)
    private readonly studySessionRepository: StudySessionRepositoryPort,
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

    if (!card || card.deckId !== session.deckId) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    const alreadyReviewed = await this.studySessionRepository.hasReviewForCard({
      sessionId: input.sessionId,
      cardId: input.cardId,
    });

    if (alreadyReviewed) {
      throw new ApplicationError(
        ErrorCodes.LESSON_CARD_ALREADY_REVIEWED,
        'Card already reviewed in this lesson',
      );
    }

    const reviewedAt = new Date();
    const quality = ANSWER_QUALITY_MAP[input.answer];
    const previousReviewState =
      await this.cardReviewStateRepository.findByUserAndCard(
        input.currentUser.id,
        input.cardId,
      );
    const nextReview = calculateNextReview({
      quality,
      previousEaseFactor: previousReviewState?.easeFactor ?? null,
      previousIntervalDays: previousReviewState?.intervalDays ?? null,
      previousRepetitions: previousReviewState?.repetitions ?? null,
      reviewedAt,
    });

    const reviewState = await this.cardReviewStateRepository.upsert({
      userId: input.currentUser.id,
      cardId: input.cardId,
      easeFactor: nextReview.easeFactor,
      intervalDays: nextReview.intervalDays,
      repetitions: nextReview.repetitions,
      dueAt: nextReview.dueAt,
      lastReviewedAt: reviewedAt,
    });

    await this.studySessionRepository.createReview({
      sessionId: input.sessionId,
      userId: input.currentUser.id,
      deckId: session.deckId,
      cardId: input.cardId,
      answer: input.answer,
      quality,
      reviewedAt,
      previousEaseFactor: previousReviewState?.easeFactor ?? null,
      previousIntervalDays: previousReviewState?.intervalDays ?? null,
      previousRepetitions: previousReviewState?.repetitions ?? null,
      nextEaseFactor: nextReview.easeFactor,
      nextIntervalDays: nextReview.intervalDays,
      nextRepetitions: nextReview.repetitions,
      nextDueAt: nextReview.dueAt,
    });

    const reviewedCards = await this.studySessionRepository.countReviews(
      input.sessionId,
    );

    return {
      sessionId: input.sessionId,
      cardId: input.cardId,
      reviewState,
      reviewedCards,
    };
  }
}

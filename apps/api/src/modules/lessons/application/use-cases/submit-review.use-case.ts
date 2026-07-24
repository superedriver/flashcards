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
import { CardReviewState, ReviewAnswer } from '../../domain/types';
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

    if (!card) {
      throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
    }

    if (session.scope === 'DECK') {
      if (!session.deckId || card.deckId !== session.deckId) {
        throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
      }
    } else {
      const deck = await this.deckRepository.findById(card.deckId);

      if (!deck || deck.ownerId !== input.currentUser.id) {
        throw new ApplicationError(ErrorCodes.CARD_NOT_FOUND, 'Card not found');
      }
    }

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

    const nextCard =
      reviewedCards < session.lessonSize
        ? await this.findNextDueLessonCard({
            userId: input.currentUser.id,
            sessionScope: session.scope,
            sessionDeckId: session.deckId,
            now: reviewedAt,
          })
        : null;

    return {
      sessionId: input.sessionId,
      cardId: input.cardId,
      reviewState,
      reviewedCards,
      nextCard,
    };
  }

  private async findNextDueLessonCard(input: {
    userId: string;
    sessionScope: 'DECK' | 'HOME_ACTIVE_TARGET';
    sessionDeckId: string | null;
    now: Date;
  }): Promise<LessonCard | null> {
    let dueCardIds: string[] = [];

    if (input.sessionScope === 'DECK' && input.sessionDeckId) {
      dueCardIds = await this.cardReviewStateRepository.findDueCardIdsForDeck({
        userId: input.userId,
        deckId: input.sessionDeckId,
        now: input.now,
        limit: 1,
      });
    } else {
      const settings = await this.userSettingsRepository.findByUserId(
        input.userId,
      );
      const targetLanguage = settings?.activeTargetLanguage;

      if (!targetLanguage) {
        return null;
      }

      dueCardIds =
        await this.cardReviewStateRepository.findDueCardIdsForOwnDecksWithTargetLanguage(
          {
            userId: input.userId,
            targetLanguage,
            now: input.now,
            limit: 1,
          },
        );
    }

    const cardId = dueCardIds[0];

    if (!cardId) {
      return null;
    }

    const card = await this.cardRepository.findById(cardId);
    const reviewState = await this.cardReviewStateRepository.findByUserAndCard(
      input.userId,
      cardId,
    );

    if (!card || !reviewState) {
      return null;
    }

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

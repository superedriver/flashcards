import { Inject, Injectable } from '@nestjs/common';
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
  STUDY_SESSION_REPOSITORY,
  StudySessionRepositoryPort,
} from '../ports/study-session-repository.port';

export type CompleteLessonUseCaseInput = {
  currentUser: AuthUser;
  sessionId: string;
};

export type CompleteLessonUseCaseResult = {
  sessionId: string;
  deckId: string;
  totalCards: number;
  reviewedCards: number;
  knownCount: number;
  dontKnowCount: number;
  completedAt: Date;
};

@Injectable()
export class CompleteLessonUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(CARD_REPOSITORY)
    private readonly cardRepository: CardRepositoryPort,
    @Inject(STUDY_SESSION_REPOSITORY)
    private readonly studySessionRepository: StudySessionRepositoryPort,
  ) {}

  async execute(
    input: CompleteLessonUseCaseInput,
  ): Promise<CompleteLessonUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
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

    const reviewedCards = await this.studySessionRepository.countReviews(
      input.sessionId,
    );
    const knownCount = await this.studySessionRepository.countReviewsByAnswer({
      sessionId: input.sessionId,
      answer: 'KNOW',
    });
    const dontKnowCount =
      await this.studySessionRepository.countReviewsByAnswer({
        sessionId: input.sessionId,
        answer: 'DONT_KNOW',
      });
    const completedAt = new Date();

    await this.studySessionRepository.complete(input.sessionId, completedAt);

    const totalCards = await this.cardRepository.countByDeckId(session.deckId);

    return {
      sessionId: input.sessionId,
      deckId: session.deckId,
      totalCards,
      reviewedCards,
      knownCount,
      dontKnowCount,
      completedAt,
    };
  }
}

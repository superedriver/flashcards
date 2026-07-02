import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import {
  STUDY_SESSION_REPOSITORY,
  StudySessionRepositoryPort,
} from '../ports/study-session-repository.port';

export type AbandonLessonUseCaseInput = {
  currentUser: AuthUser;
  sessionId: string;
};

export type AbandonLessonUseCaseResult = {
  success: boolean;
};

@Injectable()
export class AbandonLessonUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(STUDY_SESSION_REPOSITORY)
    private readonly studySessionRepository: StudySessionRepositoryPort,
  ) {}

  async execute(
    input: AbandonLessonUseCaseInput,
  ): Promise<AbandonLessonUseCaseResult> {
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

    if (session.status === 'ABANDONED' || session.status === 'COMPLETED') {
      return { success: true };
    }

    await this.studySessionRepository.abandon(input.sessionId, new Date());

    return { success: true };
  }
}

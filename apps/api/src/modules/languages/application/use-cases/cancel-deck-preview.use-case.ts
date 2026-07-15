import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import {
  DECK_PREVIEW_SESSION_REPOSITORY,
  DeckPreviewSessionRepositoryPort,
} from '../ports/deck-preview-session-repository.port';

export type CancelDeckPreviewUseCaseInput = {
  currentUserId: string;
  sessionId: string;
};

export type CancelDeckPreviewUseCaseResult = boolean;

@Injectable()
export class CancelDeckPreviewUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_PREVIEW_SESSION_REPOSITORY)
    private readonly deckPreviewSessionRepository: DeckPreviewSessionRepositoryPort,
  ) {}

  async execute(
    input: CancelDeckPreviewUseCaseInput,
  ): Promise<CancelDeckPreviewUseCaseResult> {
    await this.ensureActiveUser(input.currentUserId);

    const session = await this.deckPreviewSessionRepository.findById(
      input.sessionId,
    );

    if (!session || session.userId !== input.currentUserId) {
      throw new ApplicationError(
        ErrorCodes.PREVIEW_SESSION_NOT_FOUND,
        'Preview session not found',
      );
    }

    await this.deckPreviewSessionRepository.delete(session.id);
    return true;
  }

  private async ensureActiveUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }
  }
}

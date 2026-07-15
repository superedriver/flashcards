import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { DeckPreviewSession } from '../../domain/types';
import {
  DECK_PREVIEW_SESSION_REPOSITORY,
  DeckPreviewSessionRepositoryPort,
} from '../ports/deck-preview-session-repository.port';

export type GetActiveDeckPreviewUseCaseInput = {
  currentUserId: string;
  now?: Date;
};

export type GetActiveDeckPreviewUseCaseResult = DeckPreviewSession | null;

@Injectable()
export class GetActiveDeckPreviewUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_PREVIEW_SESSION_REPOSITORY)
    private readonly deckPreviewSessionRepository: DeckPreviewSessionRepositoryPort,
  ) {}

  async execute(
    input: GetActiveDeckPreviewUseCaseInput,
  ): Promise<GetActiveDeckPreviewUseCaseResult> {
    await this.ensureActiveUser(input.currentUserId);
    const now = input.now ?? new Date();

    return this.deckPreviewSessionRepository.findActiveByUserId(
      input.currentUserId,
      now,
    );
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

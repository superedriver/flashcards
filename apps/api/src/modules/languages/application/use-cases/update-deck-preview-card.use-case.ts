import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { DeckPreviewSession, DeckPreviewSessionCard } from '../../domain/types';
import {
  DECK_PREVIEW_SESSION_REPOSITORY,
  DeckPreviewSessionRepositoryPort,
} from '../ports/deck-preview-session-repository.port';

export type UpdateDeckPreviewCardUseCaseInput = {
  currentUserId: string;
  sessionId: string;
  cardIndex: number;
  back?: string;
  example?: string | null;
  now?: Date;
};

export type UpdateDeckPreviewCardUseCaseResult = DeckPreviewSession;

@Injectable()
export class UpdateDeckPreviewCardUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(DECK_PREVIEW_SESSION_REPOSITORY)
    private readonly deckPreviewSessionRepository: DeckPreviewSessionRepositoryPort,
  ) {}

  async execute(
    input: UpdateDeckPreviewCardUseCaseInput,
  ): Promise<UpdateDeckPreviewCardUseCaseResult> {
    await this.ensureActiveUser(input.currentUserId);
    const now = input.now ?? new Date();

    const session = await this.deckPreviewSessionRepository.findById(
      input.sessionId,
    );

    if (!session || session.userId !== input.currentUserId) {
      throw new ApplicationError(
        ErrorCodes.PREVIEW_SESSION_NOT_FOUND,
        'Preview session not found',
      );
    }

    if (session.status === 'EXPIRED' || session.expiresAt <= now) {
      throw new ApplicationError(
        ErrorCodes.PREVIEW_SESSION_NOT_FOUND,
        'Preview session not found',
      );
    }

    if (
      !Number.isInteger(input.cardIndex) ||
      input.cardIndex < 0 ||
      input.cardIndex >= session.cards.length
    ) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Card index is out of range',
      );
    }

    const cards: DeckPreviewSessionCard[] = session.cards.map((card, index) => {
      if (index !== input.cardIndex) {
        return card;
      }

      const next: DeckPreviewSessionCard = {
        ...card,
      };

      if (input.back !== undefined) {
        next.back = input.back;
        delete next.backError;
      }

      if (input.example !== undefined) {
        next.example = input.example;
        delete next.exampleError;
      }

      return next;
    });

    return this.deckPreviewSessionRepository.updateCards({
      sessionId: session.id,
      cards,
    });
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

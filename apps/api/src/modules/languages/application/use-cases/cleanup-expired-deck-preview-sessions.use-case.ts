import { Inject, Injectable } from '@nestjs/common';
import {
  DECK_PREVIEW_SESSION_REPOSITORY,
  DeckPreviewSessionRepositoryPort,
} from '../ports/deck-preview-session-repository.port';

export type CleanupExpiredDeckPreviewSessionsInput = {
  now: Date;
};

export type CleanupExpiredDeckPreviewSessionsResult = {
  deletedCount: number;
};

@Injectable()
export class CleanupExpiredDeckPreviewSessionsUseCase {
  constructor(
    @Inject(DECK_PREVIEW_SESSION_REPOSITORY)
    private readonly deckPreviewSessionRepository: DeckPreviewSessionRepositoryPort,
  ) {}

  async execute(
    input: CleanupExpiredDeckPreviewSessionsInput,
  ): Promise<CleanupExpiredDeckPreviewSessionsResult> {
    const deletedCount =
      await this.deckPreviewSessionRepository.deleteExpiredSessions(input.now);

    return { deletedCount };
  }
}

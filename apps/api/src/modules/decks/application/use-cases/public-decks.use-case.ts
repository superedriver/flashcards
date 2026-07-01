import { Inject, Injectable } from '@nestjs/common';
import { Deck } from '../../domain/types';
import {
  DECK_REPOSITORY,
  DeckRepositoryPort,
} from '../ports/deck-repository.port';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MIN_LIMIT = 1;
const DEFAULT_OFFSET = 0;

export type PublicDecksUseCaseInput = {
  query?: string | null;
  limit?: number;
  offset?: number;
};

export type PublicDecksUseCaseResult = {
  items: Deck[];
  total: number;
};

@Injectable()
export class PublicDecksUseCase {
  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly deckRepository: DeckRepositoryPort,
  ) {}

  async execute(
    input: PublicDecksUseCaseInput,
  ): Promise<PublicDecksUseCaseResult> {
    const query = this.normalizeQuery(input.query);
    const limit = this.normalizeLimit(input.limit);
    const offset = this.normalizeOffset(input.offset);

    return this.deckRepository.searchPublicApproved({
      query,
      limit,
      offset,
    });
  }

  private normalizeQuery(query?: string | null): string | null {
    if (query == null) {
      return null;
    }

    const trimmed = query.trim();

    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeLimit(limit?: number): number {
    const value = limit ?? DEFAULT_LIMIT;

    return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, value));
  }

  private normalizeOffset(offset?: number): number {
    const value = offset ?? DEFAULT_OFFSET;

    return Math.max(DEFAULT_OFFSET, value);
  }
}

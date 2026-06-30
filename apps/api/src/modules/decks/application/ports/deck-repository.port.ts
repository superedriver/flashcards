import { Deck } from '../../domain/types';

export const DECK_REPOSITORY = Symbol('DECK_REPOSITORY');

export type CreateDeckInput = {
  ownerId: string;
  title: string;
  description?: string | null;
};

export type UpdateDeckInput = {
  deckId: string;
  title?: string;
  description?: string | null;
};

export type PublicDeckSearchInput = {
  query?: string | null;
  limit: number;
  offset: number;
};

export type PublicDeckSearchResult = {
  items: Deck[];
  total: number;
};

export type PublishDeckInput = {
  deckId: string;
};

export type UnpublishDeckInput = {
  deckId: string;
};

export type CreateCopiedDeckInput = {
  ownerId: string;
  sourceDeckId: string;
  title: string;
  description?: string | null;
};

export type DeckRepositoryPort = {
  create(input: CreateDeckInput): Promise<Deck>;
  findById(deckId: string): Promise<Deck | null>;
  findByOwner(ownerId: string): Promise<Deck[]>;
  update(input: UpdateDeckInput): Promise<Deck>;
  softDelete(deckId: string): Promise<void>;
  publish(input: PublishDeckInput): Promise<Deck>;
  unpublish(input: UnpublishDeckInput): Promise<Deck>;
  findPublicApprovedById(deckId: string): Promise<Deck | null>;
  searchPublicApproved(
    input: PublicDeckSearchInput,
  ): Promise<PublicDeckSearchResult>;
  createCopiedDeck(input: CreateCopiedDeckInput): Promise<Deck>;
};

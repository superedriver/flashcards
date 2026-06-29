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

export type DeckRepositoryPort = {
  create(input: CreateDeckInput): Promise<Deck>;
  findById(deckId: string): Promise<Deck | null>;
  findByOwner(ownerId: string): Promise<Deck[]>;
  update(input: UpdateDeckInput): Promise<Deck>;
  softDelete(deckId: string): Promise<void>;
};

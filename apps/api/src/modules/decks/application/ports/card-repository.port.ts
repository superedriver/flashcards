import { Card } from '../../domain/types';

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');

export type CreateCardInput = {
  deckId: string;
  front: string;
  back: string;
  example?: string | null;
  notes?: string | null;
  position?: number;
};

export type UpdateCardInput = {
  cardId: string;
  front?: string;
  back?: string;
  example?: string | null;
  notes?: string | null;
  position?: number;
};

export type CardRepositoryPort = {
  create(input: CreateCardInput): Promise<Card>;
  findById(cardId: string): Promise<Card | null>;
  findByDeckId(deckId: string): Promise<Card[]>;
  update(input: UpdateCardInput): Promise<Card>;
  softDelete(cardId: string): Promise<void>;
  softDeleteByDeckId(deckId: string): Promise<void>;
  countByDeckId(deckId: string): Promise<number>;
};

import { CardReviewState } from '../../domain/types';

export const CARD_REVIEW_STATE_REPOSITORY = Symbol(
  'CARD_REVIEW_STATE_REPOSITORY',
);

export type UpsertCardReviewStateInput = {
  userId: string;
  cardId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
  lastReviewedAt: Date;
};

export type CardReviewStateRepositoryPort = {
  findByUserAndCard(
    userId: string,
    cardId: string,
  ): Promise<CardReviewState | null>;
  findDueCardIdsForDeck(input: {
    userId: string;
    deckId: string;
    now: Date;
    limit: number;
  }): Promise<string[]>;
  countReviewedForDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<number>;
  countDueForDeck(input: {
    userId: string;
    deckId: string;
    now: Date;
  }): Promise<number>;
  countDueForUser(input: { userId: string; now: Date }): Promise<number>;
  findNextDueAtForDeck(input: {
    userId: string;
    deckId: string;
    now: Date;
  }): Promise<Date | null>;
  upsert(input: UpsertCardReviewStateInput): Promise<CardReviewState>;
};

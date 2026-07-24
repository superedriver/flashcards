import { CardReviewState } from '../../domain/types';

export const CARD_REVIEW_STATE_REPOSITORY = Symbol(
  'CARD_REVIEW_STATE_REPOSITORY',
);

export type UpsertCardReviewStateInput = {
  userId: string;
  cardId: string;
  learningStep: number;
  longReviewSuccessCount: number;
  dueAt: Date;
  lastReviewedAt: Date | null;
};

export type LearningGroupCounts = {
  toLearnCount: number;
  practicedCount: number;
  learnedCount: number;
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
  findDueCardIdsForOwnDecksWithTargetLanguage(input: {
    userId: string;
    targetLanguage: string;
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
  countDueForOwnDecksWithTargetLanguage(input: {
    userId: string;
    targetLanguage: string;
    now: Date;
  }): Promise<number>;
  countLearningGroupsForDeck(input: {
    userId: string;
    deckId: string;
  }): Promise<LearningGroupCounts>;
  countLearningGroupsForOwnDecksWithTargetLanguage(input: {
    userId: string;
    targetLanguage: string;
  }): Promise<LearningGroupCounts>;
  findNextDueAtForDeck(input: {
    userId: string;
    deckId: string;
    now: Date;
  }): Promise<Date | null>;
  createInitialIfMissing(input: {
    userId: string;
    cardId: string;
    now?: Date;
  }): Promise<CardReviewState>;
  createInitialMany(input: {
    userId: string;
    cardIds: string[];
    now?: Date;
  }): Promise<void>;
  upsert(input: UpsertCardReviewStateInput): Promise<CardReviewState>;
};

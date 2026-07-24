export type DeckLearningStats = {
  deckId: string;
  totalCards: number;
  toLearnCount: number;
  practicedCount: number;
  learnedCount: number;
  dueCount: number;
  nextDueAt: Date | null;
};

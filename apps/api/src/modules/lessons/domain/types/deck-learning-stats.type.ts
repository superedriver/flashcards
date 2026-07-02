export type DeckLearningStats = {
  deckId: string;
  totalCards: number;
  newCards: number;
  dueCards: number;
  reviewedCards: number;
  nextDueAt: Date | null;
};

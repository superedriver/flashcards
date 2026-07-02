export type CardReviewState = {
  id: string;
  userId: string;
  cardId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

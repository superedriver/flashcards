export type CardReviewState = {
  id: string;
  userId: string;
  cardId: string;
  learningStep: number;
  longReviewSuccessCount: number;
  dueAt: Date;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

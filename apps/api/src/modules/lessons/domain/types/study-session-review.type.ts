import { ReviewAnswer } from './review-answer.type';

export type StudySessionReview = {
  id: string;
  sessionId: string;
  userId: string;
  deckId: string;
  cardId: string;
  answer: ReviewAnswer;
  reviewedAt: Date;
  previousLearningStep: number | null;
  previousLongReviewSuccessCount: number | null;
  nextLearningStep: number;
  nextLongReviewSuccessCount: number;
  nextDueAt: Date;
  createdAt: Date;
};

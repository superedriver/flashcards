import { ReviewAnswer } from './review-answer.type';

export type StudySessionReview = {
  id: string;
  sessionId: string;
  userId: string;
  deckId: string;
  cardId: string;
  answer: ReviewAnswer;
  quality: number;
  reviewedAt: Date;
  previousEaseFactor: number | null;
  previousIntervalDays: number | null;
  previousRepetitions: number | null;
  nextEaseFactor: number;
  nextIntervalDays: number;
  nextRepetitions: number;
  nextDueAt: Date;
  createdAt: Date;
};

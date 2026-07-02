import { ReviewAnswer, StudySessionReview } from '../../domain/types';

type PrismaStudySessionReviewRecord = {
  id: string;
  sessionId: string;
  userId: string;
  deckId: string;
  cardId: string;
  answer: string;
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

export function toStudySessionReview(
  record: PrismaStudySessionReviewRecord,
): StudySessionReview {
  return {
    id: record.id,
    sessionId: record.sessionId,
    userId: record.userId,
    deckId: record.deckId,
    cardId: record.cardId,
    answer: record.answer as ReviewAnswer,
    quality: record.quality,
    reviewedAt: record.reviewedAt,
    previousEaseFactor: record.previousEaseFactor,
    previousIntervalDays: record.previousIntervalDays,
    previousRepetitions: record.previousRepetitions,
    nextEaseFactor: record.nextEaseFactor,
    nextIntervalDays: record.nextIntervalDays,
    nextRepetitions: record.nextRepetitions,
    nextDueAt: record.nextDueAt,
    createdAt: record.createdAt,
  };
}

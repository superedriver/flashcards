import { ReviewAnswer, StudySessionReview } from '../../domain/types';

type PrismaStudySessionReviewRecord = {
  id: string;
  sessionId: string;
  userId: string;
  deckId: string;
  cardId: string;
  answer: string;
  reviewedAt: Date;
  previousLearningStep: number | null;
  previousLongReviewSuccessCount: number | null;
  nextLearningStep: number;
  nextLongReviewSuccessCount: number;
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
    reviewedAt: record.reviewedAt,
    previousLearningStep: record.previousLearningStep,
    previousLongReviewSuccessCount: record.previousLongReviewSuccessCount,
    nextLearningStep: record.nextLearningStep,
    nextLongReviewSuccessCount: record.nextLongReviewSuccessCount,
    nextDueAt: record.nextDueAt,
    createdAt: record.createdAt,
  };
}

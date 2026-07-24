import { CardReviewState } from '../../domain/types';

type PrismaCardReviewStateRecord = {
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

export function toCardReviewState(
  record: PrismaCardReviewStateRecord,
): CardReviewState {
  return {
    id: record.id,
    userId: record.userId,
    cardId: record.cardId,
    learningStep: record.learningStep,
    longReviewSuccessCount: record.longReviewSuccessCount,
    dueAt: record.dueAt,
    lastReviewedAt: record.lastReviewedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

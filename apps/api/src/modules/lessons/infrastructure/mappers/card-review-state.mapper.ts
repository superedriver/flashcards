import { CardReviewState } from '../../domain/types';

type PrismaCardReviewStateRecord = {
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

export function toCardReviewState(
  record: PrismaCardReviewStateRecord,
): CardReviewState {
  return {
    id: record.id,
    userId: record.userId,
    cardId: record.cardId,
    easeFactor: record.easeFactor,
    intervalDays: record.intervalDays,
    repetitions: record.repetitions,
    dueAt: record.dueAt,
    lastReviewedAt: record.lastReviewedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

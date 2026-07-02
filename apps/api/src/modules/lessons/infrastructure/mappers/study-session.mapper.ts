import { StudySession, StudySessionStatus } from '../../domain/types';

type PrismaStudySessionRecord = {
  id: string;
  userId: string;
  deckId: string;
  status: string;
  lessonSize: number;
  startedAt: Date;
  completedAt: Date | null;
  abandonedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toStudySession(record: PrismaStudySessionRecord): StudySession {
  return {
    id: record.id,
    userId: record.userId,
    deckId: record.deckId,
    status: record.status as StudySessionStatus,
    lessonSize: record.lessonSize,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    abandonedAt: record.abandonedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

import {
  StudySession,
  StudySessionScope,
  StudySessionStatus,
} from '../../domain/types';

type PrismaStudySessionRecord = {
  id: string;
  userId: string;
  deckId: string | null;
  scope: string;
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
    scope: record.scope as StudySessionScope,
    status: record.status as StudySessionStatus,
    lessonSize: record.lessonSize,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    abandonedAt: record.abandonedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

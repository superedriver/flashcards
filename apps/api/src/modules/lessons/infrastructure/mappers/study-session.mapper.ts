import {
  LessonQueuePendingRepeat,
  LessonQueueState,
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
  snapshotCardIds: string[];
  queueState: unknown;
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
    snapshotCardIds: record.snapshotCardIds,
    queueState: parseLessonQueueState(record.queueState),
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    abandonedAt: record.abandonedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function parseLessonQueueState(value: unknown): LessonQueueState | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (record.scope !== 'DECK' && record.scope !== 'HOME_ACTIVE_TARGET') {
    return null;
  }

  if (!isStringArray(record.snapshotCardIds)) {
    return null;
  }

  if (!isShowCounts(record.showCounts)) {
    return null;
  }

  if (!isPendingRepeats(record.pendingRepeats)) {
    return null;
  }

  return {
    scope: record.scope,
    snapshotCardIds: record.snapshotCardIds,
    showCounts: record.showCounts,
    pendingRepeats: record.pendingRepeats,
  };
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function isShowCounts(value: unknown): value is Record<string, number> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((item) => typeof item === 'number');
}

function isPendingRepeats(
  value: unknown,
): value is Record<string, LessonQueuePendingRepeat> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((item) => {
    if (!isRecord(item)) {
      return false;
    }

    return (
      typeof item.targetGap === 'number' && typeof item.filled === 'number'
    );
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

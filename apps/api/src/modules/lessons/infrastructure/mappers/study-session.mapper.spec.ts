import { toStudySession } from './study-session.mapper';

const queueState = {
  scope: 'HOME_ACTIVE_TARGET',
  snapshotCardIds: ['card-1', 'card-2'],
  showCounts: { 'card-1': 1 },
  pendingRepeats: { 'card-1': { targetGap: 2, filled: 1 } },
};

const prismaRecord = {
  id: 'session-1',
  userId: 'user-1',
  deckId: 'deck-1',
  scope: 'DECK',
  status: 'ACTIVE',
  lessonSize: 20,
  snapshotCardIds: ['card-1'],
  queueState,
  startedAt: new Date('2026-06-01T00:00:00.000Z'),
  completedAt: null,
  abandonedAt: null,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('study-session.mapper', () => {
  it('toStudySession maps status, scope, snapshot and queueState', () => {
    expect(toStudySession(prismaRecord)).toEqual({
      id: 'session-1',
      userId: 'user-1',
      deckId: 'deck-1',
      scope: 'DECK',
      status: 'ACTIVE',
      lessonSize: 20,
      snapshotCardIds: ['card-1'],
      queueState,
      startedAt: prismaRecord.startedAt,
      completedAt: null,
      abandonedAt: null,
      createdAt: prismaRecord.createdAt,
      updatedAt: prismaRecord.updatedAt,
    });
  });

  it('toStudySession casts status and scope to domain enums', () => {
    const mapped = toStudySession({
      ...prismaRecord,
      scope: 'HOME_ACTIVE_TARGET',
      deckId: null,
      status: 'COMPLETED',
      snapshotCardIds: [],
      queueState: null,
      completedAt: new Date('2026-06-01T12:00:00.000Z'),
    });

    expect(mapped.scope).toBe('HOME_ACTIVE_TARGET');
    expect(mapped.deckId).toBeNull();
    expect(mapped.status).toBe('COMPLETED');
    expect(mapped.snapshotCardIds).toEqual([]);
    expect(mapped.queueState).toBeNull();
    expect(mapped.completedAt).toEqual(new Date('2026-06-01T12:00:00.000Z'));
  });

  it('toStudySession maps invalid queueState to null', () => {
    const mapped = toStudySession({
      ...prismaRecord,
      queueState: { invalid: true },
    });

    expect(mapped.queueState).toBeNull();
  });
});

import { toStudySession } from './study-session.mapper';

const prismaRecord = {
  id: 'session-1',
  userId: 'user-1',
  deckId: 'deck-1',
  scope: 'DECK',
  status: 'ACTIVE',
  lessonSize: 20,
  startedAt: new Date('2026-06-01T00:00:00.000Z'),
  completedAt: null,
  abandonedAt: null,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('study-session.mapper', () => {
  it('toStudySession maps status, scope and timestamps', () => {
    expect(toStudySession(prismaRecord)).toEqual({
      id: 'session-1',
      userId: 'user-1',
      deckId: 'deck-1',
      scope: 'DECK',
      status: 'ACTIVE',
      lessonSize: 20,
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
      completedAt: new Date('2026-06-01T12:00:00.000Z'),
    });

    expect(mapped.scope).toBe('HOME_ACTIVE_TARGET');
    expect(mapped.deckId).toBeNull();
    expect(mapped.status).toBe('COMPLETED');
    expect(mapped.completedAt).toEqual(new Date('2026-06-01T12:00:00.000Z'));
  });
});

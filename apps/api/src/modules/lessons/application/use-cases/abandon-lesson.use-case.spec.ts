import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { StudySession } from '../../domain/types';
import { AbandonLessonUseCase } from './abandon-lesson.use-case';

const authUser: AuthUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const activeSession: StudySession = {
  id: 'session-1',
  userId: 'owner-1',
  deckId: 'deck-1',
  status: 'ACTIVE',
  lessonSize: 20,
  startedAt: new Date('2026-06-01T00:00:00.000Z'),
  completedAt: null,
  abandonedAt: null,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  session?: StudySession | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findSessionById = jest
    .fn()
    .mockResolvedValue(
      options?.session === undefined ? activeSession : options.session,
    );
  const abandon = jest.fn().mockResolvedValue({
    ...activeSession,
    status: 'ABANDONED' as const,
    abandonedAt: new Date('2026-06-01T12:00:00.000Z'),
  });

  const useCase = new AbandonLessonUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      abandonActiveForUserAndDeck: jest.fn(),
      create: jest.fn(),
      findById: findSessionById,
      createReview: jest.fn(),
      hasReviewForCard: jest.fn(),
      countReviews: jest.fn(),
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon,
    },
  );

  return { useCase, abandon };
}

describe('AbandonLessonUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser, sessionId: 'session-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws LESSON_NOT_FOUND when session is missing', async () => {
    const { useCase } = createUseCase({ session: null });

    await expect(
      useCase.execute({ currentUser: authUser, sessionId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_FOUND });
  });

  it('throws LESSON_NOT_FOUND when session belongs to another user', async () => {
    const { useCase } = createUseCase({
      session: { ...activeSession, userId: 'other-user' },
    });

    await expect(
      useCase.execute({ currentUser: authUser, sessionId: 'session-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_FOUND });
  });

  it('abandons own ACTIVE session (calls repository abandon)', async () => {
    const { useCase, abandon } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });

    expect(abandon).toHaveBeenCalledWith('session-1', expect.any(Date));
    expect(result).toEqual({ success: true });
  });

  it('returns success true for own already ABANDONED session (idempotent)', async () => {
    const { useCase, abandon } = createUseCase({
      session: {
        ...activeSession,
        status: 'ABANDONED',
        abandonedAt: new Date('2026-06-01T10:00:00.000Z'),
      },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });

    expect(abandon).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('returns success true for own already COMPLETED session (idempotent)', async () => {
    const { useCase, abandon } = createUseCase({
      session: {
        ...activeSession,
        status: 'COMPLETED',
        completedAt: new Date('2026-06-01T10:00:00.000Z'),
      },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });

    expect(abandon).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('does not call abandon when session is already ABANDONED or COMPLETED', async () => {
    const { useCase: abandonedUseCase, abandon: abandonedAbandon } =
      createUseCase({
        session: { ...activeSession, status: 'ABANDONED' },
      });
    await abandonedUseCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });
    expect(abandonedAbandon).not.toHaveBeenCalled();

    const { useCase: completedUseCase, abandon: completedAbandon } =
      createUseCase({
        session: { ...activeSession, status: 'COMPLETED' },
      });
    await completedUseCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });
    expect(completedAbandon).not.toHaveBeenCalled();
  });
});

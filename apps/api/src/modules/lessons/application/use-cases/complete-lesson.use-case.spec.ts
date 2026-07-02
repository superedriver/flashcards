import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { StudySession } from '../../domain/types';
import { CompleteLessonUseCase } from './complete-lesson.use-case';

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
  reviewedCards?: number;
  knownCount?: number;
  dontKnowCount?: number;
  totalCards?: number;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findSessionById = jest
    .fn()
    .mockResolvedValue(
      options?.session === undefined ? activeSession : options.session,
    );
  const countReviews = jest.fn().mockResolvedValue(options?.reviewedCards ?? 5);
  const countReviewsByAnswer = jest
    .fn()
    .mockImplementation(
      (input: { sessionId: string; answer: 'KNOW' | 'DONT_KNOW' }) => {
        if (input.answer === 'KNOW') {
          return Promise.resolve(options?.knownCount ?? 3);
        }

        return Promise.resolve(options?.dontKnowCount ?? 2);
      },
    );
  const complete = jest
    .fn()
    .mockImplementation((_sessionId: string, completedAt: Date) =>
      Promise.resolve({
        ...activeSession,
        status: 'COMPLETED' as const,
        completedAt,
      }),
    );
  const countByDeckId = jest.fn().mockResolvedValue(options?.totalCards ?? 10);

  const useCase = new CompleteLessonUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findById: jest.fn(),
      findByDeckId: jest.fn(),
      countByDeckId,
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
    {
      abandonActiveForUserAndDeck: jest.fn(),
      create: jest.fn(),
      findById: findSessionById,
      createReview: jest.fn(),
      hasReviewForCard: jest.fn(),
      countReviews,
      countReviewsByAnswer,
      complete,
      abandon: jest.fn(),
    },
  );

  return { useCase, complete, countByDeckId };
}

describe('CompleteLessonUseCase', () => {
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

  it('throws LESSON_NOT_ACTIVE when session is not ACTIVE', async () => {
    const { useCase } = createUseCase({
      session: { ...activeSession, status: 'ABANDONED' },
    });

    await expect(
      useCase.execute({ currentUser: authUser, sessionId: 'session-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_ACTIVE });
  });

  it('completes own ACTIVE session and returns summary', async () => {
    const { useCase, complete } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });

    expect(complete).toHaveBeenCalledWith('session-1', expect.any(Date));
    expect(result.sessionId).toBe('session-1');
    expect(result.deckId).toBe('deck-1');
    expect(result.completedAt).toBeInstanceOf(Date);
  });

  it('returns knownCount and dontKnowCount from repository counts', async () => {
    const { useCase } = createUseCase({
      knownCount: 7,
      dontKnowCount: 4,
      reviewedCards: 11,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });

    expect(result.knownCount).toBe(7);
    expect(result.dontKnowCount).toBe(4);
    expect(result.reviewedCards).toBe(11);
  });

  it('returns totalCards from card repository countByDeckId', async () => {
    const { useCase, countByDeckId } = createUseCase({ totalCards: 42 });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
    });

    expect(countByDeckId).toHaveBeenCalledWith('deck-1');
    expect(result.totalCards).toBe(42);
  });
});

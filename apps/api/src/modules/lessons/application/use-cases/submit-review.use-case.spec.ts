import { calculateNextReview } from '@flashcards/srs';
import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card } from '../../../decks/domain/types';
import {
  CardReviewState,
  ReviewAnswer,
  StudySession,
} from '../../domain/types';
import { SubmitReviewUseCase } from './submit-review.use-case';

jest.mock('@flashcards/srs', () => ({
  calculateNextReview: jest.fn(),
}));

const mockedCalculateNextReview = calculateNextReview as jest.MockedFunction<
  typeof calculateNextReview
>;

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

const card: Card = {
  id: 'card-1',
  deckId: 'deck-1',
  front: 'hola',
  back: 'hello',
  example: null,
  notes: null,
  position: 1,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const nextReviewResult = {
  easeFactor: 2.5,
  intervalDays: 1,
  repetitions: 1,
  dueAt: new Date('2026-06-02T00:00:00.000Z'),
};

const upsertedReviewState: CardReviewState = {
  id: 'review-1',
  userId: 'owner-1',
  cardId: 'card-1',
  easeFactor: 2.5,
  intervalDays: 1,
  repetitions: 1,
  dueAt: new Date('2026-06-02T00:00:00.000Z'),
  lastReviewedAt: new Date('2026-06-01T12:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T12:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  session?: StudySession | null;
  card?: Card | null;
  alreadyReviewed?: boolean;
  previousReviewState?: CardReviewState | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findCardById = jest
    .fn()
    .mockResolvedValue(options?.card === undefined ? card : options.card);
  const findSessionById = jest
    .fn()
    .mockResolvedValue(
      options?.session === undefined ? activeSession : options.session,
    );
  const hasReviewForCard = jest
    .fn()
    .mockResolvedValue(options?.alreadyReviewed ?? false);
  const findByUserAndCard = jest
    .fn()
    .mockResolvedValue(options?.previousReviewState ?? null);
  const upsert = jest.fn().mockResolvedValue(upsertedReviewState);
  const createReview = jest.fn().mockResolvedValue({
    id: 'session-review-1',
    sessionId: 'session-1',
    userId: 'owner-1',
    deckId: 'deck-1',
    cardId: 'card-1',
    answer: 'KNOW' as ReviewAnswer,
    quality: 4,
    reviewedAt: new Date('2026-06-01T12:00:00.000Z'),
    previousEaseFactor: null,
    previousIntervalDays: null,
    previousRepetitions: null,
    nextEaseFactor: 2.5,
    nextIntervalDays: 1,
    nextRepetitions: 1,
    nextDueAt: new Date('2026-06-02T00:00:00.000Z'),
    createdAt: new Date('2026-06-01T12:00:00.000Z'),
  });
  const countReviews = jest.fn().mockResolvedValue(1);

  const useCase = new SubmitReviewUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findById: findCardById,
      findByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
    {
      findByUserAndCard,
      findDueCardIdsForDeck: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      findNextDueAtForDeck: jest.fn(),
      upsert,
    },
    {
      abandonActiveForUserAndDeck: jest.fn(),
      create: jest.fn(),
      findById: findSessionById,
      createReview,
      hasReviewForCard,
      countReviews,
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon: jest.fn(),
    },
  );

  return { useCase, upsert, createReview, countReviews };
}

describe('SubmitReviewUseCase', () => {
  beforeEach(() => {
    mockedCalculateNextReview.mockReturnValue(nextReviewResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
        answer: 'KNOW',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws LESSON_NOT_FOUND when session is missing', async () => {
    const { useCase } = createUseCase({ session: null });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'missing',
        cardId: 'card-1',
        answer: 'KNOW',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_FOUND });
  });

  it('throws LESSON_NOT_FOUND when session belongs to another user', async () => {
    const { useCase } = createUseCase({
      session: { ...activeSession, userId: 'other-user' },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
        answer: 'KNOW',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_FOUND });
  });

  it('throws LESSON_NOT_ACTIVE when session is not ACTIVE', async () => {
    const { useCase } = createUseCase({
      session: { ...activeSession, status: 'COMPLETED' },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
        answer: 'KNOW',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.LESSON_NOT_ACTIVE });
  });

  it('throws CARD_NOT_FOUND when card is missing', async () => {
    const { useCase } = createUseCase({ card: null });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'missing',
        answer: 'KNOW',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_NOT_FOUND });
  });

  it('throws CARD_NOT_FOUND when card does not belong to session deck', async () => {
    const { useCase } = createUseCase({
      card: { ...card, deckId: 'other-deck' },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
        answer: 'KNOW',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_NOT_FOUND });
  });

  it('throws LESSON_CARD_ALREADY_REVIEWED on duplicate session/card review', async () => {
    const { useCase } = createUseCase({ alreadyReviewed: true });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
        answer: 'KNOW',
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.LESSON_CARD_ALREADY_REVIEWED,
    });
  });

  it('throws INVALID_REVIEW_ANSWER for invalid answer value', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-1',
        answer: 'MAYBE' as ReviewAnswer,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.INVALID_REVIEW_ANSWER });
  });

  it('KNOW maps to quality 4 and calls calculateNextReview', async () => {
    const { useCase } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(mockedCalculateNextReview).toHaveBeenCalledWith(
      expect.objectContaining({ quality: 4 }),
    );
  });

  it('DONT_KNOW maps to quality 1 and calls calculateNextReview', async () => {
    const { useCase } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'DONT_KNOW',
    });

    expect(mockedCalculateNextReview).toHaveBeenCalledWith(
      expect.objectContaining({ quality: 1 }),
    );
  });

  it('upserts CardReviewState with calculateNextReview result', async () => {
    const { useCase, upsert } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'owner-1',
        cardId: 'card-1',
        easeFactor: 2.5,
        intervalDays: 1,
        repetitions: 1,
        dueAt: nextReviewResult.dueAt,
      }),
    );
  });

  it('creates StudySessionReview with before/after SRS fields', async () => {
    const previousReviewState: CardReviewState = {
      ...upsertedReviewState,
      easeFactor: 2.3,
      intervalDays: 3,
      repetitions: 2,
    };
    const { useCase, createReview } = createUseCase({ previousReviewState });

    await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(createReview).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionId: 'session-1',
        cardId: 'card-1',
        answer: 'KNOW',
        quality: 4,
        previousEaseFactor: 2.3,
        previousIntervalDays: 3,
        previousRepetitions: 2,
        nextEaseFactor: 2.5,
        nextIntervalDays: 1,
        nextRepetitions: 1,
        nextDueAt: nextReviewResult.dueAt,
      }),
    );
  });

  it('returns updated reviewState and reviewedCards count', async () => {
    const { useCase, countReviews } = createUseCase();
    countReviews.mockResolvedValue(3);

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(result).toEqual({
      sessionId: 'session-1',
      cardId: 'card-1',
      reviewState: upsertedReviewState,
      reviewedCards: 3,
    });
  });
});

import { calculateNextLearningState } from '@flashcards/srs';
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
  calculateNextLearningState: jest.fn(),
  learningGroupForStep: jest.fn().mockReturnValue('TO_LEARN'),
  resolvePromptDirection: jest.fn().mockReturnValue('FRONT_TO_BACK'),
}));

const mockedCalculateNextLearningState =
  calculateNextLearningState as jest.MockedFunction<
    typeof calculateNextLearningState
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
  scope: 'DECK',
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

const nextCardEntity: Card = {
  id: 'card-2',
  deckId: 'deck-1',
  front: 'adios',
  back: 'bye',
  example: null,
  notes: null,
  position: 2,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const initialReviewState: CardReviewState = {
  id: 'review-1',
  userId: 'owner-1',
  cardId: 'card-1',
  learningStep: 0,
  longReviewSuccessCount: 0,
  dueAt: new Date('2026-06-01T12:00:00.000Z'),
  lastReviewedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const nextLearningState = {
  learningStep: 1,
  longReviewSuccessCount: 0,
  dueAt: new Date('2026-06-01T12:01:30.000Z'),
};

const upsertedReviewState: CardReviewState = {
  id: 'review-1',
  userId: 'owner-1',
  cardId: 'card-1',
  learningStep: 1,
  longReviewSuccessCount: 0,
  dueAt: nextLearningState.dueAt,
  lastReviewedAt: new Date('2026-06-01T12:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T12:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  session?: StudySession | null;
  card?: Card | null;
  previousReviewState?: CardReviewState;
  dueCardIds?: string[];
  reviewedCount?: number;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findCardById = jest.fn((cardId: string) => {
    if (options?.card === null) {
      return Promise.resolve(null);
    }
    if (cardId === 'card-2') {
      return Promise.resolve(nextCardEntity);
    }
    return Promise.resolve(options?.card === undefined ? card : options.card);
  });
  const findSessionById = jest
    .fn()
    .mockResolvedValue(
      options?.session === undefined ? activeSession : options.session,
    );
  const createInitialIfMissing = jest
    .fn()
    .mockResolvedValue(options?.previousReviewState ?? initialReviewState);
  const upsert = jest.fn().mockResolvedValue(upsertedReviewState);
  const createReview = jest.fn().mockResolvedValue({
    id: 'session-review-1',
    sessionId: 'session-1',
    userId: 'owner-1',
    deckId: 'deck-1',
    cardId: 'card-1',
    answer: 'KNOW' as ReviewAnswer,
    reviewedAt: new Date('2026-06-01T12:00:00.000Z'),
    previousLearningStep: 0,
    previousLongReviewSuccessCount: 0,
    nextLearningStep: 1,
    nextLongReviewSuccessCount: 0,
    nextDueAt: nextLearningState.dueAt,
    createdAt: new Date('2026-06-01T12:00:00.000Z'),
  });
  const countReviews = jest.fn().mockResolvedValue(options?.reviewedCount ?? 1);
  const findDueCardIdsForDeck = jest
    .fn()
    .mockResolvedValue(options?.dueCardIds ?? []);
  const findByUserAndCard = jest.fn((_userId: string, cardId: string) =>
    Promise.resolve({
      ...initialReviewState,
      id: `review-${cardId}`,
      cardId,
      learningStep: 0,
    }),
  );

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
      create: jest.fn(),
      findById: jest.fn(),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      countByOwnerAndTargetLanguage: jest.fn(),
    },
    {
      findByUserAndCard,
      findDueCardIdsForDeck,
      findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      countLearningGroupsForDeck: jest.fn(),
      countLearningGroupsForOwnDecksWithTargetLanguage: jest.fn(),
      findNextDueAtForDeck: jest.fn(),
      createInitialIfMissing,
      createInitialMany: jest.fn(),
      upsert,
    },
    {
      abandonActiveForUserAndDeck: jest.fn(),
      abandonActiveForUser: jest.fn(),
      create: jest.fn(),
      findById: findSessionById,
      createReview,
      hasReviewForCard: jest.fn(),
      countReviews,
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon: jest.fn(),
    },
    {
      findByUserId: jest.fn().mockResolvedValue({
        activeTargetLanguage: 'es',
      }),
      createForUser: jest.fn(),
      update: jest.fn(),
      findWithNotificationsEnabled: jest.fn(),
    },
    {
      nextBit: jest.fn().mockReturnValue(0 as const),
    },
  );

  return {
    useCase,
    upsert,
    createReview,
    countReviews,
    findDueCardIdsForDeck,
  };
}

describe('SubmitReviewUseCase', () => {
  beforeEach(() => {
    mockedCalculateNextLearningState.mockReturnValue(nextLearningState);
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

  it('calls calculateNextLearningState with KNOW and previous state', async () => {
    const { useCase } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(mockedCalculateNextLearningState).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: 'KNOW',
        previousLearningStep: 0,
        previousLongReviewSuccessCount: 0,
      }),
    );
  });

  it('upserts CardReviewState with calculateNextLearningState result', async () => {
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
        learningStep: 1,
        longReviewSuccessCount: 0,
        dueAt: nextLearningState.dueAt,
      }),
    );
  });

  it('returns nextCard when another card is due and lessonSize not reached', async () => {
    const { useCase, findDueCardIdsForDeck } = createUseCase({
      dueCardIds: ['card-2'],
      reviewedCount: 1,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(findDueCardIdsForDeck).toHaveBeenCalled();
    expect(result.nextCard?.cardId).toBe('card-2');
    expect(result.nextCard?.promptDirection).toBe('FRONT_TO_BACK');
  });

  it('returns nextCard null when lessonSize is reached', async () => {
    const { useCase, findDueCardIdsForDeck } = createUseCase({
      dueCardIds: ['card-2'],
      reviewedCount: 20,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(findDueCardIdsForDeck).not.toHaveBeenCalled();
    expect(result.nextCard).toBeNull();
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

    expect(result).toEqual(
      expect.objectContaining({
        sessionId: 'session-1',
        cardId: 'card-1',
        reviewState: upsertedReviewState,
        reviewedCards: 3,
        nextCard: null,
      }),
    );
  });
});

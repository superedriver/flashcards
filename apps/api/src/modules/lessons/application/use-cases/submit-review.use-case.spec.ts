import { calculateNextLearningState } from '@flashcards/srs';
import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import {
  createLessonQueueState,
  recordLessonCardAnswer,
} from '../../domain/services/select-next-lesson-card';
import {
  CardReviewState,
  LessonQueueCandidate,
  ReviewAnswer,
  StudySession,
} from '../../domain/types';
import { UpdateStudySessionInput } from '../ports/study-session-repository.port';
import { SubmitReviewUseCase } from './submit-review.use-case';

jest.mock('@flashcards/srs', () => {
  const actual: typeof import('@flashcards/srs') =
    jest.requireActual('@flashcards/srs');

  return {
    ...actual,
    calculateNextLearningState: jest.fn(),
    learningGroupForStep: jest.fn().mockReturnValue('TO_LEARN'),
  };
});

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

const ownedDeck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish',
  description: null,
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  targetLanguage: 'es',
  sourceLanguage: 'en',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

function createCard(id: string, overrides: Partial<Card> = {}): Card {
  return {
    id,
    deckId: 'deck-1',
    front: `front-${id}`,
    back: `back-${id}`,
    example: null,
    notes: null,
    position: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

function createCandidate(
  card: Card,
  dueAt = new Date('2026-06-01T12:00:00.000Z'),
): LessonQueueCandidate {
  return {
    cardId: card.id,
    dueAt,
    createdAt: card.createdAt,
  };
}

const card = createCard('card-1');
const nextCardEntity = createCard('card-2', { position: 2 });
const thirdCardEntity = createCard('card-3', { position: 3 });
const fourthCardEntity = createCard('card-4', { position: 4 });
const outsideSnapshotCard = createCard('card-outside', {
  deckId: 'deck-2',
});

const initialQueueState = createLessonQueueState({ scope: 'DECK' });

const activeSession: StudySession = {
  id: 'session-1',
  userId: 'owner-1',
  deckId: 'deck-1',
  scope: 'DECK',
  status: 'ACTIVE',
  lessonSize: 0,
  snapshotCardIds: [],
  queueState: initialQueueState,
  audioOnlyDisabled: false,
  startedAt: new Date('2026-06-01T00:00:00.000Z'),
  completedAt: null,
  abandonedAt: null,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
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
  cardsById?: Record<string, Card | null>;
  previousReviewState?: CardReviewState;
  dueCandidates?: LessonQueueCandidate[];
  homeDueCandidates?: LessonQueueCandidate[];
  reviewedCount?: number;
  nextBit?: 0 | 1;
  nextCardLearningStep?: number;
}) {
  const cardsById: Record<string, Card | null> = {
    'card-1': options?.card === undefined ? card : options.card,
    'card-2': nextCardEntity,
    'card-3': thirdCardEntity,
    'card-4': fourthCardEntity,
    'card-outside': outsideSnapshotCard,
    ...options?.cardsById,
  };
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findCardById = jest.fn((cardId: string) => {
    if (options?.card === null && cardId !== 'card-2' && cardId !== 'card-3') {
      return Promise.resolve(null);
    }

    return Promise.resolve(cardsById[cardId] ?? null);
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
  const findDueCandidatesForDeck = jest
    .fn()
    .mockResolvedValue(options?.dueCandidates ?? []);
  const findDueCandidatesForOwnDecksWithTargetLanguage = jest
    .fn()
    .mockResolvedValue(options?.homeDueCandidates ?? []);
  const findByUserAndCard = jest.fn((_userId: string, cardId: string) =>
    Promise.resolve({
      ...initialReviewState,
      id: `review-${cardId}`,
      cardId,
      learningStep: options?.nextCardLearningStep ?? 0,
    }),
  );
  const updateSession: jest.MockedFunction<
    (input: UpdateStudySessionInput) => Promise<StudySession>
  > = jest.fn().mockResolvedValue(activeSession);

  const useCase = new SubmitReviewUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
      deleteById: jest.fn(),
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
      findLiveDuplicatesForOwner: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(ownedDeck),
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
      findDueCardIdsForDeck: jest.fn(),
      findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
      findDueCandidatesForDeck,
      findDueCandidatesForOwnDecksWithTargetLanguage,
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      countDueForOwnDecksWithTargetLanguage: jest.fn(),
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
      update: updateSession,
      findById: findSessionById,
      createReview,
      hasReviewForCard: jest.fn(),
      countReviews,
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon: jest.fn(),
      updateAudioOnlyDisabled: jest.fn(),
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
      nextBit: jest.fn().mockReturnValue(options?.nextBit ?? 0),
    },
  );

  return {
    useCase,
    upsert,
    createReview,
    countReviews,
    findDueCandidatesForDeck,
    findDueCandidatesForOwnDecksWithTargetLanguage,
    updateSession,
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

  it('throws CARD_NOT_FOUND for a Home card outside the snapshot', async () => {
    const homeSession: StudySession = {
      ...activeSession,
      deckId: null,
      scope: 'HOME_ACTIVE_TARGET',
      lessonSize: 20,
      snapshotCardIds: ['card-1', 'card-2'],
      queueState: createLessonQueueState({
        scope: 'HOME_ACTIVE_TARGET',
        snapshotCardIds: ['card-1', 'card-2'],
      }),
    };
    const { useCase } = createUseCase({
      session: homeSession,
      card: outsideSnapshotCard,
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        sessionId: 'session-1',
        cardId: 'card-outside',
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

  it('allows multiple reviews of the same cardId', async () => {
    const { useCase, createReview } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });
    await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'DONT_KNOW',
    });

    expect(createReview).toHaveBeenCalledTimes(2);
  });

  it('returns nextCard from the picker even after many reviews', async () => {
    const { useCase, findDueCandidatesForDeck } = createUseCase({
      dueCandidates: [createCandidate(nextCardEntity)],
      reviewedCount: 20,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(findDueCandidatesForDeck).toHaveBeenCalled();
    expect(result.nextCard?.cardId).toBe('card-2');
    expect(result.nextCard?.presentationMode).toBe('TARGET_TEXT_AUDIO');
  });

  it('returns TARGET_AUDIO_ONLY for step 6 when randomBit is 1', async () => {
    const { useCase } = createUseCase({
      dueCandidates: [createCandidate(nextCardEntity)],
      nextBit: 1,
      nextCardLearningStep: 6,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(result.nextCard?.presentationMode).toBe('TARGET_AUDIO_ONLY');
  });

  it('maps TARGET_AUDIO_ONLY to TARGET_TEXT when audioOnlyDisabled', async () => {
    const { useCase } = createUseCase({
      dueCandidates: [createCandidate(nextCardEntity)],
      nextBit: 1,
      nextCardLearningStep: 6,
      session: { ...activeSession, audioOnlyDisabled: true },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(result.nextCard?.presentationMode).toBe('TARGET_TEXT');
  });

  it('lets a newly ready deck card join the live queue', async () => {
    const { useCase } = createUseCase({
      dueCandidates: [createCandidate(thirdCardEntity)],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(result.nextCard?.cardId).toBe('card-3');
  });

  it('records the answered card and does not record the displayed nextCard', async () => {
    const { useCase, updateSession } = createUseCase({
      dueCandidates: [createCandidate(nextCardEntity)],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    const queueState = updateSession.mock.calls[0]?.[0].queueState;

    expect(result.nextCard?.cardId).toBe('card-2');
    expect(queueState?.showCounts['card-1']).toBe(1);
    expect(queueState?.showCounts['card-2']).toBeUndefined();
  });

  it('freezes N from other ready cards at answer time including late-due C and D', async () => {
    const { useCase, updateSession } = createUseCase({
      dueCandidates: [
        createCandidate(nextCardEntity),
        createCandidate(thirdCardEntity),
        createCandidate(fourthCardEntity),
      ],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    const queueState = updateSession.mock.calls[0]?.[0].queueState;

    expect(result.nextCard?.cardId).toBe('card-2');
    expect(queueState?.pendingRepeats['card-1']).toEqual({
      targetGap: 3,
      filled: 0,
    });
    expect(queueState?.showCounts['card-2']).toBeUndefined();
  });

  it('fills the frozen gap when another card is answered, not when it is displayed', async () => {
    const afterAnsweringA = recordLessonCardAnswer({
      state: createLessonQueueState({ scope: 'DECK' }),
      answeredCardId: 'card-1',
      candidates: [
        createCandidate(nextCardEntity),
        createCandidate(thirdCardEntity),
        createCandidate(fourthCardEntity),
      ],
    });
    const { useCase, updateSession } = createUseCase({
      session: { ...activeSession, queueState: afterAnsweringA },
      dueCandidates: [
        createCandidate(nextCardEntity),
        createCandidate(thirdCardEntity),
        createCandidate(fourthCardEntity),
      ],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-2',
      answer: 'KNOW',
    });

    const queueState = updateSession.mock.calls[0]?.[0].queueState;

    expect(afterAnsweringA.pendingRepeats['card-1']?.filled).toBe(0);
    expect(queueState?.pendingRepeats['card-1']?.filled).toBe(1);
    expect(result.nextCard?.cardId).toBe('card-3');
    expect(queueState?.showCounts['card-2']).toBe(1);
    expect(queueState?.showCounts['card-3']).toBeUndefined();
  });

  it('does not return a Home nextCard outside the snapshot', async () => {
    const homeQueueState = createLessonQueueState({
      scope: 'HOME_ACTIVE_TARGET',
      snapshotCardIds: ['card-1', 'card-2'],
    });
    const { useCase, findDueCandidatesForOwnDecksWithTargetLanguage } =
      createUseCase({
        session: {
          ...activeSession,
          deckId: null,
          scope: 'HOME_ACTIVE_TARGET',
          lessonSize: 20,
          snapshotCardIds: ['card-1', 'card-2'],
          queueState: homeQueueState,
        },
        homeDueCandidates: [
          createCandidate(outsideSnapshotCard),
          createCandidate(nextCardEntity),
        ],
      });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(findDueCandidatesForOwnDecksWithTargetLanguage).toHaveBeenCalled();
    expect(result.nextCard?.cardId).toBe('card-2');
  });

  it('skips a deleted next card and never returns it again', async () => {
    const deletedNext = createCard('card-2', { deletedAt: new Date() });
    const { useCase, updateSession } = createUseCase({
      dueCandidates: [
        createCandidate(deletedNext),
        createCandidate(thirdCardEntity),
      ],
      cardsById: { 'card-2': deletedNext },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

    expect(result.nextCard?.cardId).toBe('card-3');
    expect(
      updateSession.mock.calls[0]?.[0].queueState?.showCounts['card-2'],
    ).toBe(3);
  });

  it('returns a repeat when the gap shrinks to no other ready cards', async () => {
    const { useCase, updateSession } = createUseCase({
      dueCandidates: [createCandidate(card)],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'DONT_KNOW',
    });

    expect(result.nextCard?.cardId).toBe('card-1');
    expect(
      updateSession.mock.calls[0]?.[0].queueState?.showCounts['card-1'],
    ).toBe(1);
  });

  it('returns nextCard null when nothing is showable', async () => {
    const maxedQueueState = {
      ...initialQueueState,
      showCounts: { 'card-1': 3, 'card-2': 3 },
      pendingRepeats: {},
    };
    const { useCase } = createUseCase({
      session: { ...activeSession, queueState: maxedQueueState },
      dueCandidates: [createCandidate(card), createCandidate(nextCardEntity)],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      sessionId: 'session-1',
      cardId: 'card-1',
      answer: 'KNOW',
    });

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

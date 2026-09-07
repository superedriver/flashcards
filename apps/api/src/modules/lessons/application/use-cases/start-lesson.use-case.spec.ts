import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import { createLessonQueueState } from '../../domain/services/select-next-lesson-card';
import { CardReviewState, LessonQueueCandidate } from '../../domain/types';
import { EnsureCardReviewStatesService } from '../services/ensure-card-review-states.service';
import { PromptDirectionRandomBitService } from '../services/prompt-direction-random-bit.service';
import { StartLessonUseCase } from './start-lesson.use-case';

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

const deck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: null,
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  targetLanguage: null,
  sourceLanguage: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const publicDeck: Deck = {
  ...deck,
  ownerId: 'other-user',
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
};

function createCard(
  id: string,
  position: number,
  createdAt = new Date('2026-01-01T00:00:00.000Z'),
): Card {
  return {
    id,
    deckId: 'deck-1',
    front: `front-${id}`,
    back: `back-${id}`,
    example: null,
    notes: null,
    position,
    createdAt,
    updatedAt: createdAt,
    deletedAt: null,
  };
}

function createReviewState(cardId: string): CardReviewState {
  return {
    id: `review-${cardId}`,
    userId: 'owner-1',
    cardId,
    learningStep: 1,
    longReviewSuccessCount: 0,
    dueAt: new Date('2026-06-01T00:00:00.000Z'),
    lastReviewedAt: new Date('2026-05-31T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}

function createCandidate(
  card: Card,
  dueAt = new Date('2026-06-01T00:00:00.000Z'),
): LessonQueueCandidate {
  return {
    cardId: card.id,
    dueAt,
    createdAt: card.createdAt,
  };
}

function createUseCase(options?: {
  user?: SafeUser | null;
  deck?: Deck | null;
  cards?: Card[];
  dueCandidates?: LessonQueueCandidate[];
  reviewStatesByCardId?: Record<string, CardReviewState | null>;
  totalCards?: number;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const cards = options?.cards ?? [];
  const countByDeckId = jest
    .fn()
    .mockResolvedValue(options?.totalCards ?? cards.length);
  const findByDeckId = jest.fn().mockResolvedValue(cards);
  const findDueCandidatesForDeck = jest
    .fn()
    .mockResolvedValue(
      options?.dueCandidates ?? cards.map((card) => createCandidate(card)),
    );
  const findByUserAndCard = jest.fn(
    (_userId: string, cardId: string): Promise<CardReviewState | null> =>
      Promise.resolve(
        options?.reviewStatesByCardId?.[cardId] ?? createReviewState(cardId),
      ),
  );
  const abandonActiveForUser = jest.fn().mockResolvedValue(undefined);
  const createSession = jest.fn().mockResolvedValue({
    id: 'session-1',
    userId: 'owner-1',
    deckId: 'deck-1',
    scope: 'DECK' as const,
    status: 'ACTIVE' as const,
    lessonSize: 0,
    snapshotCardIds: [],
    queueState: null,
    audioOnlyDisabled: false,
    startedAt: new Date('2026-06-01T00:00:00.000Z'),
    completedAt: null,
    abandonedAt: null,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  });
  const createInitialMany = jest.fn().mockResolvedValue(undefined);
  const ensureCardReviewStatesService = new EnsureCardReviewStatesService({
    findByUserAndCard: jest.fn(),
    findDueCardIdsForDeck: jest.fn(),
    findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
    findDueCandidatesForDeck: jest.fn(),
    findDueCandidatesForOwnDecksWithTargetLanguage: jest.fn(),
    countReviewedForDeck: jest.fn(),
    countDueForDeck: jest.fn(),
    countDueForUser: jest.fn(),
    countDueForOwnDecksWithTargetLanguage: jest.fn(),
    countLearningGroupsForDeck: jest.fn(),
    countLearningGroupsForOwnDecksWithTargetLanguage: jest.fn(),
    findNextDueAtForDeck: jest.fn(),
    createInitialIfMissing: jest.fn(),
    createInitialMany,
    upsert: jest.fn(),
  });
  const promptDirectionRandomBitService = {
    nextBit: jest.fn().mockReturnValue(0 as const),
  } as PromptDirectionRandomBitService;

  const useCase = new StartLessonUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
      deleteById: jest.fn(),
    },
    {
      findById: findDeckById,
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      countByOwnerAndTargetLanguage: jest.fn(),
      create: jest.fn(),
    },
    {
      findById: jest.fn(),
      findByDeckId,
      countByDeckId,
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      createMany: jest.fn(),
      findLiveDuplicatesForOwner: jest.fn(),
    },
    {
      findByUserAndCard,
      findDueCardIdsForDeck: jest.fn(),
      findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
      findDueCandidatesForDeck,
      findDueCandidatesForOwnDecksWithTargetLanguage: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      countDueForOwnDecksWithTargetLanguage: jest.fn(),
      countLearningGroupsForDeck: jest.fn(),
      countLearningGroupsForOwnDecksWithTargetLanguage: jest.fn(),
      findNextDueAtForDeck: jest.fn(),
      createInitialIfMissing: jest.fn(),
      createInitialMany,
      upsert: jest.fn(),
    },
    {
      abandonActiveForUserAndDeck: jest.fn(),
      abandonActiveForUser,
      create: createSession,
      update: jest.fn(),
      findById: jest.fn(),
      createReview: jest.fn(),
      hasReviewForCard: jest.fn(),
      countReviews: jest.fn(),
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon: jest.fn(),
      updateAudioOnlyDisabled: jest.fn(),
    },
    ensureCardReviewStatesService,
    promptDirectionRandomBitService,
  );

  return {
    useCase,
    abandonActiveForUser,
    createSession,
    findDueCandidatesForDeck,
    createInitialMany,
    promptDirectionRandomBitService,
  };
}

describe('StartLessonUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({ currentUser: authUser, deckId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_NOT_FOUND for a non-owner', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({ currentUser: authUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_NOT_FOUND for a public-deck viewer', async () => {
    const { useCase, createSession } = createUseCase({
      deck: publicDeck,
      cards: [createCard('card-1', 1)],
    });

    await expect(
      useCase.execute({ currentUser: authUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('throws DECK_NOT_FOUND for a group-shared deck viewer', async () => {
    const { useCase, createSession } = createUseCase({
      deck: { ...deck, ownerId: 'other-user', visibility: 'PRIVATE' },
      cards: [createCard('card-1', 1)],
    });

    await expect(
      useCase.execute({ currentUser: authUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
    expect(createSession).not.toHaveBeenCalled();
  });

  it('ignores requested lessonSize and persists 0', async () => {
    const { useCase, createSession } = createUseCase({
      cards: [createCard('card-1', 1)],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      lessonSize: 50,
    });

    expect(result.lessonSize).toBe(0);
    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonSize: 0,
        snapshotCardIds: [],
      }),
    );
  });

  it('selects the first due card after ensuring review state', async () => {
    const cards = [createCard('card-1', 1), createCard('card-2', 2)];
    const { useCase, createInitialMany } = createUseCase({
      cards,
      dueCandidates: [createCandidate(cards[1]!)],
      reviewStatesByCardId: {
        'card-2': createReviewState('card-2'),
      },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(createInitialMany).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'owner-1',
        cardIds: ['card-1', 'card-2'],
      }),
    );
    expect(result.cards.map((card) => card.cardId)).toEqual(['card-2']);
  });

  it('returns the first card by dueAt, createdAt, then cardId', async () => {
    const laterDue = createCard(
      'card-later',
      1,
      new Date('2026-01-01T00:00:00.000Z'),
    );
    const earlierDue = createCard(
      'card-earlier',
      2,
      new Date('2026-02-01T00:00:00.000Z'),
    );
    const { useCase } = createUseCase({
      cards: [laterDue, earlierDue],
      dueCandidates: [
        createCandidate(laterDue, new Date('2026-06-02T00:00:00.000Z')),
        createCandidate(earlierDue, new Date('2026-06-01T00:00:00.000Z')),
      ],
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result.cards.map((card) => card.cardId)).toEqual(['card-earlier']);
  });

  it('returns empty payload with sessionId null when no due cards', async () => {
    const { useCase } = createUseCase({
      cards: [createCard('card-1', 1)],
      dueCandidates: [],
      totalCards: 1,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result).toEqual({
      sessionId: null,
      deckId: 'deck-1',
      scope: 'DECK',
      cards: [],
      lessonSize: 0,
      totalCards: 1,
    });
  });

  it('does not create session when no due cards', async () => {
    const { useCase, createSession, abandonActiveForUser } = createUseCase({
      cards: [],
    });

    await useCase.execute({ currentUser: authUser, deckId: 'deck-1' });

    expect(abandonActiveForUser).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('abandons any ACTIVE session for user before creating new session', async () => {
    const { useCase, abandonActiveForUser, createSession } = createUseCase({
      cards: [createCard('card-1', 1)],
    });

    await useCase.execute({ currentUser: authUser, deckId: 'deck-1' });

    expect(abandonActiveForUser).toHaveBeenCalledWith({
      userId: 'owner-1',
    });
    expect(createSession).toHaveBeenCalled();
  });

  it('creates a live deck session with empty snapshot and unanswered first-card queueState', async () => {
    const cards = [createCard('card-1', 1), createCard('card-2', 2)];
    const expectedQueueState = createLessonQueueState({ scope: 'DECK' });
    const { useCase, createSession } = createUseCase({ cards });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      lessonSize: 5,
    });

    expect(createSession).toHaveBeenCalledWith({
      userId: 'owner-1',
      deckId: 'deck-1',
      scope: 'DECK',
      lessonSize: 0,
      snapshotCardIds: [],
      queueState: expectedQueueState,
    });
    expect(result.sessionId).toBe('session-1');
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0]?.cardId).toBe('card-1');
    expect(expectedQueueState.showCounts).toEqual({});
  });

  it('includes reviewState on the first due card', async () => {
    const dueState = createReviewState('card-due');
    const dueCard = createCard('card-due', 2);
    const { useCase } = createUseCase({
      cards: [createCard('card-new', 1), dueCard],
      dueCandidates: [createCandidate(dueCard)],
      reviewStatesByCardId: {
        'card-due': dueState,
      },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result.cards).toHaveLength(1);
    expect(result.cards[0]?.cardId).toBe('card-due');
    expect(result.cards[0]?.reviewState).toEqual(dueState);
    expect(result.cards[0]?.learningStep).toBe(1);
    expect(result.cards[0]?.learningGroup).toBe('TO_LEARN');
    expect(result.cards[0]?.presentationMode).toBe('TARGET_TEXT_AUDIO');
  });

  it('uses TARGET_TEXT_AUDIO for step 0', async () => {
    const dueState = { ...createReviewState('card-due'), learningStep: 0 };
    const dueCard = createCard('card-due', 1);
    const { useCase } = createUseCase({
      cards: [dueCard],
      dueCandidates: [createCandidate(dueCard)],
      reviewStatesByCardId: {
        'card-due': dueState,
      },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result.cards[0]?.presentationMode).toBe('TARGET_TEXT_AUDIO');
  });
});

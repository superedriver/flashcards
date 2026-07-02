import { ErrorCodes } from '../../../../common/errors';
import { UserSettings } from '../../../account/domain/types';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import { CardReviewState } from '../../domain/types';
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
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const settings: UserSettings = {
  id: 'settings-1',
  userId: 'owner-1',
  interfaceLocale: 'en',
  themePreference: 'SYSTEM',
  notificationsEnabled: false,
  reminderTime: '18:00',
  timezone: 'UTC',
  audioAutoplayEnabled: false,
  lessonSize: 20,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createCard(id: string, position: number): Card {
  return {
    id,
    deckId: 'deck-1',
    front: `front-${id}`,
    back: `back-${id}`,
    example: null,
    notes: null,
    position,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  };
}

function createReviewState(cardId: string): CardReviewState {
  return {
    id: `review-${cardId}`,
    userId: 'owner-1',
    cardId,
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 1,
    dueAt: new Date('2026-06-01T00:00:00.000Z'),
    lastReviewedAt: new Date('2026-05-31T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}

function createDeckGroupShareRepository(userHasAccess = false) {
  return {
    create: jest.fn(),
    findByDeckAndGroup: jest.fn(),
    findActiveGroupsForDeck: jest.fn(),
    findSharedDecksForGroup: jest.fn(),
    userHasAccessToDeck: jest.fn().mockResolvedValue(userHasAccess),
  };
}

function createUseCase(options?: {
  user?: SafeUser | null;
  deck?: Deck | null;
  settings?: UserSettings | null;
  cards?: Card[];
  dueCardIds?: string[];
  reviewStatesByCardId?: Record<string, CardReviewState | null>;
  totalCards?: number;
  userHasGroupAccess?: boolean;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const countByDeckId = jest
    .fn()
    .mockResolvedValue(options?.totalCards ?? options?.cards?.length ?? 0);
  const findByDeckId = jest.fn().mockResolvedValue(options?.cards ?? []);
  const findDueCardIdsForDeck = jest
    .fn()
    .mockResolvedValue(options?.dueCardIds ?? []);
  const findByUserAndCard = jest.fn(
    (_userId: string, cardId: string): Promise<CardReviewState | null> =>
      Promise.resolve(options?.reviewStatesByCardId?.[cardId] ?? null),
  );
  const findSettingsByUserId = jest
    .fn()
    .mockResolvedValue(
      options?.settings === undefined ? settings : options.settings,
    );
  const createForUser = jest.fn().mockResolvedValue(settings);
  const abandonActiveForUserAndDeck = jest.fn().mockResolvedValue(undefined);
  const createSession = jest.fn().mockResolvedValue({
    id: 'session-1',
    userId: 'owner-1',
    deckId: 'deck-1',
    status: 'ACTIVE' as const,
    lessonSize: 20,
    startedAt: new Date('2026-06-01T00:00:00.000Z'),
    completedAt: null,
    abandonedAt: null,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  });

  const useCase = new StartLessonUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
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
    },
    {
      findByUserAndCard,
      findDueCardIdsForDeck,
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      findNextDueAtForDeck: jest.fn(),
      upsert: jest.fn(),
    },
    {
      abandonActiveForUserAndDeck,
      create: createSession,
      findById: jest.fn(),
      createReview: jest.fn(),
      hasReviewForCard: jest.fn(),
      countReviews: jest.fn(),
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon: jest.fn(),
    },
    {
      findByUserId: findSettingsByUserId,
      createForUser,
      update: jest.fn(),
      findWithNotificationsEnabled: jest.fn(),
    },
    createDeckGroupShareRepository(options?.userHasGroupAccess ?? false),
  );

  return {
    useCase,
    abandonActiveForUserAndDeck,
    createSession,
    createForUser,
    findDueCardIdsForDeck,
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

  it('throws DECK_NOT_FOUND for non-viewable deck', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({ currentUser: authUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('allows lesson on deck shared via group', async () => {
    const { useCase, createSession } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
      cards: [createCard('card-1', 1)],
      userHasGroupAccess: true,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(createSession).toHaveBeenCalled();
    expect(result.sessionId).toBe('session-1');
  });

  it('resolves lessonSize from user settings when omitted', async () => {
    const { useCase, createSession } = createUseCase({
      cards: [createCard('card-1', 1)],
      settings: { ...settings, lessonSize: 15 },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result.lessonSize).toBe(15);
    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({ lessonSize: 15 }),
    );
  });

  it('clamps lessonSize to min 5 and max 100', async () => {
    const { useCase: lowUseCase } = createUseCase({
      cards: [createCard('card-1', 1)],
    });
    const lowResult = await lowUseCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      lessonSize: 3,
    });
    expect(lowResult.lessonSize).toBe(5);

    const { useCase: highUseCase } = createUseCase({
      cards: [createCard('card-1', 1)],
    });
    const highResult = await highUseCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      lessonSize: 200,
    });
    expect(highResult.lessonSize).toBe(100);
  });

  it('selects due cards before new cards', async () => {
    const cards = [createCard('card-1', 1), createCard('card-2', 2)];
    const { useCase } = createUseCase({
      cards,
      dueCardIds: ['card-2'],
      reviewStatesByCardId: {
        'card-2': createReviewState('card-2'),
      },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      lessonSize: 5,
    });

    expect(result.cards.map((card) => card.cardId)).toEqual([
      'card-2',
      'card-1',
    ]);
  });

  it('returns empty payload with sessionId null when no cards available', async () => {
    const { useCase } = createUseCase({
      cards: [],
      totalCards: 0,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result).toEqual({
      sessionId: null,
      deckId: 'deck-1',
      cards: [],
      lessonSize: 20,
      totalCards: 0,
    });
  });

  it('does not create session when no cards available', async () => {
    const { useCase, createSession, abandonActiveForUserAndDeck } =
      createUseCase({ cards: [] });

    await useCase.execute({ currentUser: authUser, deckId: 'deck-1' });

    expect(abandonActiveForUserAndDeck).not.toHaveBeenCalled();
    expect(createSession).not.toHaveBeenCalled();
  });

  it('abandons existing ACTIVE session for user/deck before creating new session', async () => {
    const { useCase, abandonActiveForUserAndDeck, createSession } =
      createUseCase({
        cards: [createCard('card-1', 1)],
      });

    await useCase.execute({ currentUser: authUser, deckId: 'deck-1' });

    expect(abandonActiveForUserAndDeck).toHaveBeenCalledWith({
      userId: 'owner-1',
      deckId: 'deck-1',
    });
    expect(createSession).toHaveBeenCalled();
  });

  it('creates session and returns selected cards when cards exist', async () => {
    const cards = [createCard('card-1', 1), createCard('card-2', 2)];
    const { useCase, createSession } = createUseCase({ cards });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      lessonSize: 5,
    });

    expect(createSession).toHaveBeenCalledWith({
      userId: 'owner-1',
      deckId: 'deck-1',
      lessonSize: 5,
    });
    expect(result.sessionId).toBe('session-1');
    expect(result.cards).toHaveLength(2);
  });

  it('includes reviewState on due cards and null reviewState on new cards', async () => {
    const dueState = createReviewState('card-due');
    const { useCase } = createUseCase({
      cards: [createCard('card-new', 1), createCard('card-due', 2)],
      dueCardIds: ['card-due'],
      reviewStatesByCardId: {
        'card-due': dueState,
      },
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      lessonSize: 2,
    });

    const dueCard = result.cards.find((card) => card.cardId === 'card-due');
    const newCard = result.cards.find((card) => card.cardId === 'card-new');

    expect(dueCard?.reviewState).toEqual(dueState);
    expect(newCard?.reviewState).toBeNull();
  });

  it('creates user settings when missing', async () => {
    const { useCase, createForUser } = createUseCase({
      cards: [createCard('card-1', 1)],
      settings: null,
    });

    await useCase.execute({ currentUser: authUser, deckId: 'deck-1' });

    expect(createForUser).toHaveBeenCalledWith('owner-1');
  });
});

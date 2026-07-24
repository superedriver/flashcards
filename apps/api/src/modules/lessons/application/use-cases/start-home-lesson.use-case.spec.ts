import { ErrorCodes } from '../../../../common/errors';
import { UserSettings } from '../../../account/domain/types';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import { CardReviewState } from '../../domain/types';
import { EnsureCardReviewStatesService } from '../services/ensure-card-review-states.service';
import { StartHomeLessonUseCase } from './start-home-lesson.use-case';

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
  nativeLanguage: 'en',
  activeTargetLanguage: 'es',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createDeck(overrides: Partial<Deck> = {}): Deck {
  return {
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
    ...overrides,
  };
}

function createCard(id: string, deckId: string): Card {
  return {
    id,
    deckId,
    front: `front-${id}`,
    back: `back-${id}`,
    example: null,
    notes: null,
    position: 1,
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
    learningStep: 0,
    longReviewSuccessCount: 0,
    dueAt: new Date('2026-06-01T00:00:00.000Z'),
    lastReviewedAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
}

function createUseCase(options?: {
  user?: SafeUser | null;
  settings?: UserSettings | null;
  decks?: Deck[];
  cardsByDeckId?: Record<string, Card[]>;
  dueCardIds?: string[];
}) {
  const decks = options?.decks ?? [createDeck()];
  const cardsByDeckId = options?.cardsByDeckId ?? {
    'deck-1': [createCard('card-1', 'deck-1')],
  };
  const allCards = Object.values(cardsByDeckId).flat();
  const createInitialMany = jest.fn().mockResolvedValue(undefined);
  const abandonActiveForUser = jest.fn().mockResolvedValue(undefined);
  const createSession = jest.fn().mockResolvedValue({
    id: 'session-home-1',
    userId: 'owner-1',
    deckId: null,
    scope: 'HOME_ACTIVE_TARGET' as const,
    status: 'ACTIVE' as const,
    lessonSize: 20,
    startedAt: new Date('2026-06-01T00:00:00.000Z'),
    completedAt: null,
    abandonedAt: null,
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  });

  const useCase = new StartHomeLessonUseCase(
    {
      findById: jest
        .fn()
        .mockResolvedValue(
          options?.user === undefined ? safeUser : options.user,
        ),
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByOwner: jest.fn().mockResolvedValue(decks),
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
      create: jest.fn(),
      findById: jest.fn((cardId: string) =>
        Promise.resolve(allCards.find((card) => card.id === cardId) ?? null),
      ),
      findByDeckId: jest.fn((deckId: string) =>
        Promise.resolve(cardsByDeckId[deckId] ?? []),
      ),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
    {
      findByUserAndCard: jest.fn((_userId: string, cardId: string) =>
        Promise.resolve(createReviewState(cardId)),
      ),
      findDueCardIdsForDeck: jest.fn(),
      findDueCardIdsForOwnDecksWithTargetLanguage: jest
        .fn()
        .mockResolvedValue(
          options?.dueCardIds ?? allCards.map((card) => card.id),
        ),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
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
      findById: jest.fn(),
      createReview: jest.fn(),
      hasReviewForCard: jest.fn(),
      countReviews: jest.fn(),
      countReviewsByAnswer: jest.fn(),
      complete: jest.fn(),
      abandon: jest.fn(),
    },
    {
      findByUserId: jest
        .fn()
        .mockResolvedValue(
          options?.settings === undefined ? settings : options.settings,
        ),
      createForUser: jest.fn().mockResolvedValue(settings),
      update: jest.fn(),
      findWithNotificationsEnabled: jest.fn(),
    },
    new EnsureCardReviewStatesService({
      findByUserAndCard: jest.fn(),
      findDueCardIdsForDeck: jest.fn(),
      findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      countLearningGroupsForDeck: jest.fn(),
      countLearningGroupsForOwnDecksWithTargetLanguage: jest.fn(),
      findNextDueAtForDeck: jest.fn(),
      createInitialIfMissing: jest.fn(),
      createInitialMany,
      upsert: jest.fn(),
    }),
    {
      nextBit: jest.fn().mockReturnValue(0 as const),
    },
  );

  return { useCase, createSession, abandonActiveForUser, createInitialMany };
}

describe('StartHomeLessonUseCase', () => {
  it('throws LANGUAGES_REQUIRED when activeTargetLanguage is missing', async () => {
    const { useCase } = createUseCase({
      settings: { ...settings, activeTargetLanguage: null },
    });

    await expect(
      useCase.execute({ currentUser: authUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.LANGUAGES_REQUIRED });
  });

  it('creates HOME_ACTIVE_TARGET session with null deckId', async () => {
    const { useCase, createSession, abandonActiveForUser } = createUseCase();

    const result = await useCase.execute({ currentUser: authUser });

    expect(abandonActiveForUser).toHaveBeenCalledWith({ userId: 'owner-1' });
    expect(createSession).toHaveBeenCalledWith({
      userId: 'owner-1',
      deckId: null,
      scope: 'HOME_ACTIVE_TARGET',
      lessonSize: 20,
    });
    expect(result.scope).toBe('HOME_ACTIVE_TARGET');
    expect(result.deckId).toBeNull();
    expect(result.sessionId).toBe('session-home-1');
    expect(result.cards[0]?.deckId).toBe('deck-1');
  });

  it('returns empty payload when no due cards', async () => {
    const { useCase, createSession } = createUseCase({ dueCardIds: [] });

    const result = await useCase.execute({ currentUser: authUser });

    expect(createSession).not.toHaveBeenCalled();
    expect(result).toEqual({
      sessionId: null,
      deckId: null,
      scope: 'HOME_ACTIVE_TARGET',
      cards: [],
      lessonSize: 20,
      totalCards: 1,
    });
  });
});

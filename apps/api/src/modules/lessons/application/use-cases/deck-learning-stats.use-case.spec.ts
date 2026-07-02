import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../../decks/domain/types';
import { DeckLearningStatsUseCase } from './deck-learning-stats.use-case';

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

const otherUser: AuthUser = {
  id: 'other-1',
  email: 'other@example.com',
  role: 'USER',
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
  totalCards?: number;
  reviewedCards?: number;
  dueCards?: number;
  nextDueAt?: Date | null;
  userHasGroupAccess?: boolean;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const countByDeckId = jest.fn().mockResolvedValue(options?.totalCards ?? 20);
  const countReviewedForDeck = jest
    .fn()
    .mockResolvedValue(options?.reviewedCards ?? 8);
  const countDueForDeck = jest
    .fn<Promise<number>, [{ userId: string; deckId: string; now: Date }]>()
    .mockResolvedValue(options?.dueCards ?? 3);
  const findNextDueAtForDeck = jest
    .fn<Promise<Date | null>, [{ userId: string; deckId: string; now: Date }]>()
    .mockResolvedValue(
      options?.nextDueAt === undefined
        ? new Date('2026-06-02T00:00:00.000Z')
        : options.nextDueAt,
    );

  const useCase = new DeckLearningStatsUseCase(
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
      findByDeckId: jest.fn(),
      countByDeckId,
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
    {
      findByUserAndCard: jest.fn(),
      findDueCardIdsForDeck: jest.fn(),
      countReviewedForDeck,
      countDueForDeck,
      findNextDueAtForDeck,
      upsert: jest.fn(),
    },
    createDeckGroupShareRepository(options?.userHasGroupAccess ?? false),
  );

  return {
    useCase,
    countReviewedForDeck,
    countDueForDeck,
    findNextDueAtForDeck,
  };
}

describe('DeckLearningStatsUseCase', () => {
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

  it('throws DECK_NOT_FOUND when deck is not viewable (canViewDeck)', async () => {
    const { useCase } = createUseCase({
      deck: {
        ...deck,
        ownerId: 'other-user',
        visibility: 'PRIVATE',
      },
    });

    await expect(
      useCase.execute({ currentUser: authUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('returns per-user stats for viewable deck', async () => {
    const nextDueAt = new Date('2026-06-02T00:00:00.000Z');
    const { useCase } = createUseCase({
      totalCards: 20,
      reviewedCards: 8,
      dueCards: 3,
      nextDueAt,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result).toEqual({
      deckId: 'deck-1',
      totalCards: 20,
      newCards: 12,
      dueCards: 3,
      reviewedCards: 8,
      nextDueAt,
    });
  });

  it('calculates newCards as totalCards - reviewedCards', async () => {
    const { useCase } = createUseCase({
      totalCards: 15,
      reviewedCards: 6,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
    });

    expect(result.newCards).toBe(9);
  });

  it('passes userId and deckId to review-state repository count methods', async () => {
    const {
      useCase,
      countReviewedForDeck,
      countDueForDeck,
      findNextDueAtForDeck,
    } = createUseCase();

    await useCase.execute({ currentUser: authUser, deckId: 'deck-1' });

    expect(countReviewedForDeck).toHaveBeenCalledWith({
      userId: 'owner-1',
      deckId: 'deck-1',
    });

    const dueInput = countDueForDeck.mock.calls[0]![0];
    expect(dueInput.userId).toBe('owner-1');
    expect(dueInput.deckId).toBe('deck-1');
    expect(dueInput.now).toBeInstanceOf(Date);

    const nextDueInput = findNextDueAtForDeck.mock.calls[0]![0];
    expect(nextDueInput.userId).toBe('owner-1');
    expect(nextDueInput.deckId).toBe('deck-1');
    expect(nextDueInput.now).toBeInstanceOf(Date);
  });

  it('group member can read learning stats for deck shared via group', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
      userHasGroupAccess: true,
    });

    const result = await useCase.execute({
      currentUser: otherUser,
      deckId: 'deck-1',
    });

    expect(result.deckId).toBe('deck-1');
    expect(result.totalCards).toBe(20);
  });
});

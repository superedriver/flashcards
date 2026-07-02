import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../domain/types';
import { DeckCardsUseCase } from './deck-cards.use-case';

const owner: AuthUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
};

const otherUser: AuthUser = {
  id: 'other-1',
  email: 'other@example.com',
  role: 'USER',
};

function createDeck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: 'deck-1',
    ownerId: 'owner-1',
    title: 'Test Deck',
    description: null,
    visibility: 'PRIVATE',
    moderationStatus: 'NONE',
    isOfficial: false,
    sourceDeckId: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

const cards: Card[] = [
  {
    id: 'card-1',
    deckId: 'deck-1',
    front: 'hola',
    back: 'hello',
    example: null,
    notes: null,
    position: 0,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  },
];

function createDeckGroupShareRepository(userHasAccess = false) {
  return {
    create: jest.fn(),
    findByDeckAndGroup: jest.fn(),
    findActiveGroupsForDeck: jest.fn(),
    findSharedDecksForGroup: jest.fn(),
    userHasAccessToDeck: jest.fn().mockResolvedValue(userHasAccess),
  };
}

function createUseCase(
  deck: Deck | null,
  options?: { userHasGroupAccess?: boolean },
) {
  const findByDeckId = jest.fn().mockResolvedValue(cards);

  const useCase = new DeckCardsUseCase(
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(deck),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByDeckId,
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
    createDeckGroupShareRepository(options?.userHasGroupAccess ?? false),
  );

  return { useCase, findByDeckId };
}

describe('DeckCardsUseCase', () => {
  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase(null);

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('owner can list own deck cards', async () => {
    const { useCase, findByDeckId } = createUseCase(createDeck());

    const result = await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
    });

    expect(findByDeckId).toHaveBeenCalledWith('deck-1');
    expect(result).toEqual(cards);
  });

  it('anonymous user cannot list private deck cards (DECK_NOT_FOUND)', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({ currentUser: null, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('non-owner cannot list private deck cards (DECK_NOT_FOUND)', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({ currentUser: otherUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('returns cards from findByDeckId when allowed', async () => {
    const { useCase } = createUseCase(
      createDeck({ visibility: 'PUBLIC', moderationStatus: 'APPROVED' }),
    );

    await expect(
      useCase.execute({ currentUser: null, deckId: 'deck-1' }),
    ).resolves.toEqual(cards);
  });
});

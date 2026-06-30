import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { GetDeckUseCase } from './get-deck.use-case';

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

function createUseCase(deck: Deck | null) {
  const findById = jest.fn().mockResolvedValue(deck);
  const useCase = new GetDeckUseCase({
    create: jest.fn(),
    findById,
    findByOwner: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    publish: jest.fn(),
    unpublish: jest.fn(),
    findPublicApprovedById: jest.fn(),
    searchPublicApproved: jest.fn(),
    createCopiedDeck: jest.fn(),
  });

  return { useCase, findById };
}

describe('GetDeckUseCase', () => {
  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase(null);

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('owner can view own private deck', async () => {
    const deck = createDeck();
    const { useCase } = createUseCase(deck);

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'deck-1' }),
    ).resolves.toEqual(deck);
  });

  it('anonymous user cannot view private deck (DECK_NOT_FOUND)', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({ currentUser: null, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('non-owner cannot view private deck (DECK_NOT_FOUND)', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({ currentUser: otherUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('anonymous user can view public approved deck', async () => {
    const deck = createDeck({
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
    });
    const { useCase } = createUseCase(deck);

    await expect(
      useCase.execute({ currentUser: null, deckId: 'deck-1' }),
    ).resolves.toEqual(deck);
  });

  it('throws DECK_NOT_FOUND for deleted deck', async () => {
    const { useCase } = createUseCase(
      createDeck({ deletedAt: new Date('2026-06-01T00:00:00.000Z') }),
    );

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });
});

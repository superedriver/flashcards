import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { DeleteDeckUseCase } from './delete-deck.use-case';

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
  const softDeleteByDeckId = jest.fn().mockResolvedValue(undefined);
  const softDelete = jest.fn().mockResolvedValue(undefined);

  const useCase = new DeleteDeckUseCase(
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(deck),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete,
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByDeckId: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId,
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
  );

  return { useCase, softDeleteByDeckId, softDelete };
}

describe('DeleteDeckUseCase', () => {
  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase(null);

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for non-owner', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({ currentUser: otherUser, deckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('owner soft-deletes cards then deck', async () => {
    const { useCase, softDeleteByDeckId, softDelete } =
      createUseCase(createDeck());

    await useCase.execute({ currentUser: owner, deckId: 'deck-1' });

    expect(softDeleteByDeckId).toHaveBeenCalledWith('deck-1');
    expect(softDelete).toHaveBeenCalledWith('deck-1');
  });

  it('returns success true', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'deck-1' }),
    ).resolves.toEqual({ success: true });
  });
});

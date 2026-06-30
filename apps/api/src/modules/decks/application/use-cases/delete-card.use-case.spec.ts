import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../domain/types';
import { DeleteCardUseCase } from './delete-card.use-case';

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

function createCard(overrides: Partial<Card> = {}): Card {
  return {
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
    ...overrides,
  };
}

function createUseCase(options?: { card?: Card | null; deck?: Deck | null }) {
  const card = options?.card === undefined ? createCard() : options.card;
  const deck = options?.deck === undefined ? createDeck() : options.deck;
  const softDelete = jest.fn().mockResolvedValue(undefined);

  const useCase = new DeleteCardUseCase(
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(card),
      findByDeckId: jest.fn(),
      update: jest.fn(),
      softDelete,
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
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
  );

  return { useCase, softDelete };
}

describe('DeleteCardUseCase', () => {
  it('throws CARD_NOT_FOUND when card is missing', async () => {
    const { useCase } = createUseCase({ card: null });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_NOT_FOUND });
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws CARD_FORBIDDEN for non-owner', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUser: otherUser, cardId: 'card-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_FORBIDDEN });
  });

  it('owner soft-deletes card', async () => {
    const { useCase, softDelete } = createUseCase();

    await useCase.execute({ currentUser: owner, cardId: 'card-1' });

    expect(softDelete).toHaveBeenCalledWith('card-1');
  });

  it('returns success true', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1' }),
    ).resolves.toEqual({ success: true });
  });
});

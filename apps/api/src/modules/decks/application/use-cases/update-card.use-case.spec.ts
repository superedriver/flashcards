import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../domain/types';
import { UpdateCardInput } from '../ports/card-repository.port';
import { UpdateCardUseCase } from './update-card.use-case';

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

  const update = jest
    .fn<Promise<Card>, [UpdateCardInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...createCard(),
        front: input.front ?? createCard().front,
        back: input.back ?? createCard().back,
        example:
          input.example !== undefined ? input.example : createCard().example,
        notes: input.notes !== undefined ? input.notes : createCard().notes,
        position: input.position ?? createCard().position,
      }),
    );

  const useCase = new UpdateCardUseCase(
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(card),
      findByDeckId: jest.fn(),
      update,
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn().mockResolvedValue(deck),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    },
  );

  return { useCase, update };
}

describe('UpdateCardUseCase', () => {
  it('throws CARD_NOT_FOUND when card is missing', async () => {
    const { useCase } = createUseCase({ card: null });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'missing', front: 'x' }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_NOT_FOUND });
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({ currentUser: owner, cardId: 'card-1', front: 'x' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws CARD_FORBIDDEN for non-owner', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: otherUser,
        cardId: 'card-1',
        front: 'hack',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_FORBIDDEN });
  });

  it('owner can update front/back/example/notes/position', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({
      currentUser: owner,
      cardId: 'card-1',
      front: '  hola!  ',
      back: '  hi  ',
      example: '  Example  ',
      notes: '  Note  ',
      position: 3,
    });

    expect(update).toHaveBeenCalledWith({
      cardId: 'card-1',
      front: 'hola!',
      back: 'hi',
      example: 'Example',
      notes: 'Note',
      position: 3,
    });
  });

  it('validates provided fields', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'card-1',
        front: '   ',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'card-1',
        position: -1,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('updates only provided fields', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({
      currentUser: owner,
      cardId: 'card-1',
      notes: 'only notes',
    });

    expect(update).toHaveBeenCalledWith({
      cardId: 'card-1',
      notes: 'only notes',
    });
  });

  it('does not allow deckId change', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({
      currentUser: owner,
      cardId: 'card-1',
      front: 'updated',
    });

    const call = update.mock.calls[0]?.[0];
    expect(call).toBeDefined();
    expect(call).not.toHaveProperty('deckId');
  });
});

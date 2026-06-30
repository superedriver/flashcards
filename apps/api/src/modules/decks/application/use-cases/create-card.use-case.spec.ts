import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../domain/types';
import { CreateCardInput } from '../ports/card-repository.port';
import { CreateCardUseCase } from './create-card.use-case';

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

const card: Card = {
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
};

function createUseCase(deck: Deck | null) {
  const countByDeckId = jest.fn().mockResolvedValue(2);
  const create = jest
    .fn<Promise<Card>, [CreateCardInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...card,
        ...input,
        example: input.example ?? null,
        notes: input.notes ?? null,
      }),
    );

  const useCase = new CreateCardUseCase(
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
      create,
      findById: jest.fn(),
      findByDeckId: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId,
      createMany: jest.fn(),
    },
  );

  return { useCase, create, countByDeckId };
}

describe('CreateCardUseCase', () => {
  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase(null);

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'missing',
        front: 'hola',
        back: 'hello',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for non-owner', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: otherUser,
        deckId: 'deck-1',
        front: 'hola',
        back: 'hello',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('validates front required/trim/max length', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        front: '   ',
        back: 'hello',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        front: 'a'.repeat(2001),
        back: 'hello',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('validates back required/trim/max length', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        front: 'hola',
        back: '   ',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        front: 'hola',
        back: 'a'.repeat(4001),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('validates example and notes max length', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        front: 'hola',
        back: 'hello',
        example: 'a'.repeat(4001),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        front: 'hola',
        back: 'hello',
        notes: 'a'.repeat(4001),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects invalid position with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        front: 'hola',
        back: 'hello',
        position: -1,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('appends to end when position is omitted (uses countByDeckId)', async () => {
    const { useCase, create, countByDeckId } = createUseCase(createDeck());

    await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      front: 'hola',
      back: 'hello',
    });

    expect(countByDeckId).toHaveBeenCalledWith('deck-1');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ position: 2 }),
    );
  });

  it('creates card with validated fields', async () => {
    const { useCase, create } = createUseCase(createDeck());

    await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      front: '  hola  ',
      back: '  hello  ',
      example: '  Hola!  ',
    });

    expect(create).toHaveBeenCalledWith({
      deckId: 'deck-1',
      front: 'hola',
      back: 'hello',
      example: 'Hola!',
      notes: undefined,
      position: 2,
    });
  });
});

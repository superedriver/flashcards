import { ErrorCodes } from '../../../../common/errors';
import { AuthUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { UpdateDeckInput } from '../ports/deck-repository.port';
import { UpdateDeckUseCase } from './update-deck.use-case';

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
    description: 'desc',
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
  const update = jest
    .fn<Promise<Deck>, [UpdateDeckInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...createDeck(),
        title: input.title ?? createDeck().title,
        description:
          input.description !== undefined
            ? input.description
            : createDeck().description,
      }),
    );

  const useCase = new UpdateDeckUseCase({
    create: jest.fn(),
    findById: jest.fn().mockResolvedValue(deck),
    findByOwner: jest.fn(),
    update,
    softDelete: jest.fn(),
  });

  return { useCase, update };
}

describe('UpdateDeckUseCase', () => {
  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase(null);

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'missing', title: 'New' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for non-owner', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: otherUser,
        deckId: 'deck-1',
        title: 'Hack',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('owner can update title', async () => {
    const { useCase, update } = createUseCase(createDeck());

    await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      title: '  Updated  ',
    });

    expect(update).toHaveBeenCalledWith({
      deckId: 'deck-1',
      title: 'Updated',
    });
  });

  it('owner can update description', async () => {
    const { useCase, update } = createUseCase(createDeck());

    await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      description: '  New desc  ',
    });

    expect(update).toHaveBeenCalledWith({
      deckId: 'deck-1',
      description: 'New desc',
    });
  });

  it('rejects empty title with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        title: '   ',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects title longer than 120 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        title: 'a'.repeat(121),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects description longer than 1000 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase(createDeck());

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        description: 'a'.repeat(1001),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('updates only provided fields', async () => {
    const { useCase, update } = createUseCase(createDeck());

    await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      title: 'Only Title',
    });

    expect(update).toHaveBeenCalledWith({
      deckId: 'deck-1',
      title: 'Only Title',
    });
  });
});

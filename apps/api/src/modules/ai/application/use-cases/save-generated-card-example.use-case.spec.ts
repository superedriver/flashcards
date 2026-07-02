import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import { SaveGeneratedCardExampleUseCase } from './save-generated-card-example.use-case';

const owner: AuthUser = {
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

function createUseCase(options?: {
  user?: SafeUser | null;
  card?: Card | null;
  deck?: Deck | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findCardById = jest
    .fn()
    .mockResolvedValue(options?.card === undefined ? card : options.card);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const updateCard = jest
    .fn()
    .mockImplementation((input: { cardId: string; example: string }) =>
      Promise.resolve({
        ...card,
        example: input.example,
        updatedAt: new Date('2026-06-01T12:00:00.000Z'),
      }),
    );

  const useCase = new SaveGeneratedCardExampleUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findById: findCardById,
      create: jest.fn(),
      update: updateCard,
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
      findByDeckId: jest.fn(),
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
  );

  return { useCase, updateCard };
}

describe('SaveGeneratedCardExampleUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'card-1',
        exampleText: 'Example sentence',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws CARD_NOT_FOUND when card is missing', async () => {
    const { useCase } = createUseCase({ card: null });

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'missing',
        exampleText: 'Example sentence',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_NOT_FOUND });
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'card-1',
        exampleText: 'Example sentence',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws CARD_FORBIDDEN for non-owner (canManageCard)', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'card-1',
        exampleText: 'Example sentence',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.CARD_FORBIDDEN });
  });

  it('throws VALIDATION_ERROR when exampleText is empty/whitespace', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'card-1',
        exampleText: '   ',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('throws VALIDATION_ERROR when exampleText exceeds 4000 characters', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: owner,
        cardId: 'card-1',
        exampleText: 'x'.repeat(4001),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('updates card.example via CardRepositoryPort.update', async () => {
    const { useCase, updateCard } = createUseCase();

    await useCase.execute({
      currentUser: owner,
      cardId: 'card-1',
      exampleText: '  Example sentence  ',
    });

    expect(updateCard).toHaveBeenCalledWith({
      cardId: 'card-1',
      example: 'Example sentence',
    });
  });

  it('returns updated card', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUser: owner,
      cardId: 'card-1',
      exampleText: 'Example sentence',
    });

    expect(result.card.example).toBe('Example sentence');
  });
});

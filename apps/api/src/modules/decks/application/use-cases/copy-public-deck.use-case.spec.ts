import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../domain/types';
import { CreateCopiedDeckInput } from '../ports/deck-repository.port';
import { CreateManyCardsInput } from '../ports/card-repository.port';
import { CopyPublicDeckUseCase } from './copy-public-deck.use-case';

const currentUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const sourceDeck: Deck = {
  id: 'source-deck-1',
  ownerId: 'owner-1',
  title: 'Public Source',
  description: 'Source description',
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const sourceCards: Card[] = [
  {
    id: 'card-1',
    deckId: 'source-deck-1',
    front: 'apple',
    back: 'яблуко',
    example: 'An apple a day',
    notes: 'note',
    position: 0,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  },
  {
    id: 'card-2',
    deckId: 'source-deck-1',
    front: 'book',
    back: 'книга',
    example: null,
    notes: null,
    position: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  },
];

function createUseCase(options?: {
  user?: SafeUser | null;
  sourceDeck?: Deck | null;
  sourceCards?: Card[];
}) {
  const copiedDeck: Deck = {
    id: 'copied-deck-1',
    ownerId: currentUser.id,
    title: sourceDeck.title,
    description: sourceDeck.description,
    visibility: 'PRIVATE',
    moderationStatus: 'NONE',
    isOfficial: false,
    sourceDeckId: sourceDeck.id,
    createdAt: new Date('2026-01-02T00:00:00.000Z'),
    updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    deletedAt: null,
  };

  const createCopiedDeck = jest
    .fn<Promise<Deck>, [CreateCopiedDeckInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...copiedDeck,
        ownerId: input.ownerId,
        sourceDeckId: input.sourceDeckId,
        title: input.title,
        description: input.description ?? null,
      }),
    );

  const createMany = jest
    .fn()
    .mockImplementation((input: CreateManyCardsInput) =>
      Promise.resolve(
        input.cards.map((card, index) => ({
          id: `copied-card-${index + 1}`,
          deckId: copiedDeck.id,
          front: card.front,
          back: card.back,
          example: card.example ?? null,
          notes: card.notes ?? null,
          position: card.position,
          createdAt: new Date('2026-01-02T00:00:00.000Z'),
          updatedAt: new Date('2026-01-02T00:00:00.000Z'),
          deletedAt: null,
        })),
      ),
    );

  const useCase = new CopyPublicDeckUseCase(
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
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest
        .fn()
        .mockResolvedValue(
          options?.sourceDeck === undefined ? sourceDeck : options.sourceDeck,
        ),
      searchPublicApproved: jest.fn(),
      createCopiedDeck,
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByDeckId: jest
        .fn()
        .mockResolvedValue(options?.sourceCards ?? sourceCards),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany,
    },
  );

  return { useCase, createCopiedDeck, createMany, copiedDeck };
}

describe('CopyPublicDeckUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ currentUser, sourceDeckId: 'source-deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-01-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser, sourceDeckId: 'source-deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws DECK_NOT_FOUND when source deck is not public approved', async () => {
    const { useCase } = createUseCase({ sourceDeck: null });

    await expect(
      useCase.execute({ currentUser, sourceDeckId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('copies deck with source title and description', async () => {
    const { useCase, createCopiedDeck } = createUseCase();

    await useCase.execute({ currentUser, sourceDeckId: 'source-deck-1' });

    expect(createCopiedDeck).toHaveBeenCalledWith({
      ownerId: currentUser.id,
      sourceDeckId: sourceDeck.id,
      title: sourceDeck.title,
      description: sourceDeck.description,
    });
  });

  it('copies all source cards with front/back/example/notes/position preserved', async () => {
    const { useCase, createMany, copiedDeck } = createUseCase();

    const result = await useCase.execute({
      currentUser,
      sourceDeckId: 'source-deck-1',
    });

    expect(createMany).toHaveBeenCalledWith({
      cards: [
        {
          deckId: copiedDeck.id,
          front: 'apple',
          back: 'яблуко',
          example: 'An apple a day',
          notes: 'note',
          position: 0,
        },
        {
          deckId: copiedDeck.id,
          front: 'book',
          back: 'книга',
          example: null,
          notes: null,
          position: 1,
        },
      ],
    });

    expect(result.cards).toHaveLength(2);
    expect(result.cards[0]?.front).toBe('apple');
    expect(result.cards[1]?.position).toBe(1);
  });

  it('returns empty cards array when source deck has no cards', async () => {
    const { useCase, createMany } = createUseCase({ sourceCards: [] });

    const result = await useCase.execute({
      currentUser,
      sourceDeckId: 'source-deck-1',
    });

    expect(createMany).not.toHaveBeenCalled();
    expect(result.cards).toEqual([]);
    expect(result.deck.ownerId).toBe(currentUser.id);
  });
});

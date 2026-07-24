import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Card, Deck } from '../../../decks/domain/types';
import { CopyGroupDeckUseCase } from './copy-group-deck.use-case';

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
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Shared Spanish',
  description: null,
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  targetLanguage: 'es',
  sourceLanguage: 'en',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const sourceCards: Card[] = [
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

function createUseCase(options?: {
  user?: SafeUser | null;
  hasAccess?: boolean;
  sourceDeck?: Deck | null;
}) {
  const createCopiedDeck = jest.fn().mockResolvedValue({
    ...sourceDeck,
    id: 'copied-1',
    ownerId: currentUser.id,
    sourceDeckId: sourceDeck.id,
  });
  const createMany = jest.fn().mockResolvedValue([
    {
      ...sourceCards[0],
      id: 'copied-card-1',
      deckId: 'copied-1',
    },
  ]);

  const useCase = new CopyGroupDeckUseCase(
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
      findById: jest
        .fn()
        .mockResolvedValue(
          options?.sourceDeck === undefined ? sourceDeck : options.sourceDeck,
        ),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck,
      countByOwnerAndTargetLanguage: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByDeckId: jest.fn().mockResolvedValue(sourceCards),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany,
    },
    {
      create: jest.fn(),
      findByDeckAndGroup: jest.fn(),
      findActiveGroupsForDeck: jest.fn(),
      findSharedDecksForGroup: jest.fn(),
      findSharedDecksForUser: jest.fn(),
      userHasAccessToDeck: jest
        .fn()
        .mockResolvedValue(options?.hasAccess ?? true),
    },
    {
      findByUserAndCard: jest.fn(),
      findDueCardIdsForDeck: jest.fn(),
      findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      countDueForOwnDecksWithTargetLanguage: jest.fn(),
      countLearningGroupsForDeck: jest.fn(),
      countLearningGroupsForOwnDecksWithTargetLanguage: jest.fn(),
      findNextDueAtForDeck: jest.fn(),
      createInitialIfMissing: jest.fn(),
      createInitialMany: jest.fn(),
      upsert: jest.fn(),
    },
  );

  return { useCase, createCopiedDeck, createMany };
}

describe('CopyGroupDeckUseCase', () => {
  it('rejects when user has no group access', async () => {
    const { useCase } = createUseCase({ hasAccess: false });

    await expect(
      useCase.execute({ currentUser, sourceDeckId: 'deck-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('creates 1:1 private copy with language pair for group member', async () => {
    const { useCase, createCopiedDeck, createMany } = createUseCase();

    const result = await useCase.execute({
      currentUser,
      sourceDeckId: 'deck-1',
    });

    expect(createCopiedDeck).toHaveBeenCalledWith({
      ownerId: 'user-1',
      sourceDeckId: 'deck-1',
      title: 'Shared Spanish',
      description: null,
      targetLanguage: 'es',
      sourceLanguage: 'en',
    });
    expect(createMany).toHaveBeenCalled();
    expect(result.deck.id).toBe('copied-1');
  });
});

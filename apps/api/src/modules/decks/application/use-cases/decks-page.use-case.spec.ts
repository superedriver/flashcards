import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { DecksPageUseCase } from './decks-page.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function makeDeck(
  overrides: Partial<Deck> & Pick<Deck, 'id' | 'ownerId'>,
): Deck {
  return {
    title: overrides.title ?? overrides.id,
    description: null,
    visibility: 'PRIVATE',
    moderationStatus: 'NONE',
    isOfficial: false,
    sourceDeckId: null,
    targetLanguage: null,
    sourceLanguage: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

function createUseCase(options?: {
  user?: SafeUser | null;
  ownedDecks?: Deck[];
  sharedDecks?: Deck[];
  publicMatching?: Deck[];
  publicNull?: Deck[];
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findByOwner = jest.fn().mockResolvedValue(options?.ownedDecks ?? []);
  const findSharedDecksForUser = jest
    .fn()
    .mockResolvedValue(options?.sharedDecks ?? []);
  const searchPublicApproved = jest
    .fn()
    .mockImplementation(
      (input: {
        targetLanguage?: string | null;
        requireNullTargetLanguage?: boolean;
      }) => {
        if (input.requireNullTargetLanguage) {
          return Promise.resolve({
            items: options?.publicNull ?? [],
            total: 0,
          });
        }

        return Promise.resolve({
          items: options?.publicMatching ?? [],
          total: 0,
        });
      },
    );

  const useCase = new DecksPageUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByOwner,
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved,
      createCopiedDeck: jest.fn(),
      countByOwnerAndTargetLanguage: jest.fn(),
    },
    {
      create: jest.fn(),
      findByDeckAndGroup: jest.fn(),
      findActiveGroupsForDeck: jest.fn(),
      findSharedDecksForGroup: jest.fn(),
      findSharedDecksForUser,
      userHasAccessToDeck: jest.fn(),
    },
  );

  return { useCase, findByOwner, findSharedDecksForUser, searchPublicApproved };
}

describe('DecksPageUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUserId: 'missing',
        activeTargetLanguage: 'en',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('rejects empty activeTargetLanguage with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUserId: 'user-1',
        activeTargetLanguage: '  ',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('splits decks into four sections with origins', async () => {
    const ownedEn = makeDeck({
      id: 'own-en',
      ownerId: 'user-1',
      targetLanguage: 'en',
      sourceLanguage: 'uk',
    });
    const ownedNull = makeDeck({
      id: 'own-null',
      ownerId: 'user-1',
      targetLanguage: null,
    });
    const sharedEn = makeDeck({
      id: 'group-en',
      ownerId: 'other',
      targetLanguage: 'en',
      sourceLanguage: 'uk',
    });
    const sharedNull = makeDeck({
      id: 'group-null',
      ownerId: 'other',
      targetLanguage: null,
    });
    const publicEn = makeDeck({
      id: 'public-en',
      ownerId: 'catalog',
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      targetLanguage: 'en',
      sourceLanguage: 'uk',
    });
    const publicNull = makeDeck({
      id: 'public-null',
      ownerId: 'catalog',
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      targetLanguage: null,
    });
    const ownedAlsoShared = makeDeck({
      id: 'own-shared-en',
      ownerId: 'user-1',
      targetLanguage: 'en',
    });

    const { useCase, searchPublicApproved } = createUseCase({
      ownedDecks: [ownedEn, ownedNull, ownedAlsoShared],
      sharedDecks: [sharedEn, sharedNull, ownedAlsoShared],
      publicMatching: [publicEn],
      publicNull: [publicNull],
    });

    const result = await useCase.execute({
      currentUserId: 'user-1',
      activeTargetLanguage: 'en',
    });

    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ targetLanguage: 'en', limit: 50 }),
    );
    expect(searchPublicApproved).toHaveBeenCalledWith(
      expect.objectContaining({ requireNullTargetLanguage: true, limit: 50 }),
    );

    expect(result.ownDecks.map((d) => d.id)).toEqual([
      'own-en',
      'own-shared-en',
    ]);
    expect(result.ownDecks.every((d) => d.origin === 'OWN')).toBe(true);

    expect(result.groupDecks.map((d) => d.id)).toEqual(['group-en']);
    expect(result.groupDecks[0]?.origin).toBe('GROUP');

    expect(result.publicDecks.map((d) => d.id)).toEqual(['public-en']);
    expect(result.publicDecks[0]?.origin).toBe('PUBLIC');

    expect(result.noLanguageDecks.map((d) => [d.id, d.origin])).toEqual([
      ['own-null', 'OWN'],
      ['group-null', 'GROUP'],
      ['public-null', 'PUBLIC'],
    ]);
  });
});

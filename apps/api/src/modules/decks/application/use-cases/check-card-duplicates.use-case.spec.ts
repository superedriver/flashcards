import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { LiveDuplicateCard } from '../ports/card-repository.port';
import { CheckCardDuplicatesUseCase } from './check-card-duplicates.use-case';

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
  targetLanguage: 'es',
  sourceLanguage: 'en',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

function liveDuplicate(
  overrides: Partial<LiveDuplicateCard> = {},
): LiveDuplicateCard {
  return {
    id: 'card-1',
    deckId: 'deck-1',
    deckTitle: 'Spanish Basics',
    front: 'hola',
    back: 'hello',
    ...overrides,
  };
}

function createUseCase(options?: {
  user?: SafeUser | null;
  deck?: Deck | null;
  liveDuplicates?: LiveDuplicateCard[];
}) {
  const findLiveDuplicatesForOwner = jest
    .fn()
    .mockResolvedValue(options?.liveDuplicates ?? []);

  const useCase = new CheckCardDuplicatesUseCase(
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
        .mockResolvedValue(options?.deck === undefined ? deck : options.deck),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      countByOwnerAndTargetLanguage: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findByDeckId: jest.fn(),
      findLiveDuplicatesForOwner,
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      countByDeckId: jest.fn(),
      createMany: jest.fn(),
    },
  );

  return { useCase, findLiveDuplicatesForOwner };
}

describe('CheckCardDuplicatesUseCase', () => {
  it('throws UNAUTHORIZED when the user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [{ front: 'hola', back: 'hello' }],
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when the user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [{ front: 'hola', back: 'hello' }],
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws DECK_NOT_FOUND when the deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'missing',
        pairs: [{ front: 'hola', back: 'hello' }],
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for a non-owner', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [{ front: 'hola', back: 'hello' }],
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('throws VALIDATION_ERROR when more than 100 pairs are sent', async () => {
    const { useCase, findLiveDuplicatesForOwner } = createUseCase();
    const pairs = Array.from({ length: 101 }, (_, index) => ({
      front: `front-${index}`,
      back: `back-${index}`,
    }));

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    expect(findLiveDuplicatesForOwner).not.toHaveBeenCalled();
  });

  it('returns a CURRENT_DECK hit when the pair is already in this deck', async () => {
    const { useCase } = createUseCase({
      liveDuplicates: [liveDuplicate()],
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [{ front: 'hola', back: 'hello' }],
      }),
    ).resolves.toEqual({
      hits: [{ index: 0, kind: 'CURRENT_DECK', deckTitle: null }],
    });
  });

  it('returns an OTHER_DECK hit with that deck title', async () => {
    const { useCase } = createUseCase({
      liveDuplicates: [
        liveDuplicate({
          id: 'card-2',
          deckId: 'deck-2',
          deckTitle: 'Travel',
        }),
      ],
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [{ front: 'hola', back: 'hello' }],
      }),
    ).resolves.toEqual({
      hits: [{ index: 0, kind: 'OTHER_DECK', deckTitle: 'Travel' }],
    });
  });

  it('returns an IN_BATCH hit for a later duplicate in the same request', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [
          { front: 'hola', back: 'hello' },
          { front: 'adios', back: 'goodbye' },
          { front: '  HOLA ', back: 'HELLO' },
        ],
      }),
    ).resolves.toEqual({
      hits: [{ index: 2, kind: 'IN_BATCH', deckTitle: null }],
    });
  });

  it('prefers CURRENT_DECK over OTHER_DECK and IN_BATCH', async () => {
    const { useCase } = createUseCase({
      liveDuplicates: [
        liveDuplicate({
          id: 'card-2',
          deckId: 'deck-2',
          deckTitle: 'Travel',
        }),
        liveDuplicate(),
      ],
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [
          { front: 'hola', back: 'hello' },
          { front: 'hola', back: 'hello' },
        ],
      }),
    ).resolves.toEqual({
      hits: [
        { index: 0, kind: 'CURRENT_DECK', deckTitle: null },
        { index: 1, kind: 'CURRENT_DECK', deckTitle: null },
      ],
    });
  });

  it('prefers OTHER_DECK over IN_BATCH', async () => {
    const { useCase } = createUseCase({
      liveDuplicates: [
        liveDuplicate({
          id: 'card-2',
          deckId: 'deck-2',
          deckTitle: 'Travel',
        }),
      ],
    });

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [
          { front: 'hola', back: 'hello' },
          { front: 'hola', back: 'hello' },
        ],
      }),
    ).resolves.toEqual({
      hits: [
        { index: 0, kind: 'OTHER_DECK', deckTitle: 'Travel' },
        { index: 1, kind: 'OTHER_DECK', deckTitle: 'Travel' },
      ],
    });
  });

  it('returns no hits when the pair is unique', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: owner,
        deckId: 'deck-1',
        pairs: [{ front: 'hola', back: 'hello' }],
      }),
    ).resolves.toEqual({ hits: [] });
  });
});

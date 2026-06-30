import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../domain/types';
import { MyDecksUseCase } from './my-decks.use-case';

const safeUser: SafeUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const decks: Deck[] = [
  {
    id: 'deck-1',
    ownerId: 'owner-1',
    title: 'Deck 1',
    description: null,
    visibility: 'PRIVATE',
    moderationStatus: 'NONE',
    isOfficial: false,
    sourceDeckId: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
  },
];

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findByOwner = jest.fn().mockResolvedValue(decks);

  const useCase = new MyDecksUseCase(
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
    },
  );

  return { useCase, findByOwner };
}

describe('MyDecksUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ currentUserId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUserId: 'owner-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('returns decks from findByOwner for current user', async () => {
    const { useCase, findByOwner } = createUseCase();

    const result = await useCase.execute({ currentUserId: 'owner-1' });

    expect(findByOwner).toHaveBeenCalledWith('owner-1');
    expect(result).toEqual(decks);
  });
});

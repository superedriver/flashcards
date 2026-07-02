import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { ModerationDeck } from '../../domain/types';
import { ModerationQueueUseCase } from './moderation-queue.use-case';

const adminUser: AuthUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
};

const moderatorUser: AuthUser = {
  id: 'mod-1',
  email: 'mod@example.com',
  role: 'MODERATOR',
};

const regularUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const moderationDeck: ModerationDeck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: null,
  visibility: 'PUBLIC',
  moderationStatus: 'PENDING',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
  ownerEmail: 'owner@example.com',
  cardCount: 5,
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const moderationQueue = jest.fn().mockResolvedValue({
    items: [moderationDeck],
    total: 1,
  });

  const useCase = new ModerationQueueUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      moderationQueue,
      setModerationStatus: jest.fn(),
      setOfficial: jest.fn(),
    },
  );

  return { useCase, moderationQueue };
}

describe('ModerationQueueUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ currentUser: adminUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: adminUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws FORBIDDEN for USER', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, id: 'user-1', role: 'USER' },
    });

    await expect(
      useCase.execute({ currentUser: regularUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('allows ADMIN access', async () => {
    const { useCase } = createUseCase();

    await expect(useCase.execute({ currentUser: adminUser })).resolves.toEqual({
      items: [moderationDeck],
      total: 1,
    });
  });

  it('allows MODERATOR access', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, id: 'mod-1', role: 'MODERATOR' },
    });

    await expect(
      useCase.execute({ currentUser: moderatorUser }),
    ).resolves.toEqual({ items: [moderationDeck], total: 1 });
  });

  it('normalizes invalid status filter to null', async () => {
    const { useCase, moderationQueue } = createUseCase();

    await useCase.execute({
      currentUser: adminUser,
      status: 'NONE',
    });

    expect(moderationQueue).toHaveBeenCalledWith(
      expect.objectContaining({ status: null }),
    );
  });

  it('clamps limit and offset', async () => {
    const { useCase, moderationQueue } = createUseCase();

    await useCase.execute({ currentUser: adminUser, limit: 100, offset: -3 });

    expect(moderationQueue).toHaveBeenCalledWith({
      status: null,
      limit: 50,
      offset: 0,
    });
  });

  it('returns moderation decks with ownerEmail and cardCount', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUser: adminUser,
      status: 'PENDING',
    });

    expect(result.items[0]).toMatchObject({
      ownerEmail: 'owner@example.com',
      cardCount: 5,
    });
  });
});

import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { AdminUserSummary } from '../../domain/types';
import { AdminSearchUsersUseCase } from './admin-search-users.use-case';

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

const safeAdmin: SafeUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const userSummary: AdminUserSummary = {
  id: 'target-1',
  email: 'target@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeAdmin : options.user);
  const searchUsers = jest.fn().mockResolvedValue({
    items: [userSummary],
    total: 1,
  });

  const useCase = new AdminSearchUsersUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      searchUsers,
      findById: jest.fn(),
      blockUser: jest.fn(),
      unblockUser: jest.fn(),
    },
  );

  return { useCase, searchUsers };
}

describe('AdminSearchUsersUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ currentUser: adminUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: adminUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws FORBIDDEN for MODERATOR', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, id: 'mod-1', role: 'MODERATOR' },
    });

    await expect(
      useCase.execute({ currentUser: moderatorUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('throws FORBIDDEN for USER', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, id: 'user-1', role: 'USER' },
    });

    await expect(
      useCase.execute({ currentUser: regularUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('normalizes blank query to null', async () => {
    const { useCase, searchUsers } = createUseCase();

    await useCase.execute({ currentUser: adminUser, query: '   ' });

    expect(searchUsers).toHaveBeenCalledWith(
      expect.objectContaining({ query: null }),
    );
  });

  it('clamps limit to default 20, min 1, max 50', async () => {
    const { useCase, searchUsers } = createUseCase();

    await useCase.execute({ currentUser: adminUser });
    expect(searchUsers).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 20 }),
    );

    await useCase.execute({ currentUser: adminUser, limit: 0 });
    expect(searchUsers).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 1 }),
    );

    await useCase.execute({ currentUser: adminUser, limit: 100 });
    expect(searchUsers).toHaveBeenLastCalledWith(
      expect.objectContaining({ limit: 50 }),
    );
  });

  it('normalizes offset to default 0 and min 0', async () => {
    const { useCase, searchUsers } = createUseCase();

    await useCase.execute({ currentUser: adminUser, offset: -5 });

    expect(searchUsers).toHaveBeenCalledWith(
      expect.objectContaining({ offset: 0 }),
    );
  });

  it('returns safe user summaries without sensitive fields', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUser: adminUser,
      query: 'target',
    });

    expect(result.items[0]).toEqual(userSummary);
    expect(JSON.stringify(result)).not.toMatch(/passwordHash|tokenHash/i);
  });
});

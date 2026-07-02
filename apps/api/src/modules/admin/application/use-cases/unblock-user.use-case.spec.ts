import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { AdminUserSummary } from '../../domain/types';
import { UnblockUserUseCase } from './unblock-user.use-case';

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

const unblockedSummary: AdminUserSummary = {
  id: 'target-1',
  email: 'target@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-07-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  target?: AdminUserSummary | null;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeAdmin : options.user);
  const adminFindById = jest
    .fn()
    .mockResolvedValue(
      options?.target === undefined ? unblockedSummary : options.target,
    );
  const unblockUser = jest.fn().mockResolvedValue(unblockedSummary);
  const revokeAllForUser = jest.fn();

  const useCase = new UnblockUserUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      searchUsers: jest.fn(),
      findById: adminFindById,
      blockUser: jest.fn(),
      unblockUser,
    },
  );

  return { useCase, unblockUser, revokeAllForUser };
}

describe('UnblockUserUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ currentUser: adminUser, userId: 'target-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: adminUser, userId: 'target-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws FORBIDDEN for MODERATOR', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, id: 'mod-1', role: 'MODERATOR' },
    });

    await expect(
      useCase.execute({ currentUser: moderatorUser, userId: 'target-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('throws FORBIDDEN for USER', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, id: 'user-1', role: 'USER' },
    });

    await expect(
      useCase.execute({ currentUser: regularUser, userId: 'target-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('throws NOT_FOUND when target user is missing', async () => {
    const { useCase } = createUseCase({ target: null });

    await expect(
      useCase.execute({ currentUser: adminUser, userId: 'missing-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.NOT_FOUND });
  });

  it('unblocks target user and does not revoke refresh tokens', async () => {
    const { useCase, unblockUser, revokeAllForUser } = createUseCase();

    const result = await useCase.execute({
      currentUser: adminUser,
      userId: 'target-1',
    });

    expect(unblockUser).toHaveBeenCalledWith('target-1');
    expect(revokeAllForUser).not.toHaveBeenCalled();
    expect(result).toEqual(unblockedSummary);
  });
});

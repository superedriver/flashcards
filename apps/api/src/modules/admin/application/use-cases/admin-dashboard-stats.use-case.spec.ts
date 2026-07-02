import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { AdminDashboardStats } from '../../domain/types';
import { AdminDashboardStatsUseCase } from './admin-dashboard-stats.use-case';

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

const dashboardStats: AdminDashboardStats = {
  totalUsers: 10,
  totalDecks: 20,
  totalPublicDecks: 5,
  totalCards: 100,
  totalStudySessions: 30,
  totalReviews: 200,
  usersCreatedLast7Days: 2,
  decksCreatedLast7Days: 3,
  reviewsSubmittedLast7Days: 15,
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const getDashboardStats = jest.fn().mockResolvedValue(dashboardStats);

  const useCase = new AdminDashboardStatsUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    { getDashboardStats },
  );

  return { useCase, getDashboardStats };
}

describe('AdminDashboardStatsUseCase', () => {
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

  it('throws FORBIDDEN for MODERATOR', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, id: 'mod-1', role: 'MODERATOR' },
    });

    await expect(
      useCase.execute({ currentUser: moderatorUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('throws FORBIDDEN for USER', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, id: 'user-1', role: 'USER' },
    });

    await expect(
      useCase.execute({ currentUser: regularUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('loads dashboard stats for ADMIN and returns stats from repository', async () => {
    const { useCase, getDashboardStats } = createUseCase();

    const result = await useCase.execute({ currentUser: adminUser });

    expect(getDashboardStats).toHaveBeenCalledWith({
      now: expect.any(Date) as Date,
    });
    expect(result).toEqual(dashboardStats);
  });
});

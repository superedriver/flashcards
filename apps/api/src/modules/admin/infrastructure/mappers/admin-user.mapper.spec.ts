import { toAdminUserSummary } from './admin-user.mapper';

const prismaUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'ADMIN',
  emailVerifiedAt: new Date('2026-01-01T00:00:00.000Z'),
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('admin-user.mapper', () => {
  it('toAdminUserSummary maps all safe fields from Prisma record', () => {
    expect(toAdminUserSummary(prismaUser)).toEqual({
      id: 'user-1',
      email: 'user@example.com',
      role: 'ADMIN',
      emailVerifiedAt: prismaUser.emailVerifiedAt,
      blockedAt: null,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  });

  it('toAdminUserSummary casts role to UserRole enum', () => {
    expect(toAdminUserSummary({ ...prismaUser, role: 'MODERATOR' }).role).toBe(
      'MODERATOR',
    );
  });

  it('mapper output does not include passwordHash or token fields', () => {
    const mapped = toAdminUserSummary({
      ...prismaUser,
      passwordHash: 'secret',
      tokenHash: 'hash',
    } as typeof prismaUser & { passwordHash: string; tokenHash: string });

    expect(mapped).not.toHaveProperty('passwordHash');
    expect(mapped).not.toHaveProperty('tokenHash');
  });
});

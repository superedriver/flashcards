import { toSafeUser, toUserWithPassword } from './user.mapper';

const prismaUser = {
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: 'hashed-password',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('user.mapper', () => {
  it('toSafeUser excludes passwordHash', () => {
    const safeUser = toSafeUser(prismaUser);

    expect(safeUser).toEqual({
      id: 'user-1',
      email: 'test@example.com',
      role: 'USER',
      emailVerifiedAt: null,
      blockedAt: null,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
    expect(safeUser).not.toHaveProperty('passwordHash');
  });

  it('toUserWithPassword includes passwordHash', () => {
    const userWithPassword = toUserWithPassword(prismaUser);

    expect(userWithPassword.passwordHash).toBe('hashed-password');
    expect(userWithPassword.email).toBe('test@example.com');
  });
});

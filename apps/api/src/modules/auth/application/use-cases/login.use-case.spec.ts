import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import { LoginUseCase } from './login.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  userRecord?: {
    passwordHash: string | null;
    blockedAt?: Date | null;
  } | null;
  passwordValid?: boolean;
}) {
  const findByEmail = jest.fn().mockResolvedValue(
    options?.userRecord === undefined
      ? { ...safeUser, passwordHash: 'hashed-password' }
      : options.userRecord === null
        ? null
        : {
            ...safeUser,
            passwordHash: options.userRecord.passwordHash,
            blockedAt: options.userRecord.blockedAt ?? null,
          },
  );
  const verify = jest.fn().mockResolvedValue(options?.passwordValid ?? true);
  const generateRefreshToken = jest.fn().mockReturnValue('raw-refresh-token');
  const hashToken = jest.fn().mockReturnValue('token-hash');
  const createRefreshToken = jest.fn().mockResolvedValue({
    id: 'refresh-1',
    userId: safeUser.id,
    tokenHash: 'token-hash',
    expiresAt: new Date(),
    revokedAt: null,
    createdAt: new Date(),
  });
  const sign = jest.fn().mockResolvedValue('access-token');

  const useCase = new LoginUseCase(
    { findById: jest.fn(), findByEmail, create: jest.fn() },
    { hash: jest.fn(), verify },
    { generateRefreshToken },
    { hash: hashToken },
    {
      create: createRefreshToken,
      findActiveByHash: jest.fn(),
      revokeById: jest.fn(),
      revokeAllForUser: jest.fn(),
    },
    { sign, verify: jest.fn() },
  );

  return { useCase, findByEmail, hashToken, createRefreshToken };
}

describe('LoginUseCase', () => {
  it('normalizes email before lookup', async () => {
    const { useCase, findByEmail } = createUseCase();

    await useCase.execute({
      email: '  Test@Example.COM  ',
      password: 'password123',
    });

    expect(findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('rejects missing user with INVALID_CREDENTIALS', async () => {
    const { useCase } = createUseCase({ userRecord: null });

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'password123' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.INVALID_CREDENTIALS,
    });
  });

  it('rejects missing passwordHash with INVALID_CREDENTIALS', async () => {
    const { useCase } = createUseCase({
      userRecord: { passwordHash: null },
    });

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'password123' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.INVALID_CREDENTIALS,
    });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      userRecord: {
        passwordHash: 'hashed-password',
        blockedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    });

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'password123' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.USER_BLOCKED,
    });
  });

  it('rejects invalid password with INVALID_CREDENTIALS', async () => {
    const { useCase } = createUseCase({ passwordValid: false });

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.INVALID_CREDENTIALS,
    });
  });

  it('stores refresh token hash and returns safe auth payload', async () => {
    const { useCase, hashToken, createRefreshToken } = createUseCase();

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(hashToken).toHaveBeenCalledWith('raw-refresh-token');
    expect(createRefreshToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: safeUser.id,
        tokenHash: 'token-hash',
      }),
    );
    expect(result).toEqual({
      user: safeUser,
      accessToken: 'access-token',
      refreshToken: 'raw-refresh-token',
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });
});

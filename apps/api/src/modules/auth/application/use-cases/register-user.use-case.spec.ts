import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import { CreateEmailVerificationTokenUseCase } from './create-email-verification-token.use-case';
import { RegisterUserUseCase } from './register-user.use-case';

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
  existingUser?: boolean;
  createdUser?: SafeUser;
  verificationEmailError?: Error;
}) {
  const findByEmail = jest
    .fn()
    .mockResolvedValue(
      options?.existingUser
        ? { ...safeUser, passwordHash: 'hashed-password' }
        : null,
    );
  const create = jest.fn().mockResolvedValue(options?.createdUser ?? safeUser);
  const hash = jest.fn().mockResolvedValue('hashed-password');
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
  const createEmailVerificationToken = jest.fn().mockImplementation(() => {
    if (options?.verificationEmailError) {
      return Promise.reject(options.verificationEmailError);
    }

    return Promise.resolve({ success: true });
  });

  const useCase = new RegisterUserUseCase(
    { findById: jest.fn(), findByEmail, create },
    { hash, verify: jest.fn() },
    { generateRefreshToken },
    { hash: hashToken },
    {
      create: createRefreshToken,
      findActiveByHash: jest.fn(),
      revokeById: jest.fn(),
      revokeAllForUser: jest.fn(),
    },
    { sign, verify: jest.fn() },
    {
      execute: createEmailVerificationToken,
    } as unknown as CreateEmailVerificationTokenUseCase,
  );

  return {
    useCase,
    findByEmail,
    create,
    hash,
    hashToken,
    createRefreshToken,
    createEmailVerificationToken,
  };
}

describe('RegisterUserUseCase', () => {
  it('normalizes email before checking and creating user', async () => {
    const { useCase, findByEmail, create, hash } = createUseCase();

    await useCase.execute({
      email: '  Test@Example.COM  ',
      password: 'password123',
    });

    expect(findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(hash).toHaveBeenCalledWith('password123');
    expect(create).toHaveBeenCalledWith({
      email: 'test@example.com',
      passwordHash: 'hashed-password',
    });
  });

  it('rejects invalid email format with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ email: 'not-an-email', password: 'password123' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('rejects password shorter than 8 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ email: 'test@example.com', password: '1234567' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('rejects password longer than 128 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'a'.repeat(129),
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('rejects existing email with USER_ALREADY_EXISTS', async () => {
    const { useCase } = createUseCase({ existingUser: true });

    await expect(
      useCase.execute({ email: 'test@example.com', password: 'password123' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.USER_ALREADY_EXISTS,
    });
  });

  it('stores refresh token hash and returns safe auth payload', async () => {
    const {
      useCase,
      hashToken,
      createRefreshToken,
      createEmailVerificationToken,
    } = createUseCase();

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
    expect(createRefreshToken).not.toHaveBeenCalledWith(
      expect.objectContaining({
        tokenHash: 'raw-refresh-token',
      }),
    );
    expect(createEmailVerificationToken).toHaveBeenCalledWith({
      userId: safeUser.id,
      email: safeUser.email,
    });
    expect(result).toEqual({
      user: safeUser,
      accessToken: 'access-token',
      refreshToken: 'raw-refresh-token',
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('still returns auth payload when verification email fails', async () => {
    const { useCase, createEmailVerificationToken } = createUseCase({
      verificationEmailError: new Error('email provider unavailable'),
    });

    const result = await useCase.execute({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(createEmailVerificationToken).toHaveBeenCalledWith({
      userId: safeUser.id,
      email: safeUser.email,
    });
    expect(result).toEqual({
      user: safeUser,
      accessToken: 'access-token',
      refreshToken: 'raw-refresh-token',
    });
  });
});

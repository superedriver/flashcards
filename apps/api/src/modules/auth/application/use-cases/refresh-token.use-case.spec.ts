import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import { RefreshTokenUseCase } from './refresh-token.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const activeToken = {
  id: 'refresh-1',
  userId: safeUser.id,
  tokenHash: 'token-hash',
  expiresAt: new Date('2026-12-31T00:00:00.000Z'),
  revokedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  activeToken?: typeof activeToken | null;
  user?: SafeUser | null;
  hashResults?: string[];
  findActiveByHash?: jest.Mock;
}) {
  const findActiveByHash =
    options?.findActiveByHash ??
    jest
      .fn()
      .mockResolvedValue(
        options?.activeToken === undefined ? activeToken : options.activeToken,
      );
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const revokeById = jest.fn();
  const createRefreshToken = jest.fn().mockResolvedValue({
    id: 'refresh-2',
    userId: safeUser.id,
    tokenHash: 'new-token-hash',
    expiresAt: new Date(),
    revokedAt: null,
    createdAt: new Date(),
  });
  const hashToken = jest
    .fn()
    .mockReturnValueOnce(options?.hashResults?.[0] ?? 'token-hash')
    .mockReturnValueOnce(options?.hashResults?.[1] ?? 'new-token-hash')
    .mockReturnValue(options?.hashResults?.[1] ?? 'token-hash');
  const generateRefreshToken = jest
    .fn()
    .mockReturnValue('new-raw-refresh-token');
  const sign = jest.fn().mockResolvedValue('new-access-token');

  const useCase = new RefreshTokenUseCase(
    { findById, findByEmail: jest.fn(), create: jest.fn() },
    { generateRefreshToken },
    { hash: hashToken },
    {
      create: createRefreshToken,
      findActiveByHash,
      revokeById,
      revokeAllForUser: jest.fn(),
    },
    { sign, verify: jest.fn() },
  );

  return {
    useCase,
    hashToken,
    findActiveByHash,
    revokeById,
    createRefreshToken,
  };
}

describe('RefreshTokenUseCase', () => {
  it('hashes incoming raw refresh token before lookup', async () => {
    const { useCase, hashToken, findActiveByHash } = createUseCase();

    await useCase.execute({ refreshToken: 'raw-refresh-token' });

    expect(hashToken).toHaveBeenCalledWith('raw-refresh-token');
    expect(findActiveByHash).toHaveBeenCalledWith('token-hash');
  });

  it('rejects unknown or inactive token', async () => {
    const { useCase } = createUseCase({ activeToken: null });

    await expect(
      useCase.execute({ refreshToken: 'invalid-token' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
  });

  it('rejects blocked user', async () => {
    const { useCase } = createUseCase({
      user: {
        ...safeUser,
        blockedAt: new Date('2026-01-02T00:00:00.000Z'),
      },
    });

    await expect(
      useCase.execute({ refreshToken: 'raw-refresh-token' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.USER_BLOCKED,
    });
  });

  it('revokes old token and stores rotated refresh token hash', async () => {
    const { useCase, revokeById, createRefreshToken, hashToken } =
      createUseCase({
        hashResults: ['token-hash', 'new-token-hash'],
      });

    const result = await useCase.execute({ refreshToken: 'raw-refresh-token' });

    expect(revokeById).toHaveBeenCalledWith('refresh-1');
    expect(createRefreshToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: safeUser.id,
        tokenHash: 'new-token-hash',
        rotatedFromTokenId: 'refresh-1',
      }),
    );
    expect(result).toEqual({
      user: safeUser,
      accessToken: 'new-access-token',
      refreshToken: 'new-raw-refresh-token',
    });
    expect(hashToken).toHaveBeenLastCalledWith('new-raw-refresh-token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('old refresh token cannot succeed after rotation', async () => {
    const findActiveByHash = jest
      .fn()
      .mockResolvedValueOnce(activeToken)
      .mockResolvedValueOnce(null);
    const { useCase } = createUseCase({ findActiveByHash });

    await useCase.execute({ refreshToken: 'raw-refresh-token' });

    await expect(
      useCase.execute({ refreshToken: 'raw-refresh-token' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
  });
});

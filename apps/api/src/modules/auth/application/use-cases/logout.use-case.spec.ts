import { LogoutUseCase } from './logout.use-case';

const activeToken = {
  id: 'refresh-1',
  userId: 'user-1',
  tokenHash: 'token-hash',
  expiresAt: new Date('2026-12-31T00:00:00.000Z'),
  revokedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: { activeToken?: typeof activeToken | null }) {
  const hashToken = jest.fn().mockReturnValue('token-hash');
  const findActiveByHash = jest
    .fn()
    .mockResolvedValue(
      options?.activeToken === undefined ? activeToken : options.activeToken,
    );
  const revokeById = jest.fn();

  const useCase = new LogoutUseCase(
    { hash: hashToken },
    {
      create: jest.fn(),
      findActiveByHash,
      revokeById,
      revokeAllForUser: jest.fn(),
    },
  );

  return { useCase, hashToken, findActiveByHash, revokeById };
}

describe('LogoutUseCase', () => {
  it('hashes incoming raw refresh token before lookup', async () => {
    const { useCase, hashToken, findActiveByHash } = createUseCase();

    await useCase.execute({ refreshToken: 'raw-refresh-token' });

    expect(hashToken).toHaveBeenCalledWith('raw-refresh-token');
    expect(findActiveByHash).toHaveBeenCalledWith('token-hash');
  });

  it('revokes active refresh token', async () => {
    const { useCase, revokeById } = createUseCase();

    const result = await useCase.execute({ refreshToken: 'raw-refresh-token' });

    expect(revokeById).toHaveBeenCalledWith('refresh-1');
    expect(result).toEqual({ success: true });
  });

  it('returns success when token is missing or already revoked', async () => {
    const { useCase, revokeById } = createUseCase({ activeToken: null });

    const result = await useCase.execute({ refreshToken: 'missing-token' });

    expect(revokeById).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});

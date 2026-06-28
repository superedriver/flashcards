import { RequestPasswordResetUseCase } from './request-password-reset.use-case';

const appWebUrl = 'http://localhost:8081';

const activeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER' as const,
  emailVerifiedAt: null,
  blockedAt: null as Date | null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  passwordHash: 'hashed-password',
};

function createUseCase(options?: { user?: typeof activeUser | null }) {
  const findByEmail = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? activeUser : options.user);
  const revokeActiveForUser = jest.fn().mockResolvedValue(undefined);
  const create = jest.fn().mockResolvedValue({
    id: 'reset-1',
    userId: 'user-1',
    tokenHash: 'token-hash',
    expiresAt: new Date(),
    usedAt: null,
    createdAt: new Date(),
  });
  const generateRefreshToken = jest.fn().mockReturnValue('raw-reset-token');
  const hashToken = jest.fn().mockReturnValue('token-hash');
  const send = jest.fn().mockResolvedValue(undefined);
  const getOrThrow = jest.fn().mockReturnValue(appWebUrl);

  const useCase = new RequestPasswordResetUseCase(
    {
      findById: jest.fn(),
      findByEmail,
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create,
      findValidByHash: jest.fn(),
      markUsed: jest.fn(),
      revokeActiveForUser,
    },
    { generateRefreshToken },
    { hash: hashToken },
    { send },
    { getOrThrow } as never,
  );

  return {
    useCase,
    findByEmail,
    revokeActiveForUser,
    create,
    hashToken,
    send,
  };
}

describe('RequestPasswordResetUseCase', () => {
  it('normalizes email before lookup', async () => {
    const { useCase, findByEmail } = createUseCase();

    await useCase.execute({ email: '  Test@Example.COM  ' });

    expect(findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('missing user returns success without sending email', async () => {
    const { useCase, send, create } = createUseCase({ user: null });

    const result = await useCase.execute({ email: 'missing@example.com' });

    expect(result).toEqual({ success: true });
    expect(send).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('blocked user returns success without sending email', async () => {
    const { useCase, send, create } = createUseCase({
      user: { ...activeUser, blockedAt: new Date() },
    });

    const result = await useCase.execute({ email: 'test@example.com' });

    expect(result).toEqual({ success: true });
    expect(send).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('existing user revokes tokens, stores hash, and sends reset email', async () => {
    const { useCase, revokeActiveForUser, create, hashToken, send } =
      createUseCase();
    const before = Date.now();

    const result = await useCase.execute({ email: 'test@example.com' });

    expect(revokeActiveForUser).toHaveBeenCalledWith('user-1');
    expect(hashToken).toHaveBeenCalledWith('raw-reset-token');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        tokenHash: 'token-hash',
      }),
    );
    expect(create).not.toHaveBeenCalledWith(
      expect.objectContaining({ tokenHash: 'raw-reset-token' }),
    );

    const [[createInput]] = create.mock.calls as [
      [{ userId: string; tokenHash: string; expiresAt: Date }],
    ];
    const expiryMs = createInput.expiresAt.getTime() - before;
    expect(expiryMs).toBeGreaterThanOrEqual(55 * 60 * 1000);
    expect(expiryMs).toBeLessThanOrEqual(65 * 60 * 1000);

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Reset your password',
      }),
    );

    const [[sentMessage]] = send.mock.calls as [
      [{ text: string; to: string; subject: string }],
    ];
    expect(sentMessage.text).toContain(
      'http://localhost:8081/reset-password?token=raw-reset-token',
    );
    expect(result).toEqual({ success: true });
  });
});

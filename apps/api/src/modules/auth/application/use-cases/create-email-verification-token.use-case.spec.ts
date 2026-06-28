import { CreateEmailVerificationTokenUseCase } from './create-email-verification-token.use-case';

const appWebUrl = 'http://localhost:8081';

function createUseCase() {
  const revokeActiveForUser = jest.fn().mockResolvedValue(undefined);
  const create = jest.fn().mockResolvedValue({
    id: 'verify-1',
    userId: 'user-1',
    tokenHash: 'token-hash',
    expiresAt: new Date(),
    usedAt: null,
    createdAt: new Date(),
  });
  const generateRefreshToken = jest.fn().mockReturnValue('raw-verify-token');
  const hashToken = jest.fn().mockReturnValue('token-hash');
  const send = jest.fn().mockResolvedValue(undefined);
  const getOrThrow = jest.fn().mockReturnValue(appWebUrl);

  const useCase = new CreateEmailVerificationTokenUseCase(
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
    revokeActiveForUser,
    create,
    generateRefreshToken,
    hashToken,
    send,
  };
}

describe('CreateEmailVerificationTokenUseCase', () => {
  it('revokes active verification tokens for user', async () => {
    const { useCase, revokeActiveForUser } = createUseCase();

    await useCase.execute({ userId: 'user-1', email: 'test@example.com' });

    expect(revokeActiveForUser).toHaveBeenCalledWith('user-1');
  });

  it('stores only token hash with 24h expiry', async () => {
    const { useCase, generateRefreshToken, hashToken, create } =
      createUseCase();
    const before = Date.now();

    await useCase.execute({ userId: 'user-1', email: 'test@example.com' });

    expect(generateRefreshToken).toHaveBeenCalled();
    expect(hashToken).toHaveBeenCalledWith('raw-verify-token');
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        tokenHash: 'token-hash',
      }),
    );
    expect(create).not.toHaveBeenCalledWith(
      expect.objectContaining({ tokenHash: 'raw-verify-token' }),
    );

    const [[createInput]] = create.mock.calls as [
      [{ userId: string; tokenHash: string; expiresAt: Date }],
    ];
    const expiryMs = createInput.expiresAt.getTime() - before;
    expect(expiryMs).toBeGreaterThanOrEqual(23 * 60 * 60 * 1000);
    expect(expiryMs).toBeLessThanOrEqual(25 * 60 * 60 * 1000);
  });

  it('sends verification email with APP_WEB_URL verify link', async () => {
    const { useCase, send } = createUseCase();

    const result = await useCase.execute({
      userId: 'user-1',
      email: 'test@example.com',
    });

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Verify your email',
      }),
    );

    const [[sentMessage]] = send.mock.calls as [
      [{ text: string; html: string; to: string; subject: string }],
    ];
    expect(sentMessage.text).toContain(
      'http://localhost:8081/verify-email?token=raw-verify-token',
    );
    expect(sentMessage.html).toContain(
      'http://localhost:8081/verify-email?token=raw-verify-token',
    );
    expect(result).toEqual({ success: true });
  });
});

import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import { VerifyEmailUseCase } from './verify-email.use-case';

const verificationToken = {
  id: 'verify-1',
  userId: 'user-1',
  tokenHash: 'token-hash',
  expiresAt: new Date('2026-12-31T00:00:00.000Z'),
  usedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

const verifiedUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: new Date('2026-06-01T00:00:00.000Z'),
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  verificationToken?: typeof verificationToken | null;
}) {
  const hashToken = jest.fn().mockReturnValue('token-hash');
  const findValidByHash = jest
    .fn()
    .mockResolvedValue(
      options?.verificationToken === undefined
        ? verificationToken
        : options.verificationToken,
    );
  const markUsed = jest.fn().mockResolvedValue(undefined);
  const markEmailVerified = jest.fn().mockResolvedValue(verifiedUser);

  const useCase = new VerifyEmailUseCase(
    { hash: hashToken },
    {
      create: jest.fn(),
      findValidByHash,
      markUsed,
      revokeActiveForUser: jest.fn(),
    },
    {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified,
      updatePasswordHash: jest.fn(),
    },
  );

  return { useCase, hashToken, findValidByHash, markUsed, markEmailVerified };
}

describe('VerifyEmailUseCase', () => {
  it('hashes raw token before lookup', async () => {
    const { useCase, hashToken, findValidByHash } = createUseCase();

    await useCase.execute({ token: 'raw-verify-token' });

    expect(hashToken).toHaveBeenCalledWith('raw-verify-token');
    expect(findValidByHash).toHaveBeenCalledWith('token-hash');
  });

  it('rejects missing token with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase({ verificationToken: null });

    await expect(useCase.execute({ token: 'bad-token' })).rejects.toMatchObject(
      {
        code: ErrorCodes.VALIDATION_ERROR,
      },
    );
  });

  it('marks user email as verified and token as used', async () => {
    const { useCase, markEmailVerified, markUsed } = createUseCase();

    const result = await useCase.execute({ token: 'raw-verify-token' });

    expect(markEmailVerified).toHaveBeenCalledWith('user-1', expect.any(Date));
    expect(markUsed).toHaveBeenCalledWith('verify-1');
    expect(result).toEqual(verifiedUser);
    expect(result).not.toHaveProperty('passwordHash');
  });
});

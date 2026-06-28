import { ErrorCodes } from '../../../../common/errors';
import { ResetPasswordUseCase } from './reset-password.use-case';

const resetToken = {
  id: 'reset-1',
  userId: 'user-1',
  tokenHash: 'token-hash',
  expiresAt: new Date('2026-12-31T00:00:00.000Z'),
  usedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: { resetToken?: typeof resetToken | null }) {
  const hashToken = jest.fn().mockReturnValue('token-hash');
  const findValidByHash = jest
    .fn()
    .mockResolvedValue(
      options?.resetToken === undefined ? resetToken : options.resetToken,
    );
  const markUsed = jest.fn().mockResolvedValue(undefined);
  const hashPassword = jest.fn().mockResolvedValue('new-password-hash');
  const updatePasswordHash = jest.fn().mockResolvedValue(undefined);
  const revokeAllForUser = jest.fn().mockResolvedValue(undefined);

  const useCase = new ResetPasswordUseCase(
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
      markEmailVerified: jest.fn(),
      updatePasswordHash,
    },
    { hash: hashPassword, verify: jest.fn() },
    {
      create: jest.fn(),
      findActiveByHash: jest.fn(),
      revokeById: jest.fn(),
      revokeAllForUser,
    },
  );

  return {
    useCase,
    hashToken,
    findValidByHash,
    hashPassword,
    updatePasswordHash,
    markUsed,
    revokeAllForUser,
  };
}

describe('ResetPasswordUseCase', () => {
  it('rejects password shorter than 8 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ token: 'raw-reset-token', newPassword: '1234567' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects password longer than 128 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        token: 'raw-reset-token',
        newPassword: 'a'.repeat(129),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('hashes raw reset token before lookup', async () => {
    const { useCase, hashToken, findValidByHash } = createUseCase();

    await useCase.execute({
      token: 'raw-reset-token',
      newPassword: 'newpassword123',
    });

    expect(hashToken).toHaveBeenCalledWith('raw-reset-token');
    expect(findValidByHash).toHaveBeenCalledWith('token-hash');
  });

  it('rejects missing token with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase({ resetToken: null });

    await expect(
      useCase.execute({ token: 'bad-token', newPassword: 'newpassword123' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('updates password, marks token used, and revokes refresh tokens', async () => {
    const {
      useCase,
      hashPassword,
      updatePasswordHash,
      markUsed,
      revokeAllForUser,
    } = createUseCase();

    const result = await useCase.execute({
      token: 'raw-reset-token',
      newPassword: 'newpassword123',
    });

    expect(hashPassword).toHaveBeenCalledWith('newpassword123');
    expect(updatePasswordHash).toHaveBeenCalledWith(
      'user-1',
      'new-password-hash',
    );
    expect(markUsed).toHaveBeenCalledWith('reset-1');
    expect(revokeAllForUser).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ success: true });
  });
});

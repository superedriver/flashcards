import { ErrorCodes } from '../../../../common/errors';
import { ChangePasswordUseCase } from './change-password.use-case';

const safeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const userWithPassword = {
  ...safeUser,
  passwordHash: 'hashed-current-password',
};
const oauthUser = { ...safeUser, passwordHash: null };

function createUseCase(options?: {
  userBase?: typeof safeUser | null;
  userByEmail?: typeof userWithPassword | null;
  verifyResult?: boolean;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(
      options?.userBase === undefined ? safeUser : options.userBase,
    );
  const findByEmail = jest
    .fn()
    .mockResolvedValue(
      options?.userByEmail === undefined
        ? userWithPassword
        : options.userByEmail,
    );
  const updatePasswordHash = jest.fn().mockResolvedValue(undefined);
  const verify = jest
    .fn()
    .mockResolvedValue(
      options?.verifyResult === undefined ? true : options.verifyResult,
    );
  const hash = jest.fn().mockResolvedValue('hashed-new-password');

  const useCase = new ChangePasswordUseCase(
    {
      findById,
      findByEmail,
      create: jest.fn(),
      createOAuthUser: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash,
      deleteById: jest.fn(),
    },
    { hash, verify },
  );

  return { useCase, findById, findByEmail, updatePasswordHash, verify, hash };
}

describe('ChangePasswordUseCase', () => {
  it('changes password successfully', async () => {
    const { useCase, updatePasswordHash, hash } = createUseCase();

    await useCase.execute({
      userId: 'user-1',
      currentPassword: 'OldPassword1',
      newPassword: 'NewPassword1',
    });

    expect(hash).toHaveBeenCalledWith('NewPassword1');
    expect(updatePasswordHash).toHaveBeenCalledWith(
      'user-1',
      'hashed-new-password',
    );
  });

  it('rejects when user not found', async () => {
    const { useCase } = createUseCase({ userBase: null });

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'OldPassword1',
        newPassword: 'NewPassword1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('rejects OAuth user with FORBIDDEN', async () => {
    const { useCase } = createUseCase({ userByEmail: oauthUser });

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'OldPassword1',
        newPassword: 'NewPassword1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('rejects incorrect current password with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase({ verifyResult: false });

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'WrongPassword1',
        newPassword: 'NewPassword1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects new password shorter than 8 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'OldPassword1',
        newPassword: 'Ab1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects new password without uppercase with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'OldPassword1',
        newPassword: 'newpassword1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects new password without lowercase with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'OldPassword1',
        newPassword: 'NEWPASSWORD1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects new password without digit with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        currentPassword: 'OldPassword1',
        newPassword: 'NewPassword',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });
});

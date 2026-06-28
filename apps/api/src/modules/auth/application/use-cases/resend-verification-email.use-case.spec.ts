import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../domain/types';
import { CreateEmailVerificationTokenUseCase } from './create-email-verification-token.use-case';
import { ResendVerificationEmailUseCase } from './resend-verification-email.use-case';

const unverifiedUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(
      options?.user === undefined ? unverifiedUser : options.user,
    );
  const createEmailVerificationToken = jest
    .fn()
    .mockResolvedValue({ success: true });

  const useCase = new ResendVerificationEmailUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      execute: createEmailVerificationToken,
    } as unknown as CreateEmailVerificationTokenUseCase,
  );

  return { useCase, findById, createEmailVerificationToken };
}

describe('ResendVerificationEmailUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(useCase.execute({ userId: 'missing' })).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      user: { ...unverifiedUser, blockedAt: new Date() },
    });

    await expect(useCase.execute({ userId: 'user-1' })).rejects.toMatchObject({
      code: ErrorCodes.USER_BLOCKED,
    });
  });

  it('already verified user returns success without creating token', async () => {
    const { useCase, createEmailVerificationToken } = createUseCase({
      user: { ...unverifiedUser, emailVerifiedAt: new Date() },
    });

    const result = await useCase.execute({ userId: 'user-1' });

    expect(createEmailVerificationToken).not.toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it('unverified user triggers CreateEmailVerificationTokenUseCase', async () => {
    const { useCase, createEmailVerificationToken } = createUseCase();

    const result = await useCase.execute({ userId: 'user-1' });

    expect(createEmailVerificationToken).toHaveBeenCalledWith({
      userId: 'user-1',
      email: 'test@example.com',
    });
    expect(result).toEqual({ success: true });
  });
});

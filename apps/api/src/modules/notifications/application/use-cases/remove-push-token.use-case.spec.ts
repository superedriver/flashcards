import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { RemovePushTokenUseCase } from './remove-push-token.use-case';

const authUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const disable = jest.fn().mockResolvedValue(undefined);

  const useCase = new RemovePushTokenUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      register: jest.fn(),
      findActiveByUserId: jest.fn(),
      findActiveForUsers: jest.fn(),
      disable,
      markUsed: jest.fn(),
    },
  );

  return { useCase, disable };
}

describe('RemovePushTokenUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUser: authUser,
        token: 'ExponentPushToken[abc]',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        token: 'ExponentPushToken[abc]',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws VALIDATION_ERROR when token is empty/whitespace', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUser: authUser, token: '   ' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('trims token before disable', async () => {
    const { useCase, disable } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      token: '  ExponentPushToken[abc]  ',
    });

    expect(disable).toHaveBeenCalledWith({
      userId: 'user-1',
      token: 'ExponentPushToken[abc]',
    });
  });

  it('disables token for current user only and returns success true', async () => {
    const { useCase, disable } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      token: 'ExponentPushToken[abc]',
    });

    expect(disable).toHaveBeenCalledWith({
      userId: 'user-1',
      token: 'ExponentPushToken[abc]',
    });
    expect(result).toEqual({ success: true });
  });
});

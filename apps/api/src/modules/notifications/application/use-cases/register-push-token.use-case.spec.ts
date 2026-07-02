import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { PushToken } from '../../domain/types';
import { RegisterPushTokenUseCase } from './register-push-token.use-case';

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

const pushToken: PushToken = {
  id: 'token-1',
  userId: 'user-1',
  provider: 'EXPO',
  token: 'ExponentPushToken[abc]',
  deviceId: 'device-1',
  platform: 'ios',
  disabledAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  lastUsedAt: null,
};

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const register = jest.fn().mockResolvedValue(pushToken);

  const useCase = new RegisterPushTokenUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      register,
      findActiveByUserId: jest.fn(),
      findActiveForUsers: jest.fn(),
      disable: jest.fn(),
      markUsed: jest.fn(),
    },
  );

  return { useCase, register };
}

describe('RegisterPushTokenUseCase', () => {
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

  it('throws VALIDATION_ERROR when token exceeds 500 characters', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: authUser,
        token: 'a'.repeat(501),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('throws VALIDATION_ERROR when deviceId exceeds 200 characters', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: authUser,
        token: 'ExponentPushToken[abc]',
        deviceId: 'd'.repeat(201),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('throws VALIDATION_ERROR when platform exceeds 50 characters', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: authUser,
        token: 'ExponentPushToken[abc]',
        platform: 'p'.repeat(51),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('trims token, deviceId, and platform', async () => {
    const { useCase, register } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      token: '  ExponentPushToken[abc]  ',
      deviceId: '  device-1  ',
      platform: '  ios  ',
    });

    expect(register).toHaveBeenCalledWith({
      userId: 'user-1',
      token: 'ExponentPushToken[abc]',
      deviceId: 'device-1',
      platform: 'ios',
    });
  });

  it('converts blank deviceId/platform to null', async () => {
    const { useCase, register } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      token: 'ExponentPushToken[abc]',
      deviceId: '   ',
      platform: '   ',
    });

    expect(register).toHaveBeenCalledWith({
      userId: 'user-1',
      token: 'ExponentPushToken[abc]',
      deviceId: null,
      platform: null,
    });
  });

  it('registers token for current user and returns success true', async () => {
    const { useCase, register } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      token: 'ExponentPushToken[abc]',
    });

    expect(register).toHaveBeenCalledWith({
      userId: 'user-1',
      token: 'ExponentPushToken[abc]',
      deviceId: null,
      platform: null,
    });
    expect(result).toEqual({ success: true });
  });
});

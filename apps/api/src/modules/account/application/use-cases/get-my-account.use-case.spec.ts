import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { UserProfile, UserSettings } from '../../domain/types';
import { GetMyAccountUseCase } from './get-my-account.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const profile: UserProfile = {
  id: 'profile-1',
  userId: 'user-1',
  displayName: null,
  avatarUrl: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const settings: UserSettings = {
  id: 'settings-1',
  userId: 'user-1',
  interfaceLocale: 'en',
  themePreference: 'SYSTEM',
  notificationsEnabled: false,
  reminderTime: '18:00',
  timezone: 'UTC',
  audioAutoplayEnabled: false,
  lessonSize: 20,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  profile?: UserProfile | null;
  settings?: UserSettings | null;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findProfileByUserId = jest
    .fn()
    .mockResolvedValue(
      options?.profile === undefined ? profile : options.profile,
    );
  const createProfileForUser = jest.fn().mockResolvedValue(profile);
  const findSettingsByUserId = jest
    .fn()
    .mockResolvedValue(
      options?.settings === undefined ? settings : options.settings,
    );
  const createSettingsForUser = jest.fn().mockResolvedValue(settings);

  const useCase = new GetMyAccountUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findByUserId: findProfileByUserId,
      createForUser: createProfileForUser,
      update: jest.fn(),
    },
    {
      findByUserId: findSettingsByUserId,
      createForUser: createSettingsForUser,
      update: jest.fn(),
    },
  );

  return {
    useCase,
    findById,
    findProfileByUserId,
    createProfileForUser,
    findSettingsByUserId,
    createSettingsForUser,
  };
}

describe('GetMyAccountUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(useCase.execute({ userId: 'missing' })).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date() },
    });

    await expect(useCase.execute({ userId: 'user-1' })).rejects.toMatchObject({
      code: ErrorCodes.USER_BLOCKED,
    });
  });

  it('creates profile when missing', async () => {
    const { useCase, createProfileForUser } = createUseCase({
      profile: null,
    });

    await useCase.execute({ userId: 'user-1' });

    expect(createProfileForUser).toHaveBeenCalledWith('user-1');
  });

  it('creates settings when missing', async () => {
    const { useCase, createSettingsForUser } = createUseCase({
      settings: null,
    });

    await useCase.execute({ userId: 'user-1' });

    expect(createSettingsForUser).toHaveBeenCalledWith('user-1');
  });

  it('returns MyAccount with user, profile, and settings', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toEqual({
      user: safeUser,
      profile,
      settings,
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('does not create profile or settings when they already exist', async () => {
    const { useCase, createProfileForUser, createSettingsForUser } =
      createUseCase();

    await useCase.execute({ userId: 'user-1' });

    expect(createProfileForUser).not.toHaveBeenCalled();
    expect(createSettingsForUser).not.toHaveBeenCalled();
  });
});

import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { UserSettings } from '../../domain/types';
import { UpdateUserSettingsInput } from '../ports/user-settings-repository.port';
import { UpdateSettingsUseCase } from './update-settings.use-case';

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'test@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
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
  settings?: UserSettings | null;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findByUserId = jest
    .fn()
    .mockResolvedValue(
      options?.settings === undefined ? settings : options.settings,
    );
  const createForUser = jest.fn().mockResolvedValue(settings);
  const update = jest
    .fn<Promise<UserSettings>, [UpdateUserSettingsInput]>()
    .mockImplementation((input) => Promise.resolve({ ...settings, ...input }));

  const useCase = new UpdateSettingsUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findByUserId,
      createForUser,
      update,
      findWithNotificationsEnabled: jest.fn(),
    },
  );

  return { useCase, findByUserId, createForUser, update };
}

describe('UpdateSettingsUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({ userId: 'missing', lessonSize: 10 }),
    ).rejects.toMatchObject({
      code: ErrorCodes.UNAUTHORIZED,
    });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date() },
    });

    await expect(
      useCase.execute({ userId: 'user-1', lessonSize: 10 }),
    ).rejects.toMatchObject({
      code: ErrorCodes.USER_BLOCKED,
    });
  });

  it.each(['en', 'uk'])(
    'accepts supported interfaceLocale %s',
    async (interfaceLocale) => {
      const { useCase, update } = createUseCase();

      await useCase.execute({ userId: 'user-1', interfaceLocale });

      expect(update).toHaveBeenCalledWith({
        userId: 'user-1',
        interfaceLocale,
      });
    },
  );

  it('rejects unsupported interfaceLocale with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ userId: 'user-1', interfaceLocale: 'de' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it.each(['SYSTEM', 'LIGHT', 'DARK'] as const)(
    'accepts themePreference %s',
    async (themePreference) => {
      const { useCase, update } = createUseCase();

      await useCase.execute({ userId: 'user-1', themePreference });

      expect(update).toHaveBeenCalledWith({
        userId: 'user-1',
        themePreference,
      });
    },
  );

  it('rejects invalid reminderTime with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ userId: 'user-1', reminderTime: '25:99' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('accepts valid reminderTime in HH:mm format', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({ userId: 'user-1', reminderTime: ' 09:30 ' });

    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      reminderTime: '09:30',
    });
  });

  it('rejects empty timezone with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ userId: 'user-1', timezone: '   ' }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('rejects timezone longer than 100 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'user-1',
        timezone: 'a'.repeat(101),
      }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it.each([4, 101])(
    'rejects lessonSize %s with VALIDATION_ERROR',
    async (lessonSize) => {
      const { useCase } = createUseCase();

      await expect(
        useCase.execute({ userId: 'user-1', lessonSize }),
      ).rejects.toMatchObject({
        code: ErrorCodes.VALIDATION_ERROR,
      });
    },
  );

  it('rejects non-integer lessonSize with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ userId: 'user-1', lessonSize: 10.5 }),
    ).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });

  it('updates notificationsEnabled and audioAutoplayEnabled booleans', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({
      userId: 'user-1',
      notificationsEnabled: true,
      audioAutoplayEnabled: true,
    });

    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      notificationsEnabled: true,
      audioAutoplayEnabled: true,
    });
  });

  it('creates settings when missing, then updates', async () => {
    const { useCase, createForUser, update } = createUseCase({
      settings: null,
    });

    await useCase.execute({ userId: 'user-1', lessonSize: 25 });

    expect(createForUser).toHaveBeenCalledWith('user-1');
    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      lessonSize: 25,
    });
  });

  it('returns updated settings', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      userId: 'user-1',
      lessonSize: 25,
      interfaceLocale: 'uk',
    });

    expect(result.lessonSize).toBe(25);
    expect(result.interfaceLocale).toBe('uk');
  });

  it('updates only provided fields', async () => {
    const { useCase, update } = createUseCase();

    await useCase.execute({ userId: 'user-1', lessonSize: 25 });

    expect(update).toHaveBeenCalledWith({
      userId: 'user-1',
      lessonSize: 25,
    });
    const [callInput] = update.mock.calls[0] as [UpdateUserSettingsInput];
    expect(callInput).not.toHaveProperty('interfaceLocale');
  });
});

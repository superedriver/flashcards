import { toUserSettings } from './user-settings.mapper';

const prismaSettings = {
  id: 'settings-1',
  userId: 'user-1',
  interfaceLocale: 'uk',
  themePreference: 'DARK',
  notificationsEnabled: true,
  reminderTime: '09:30',
  timezone: 'Europe/Kyiv',
  audioAutoplayEnabled: true,
  lessonSize: 25,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

describe('user-settings.mapper', () => {
  it('toUserSettings maps all fields from Prisma record', () => {
    expect(toUserSettings(prismaSettings)).toEqual({
      id: 'settings-1',
      userId: 'user-1',
      interfaceLocale: 'uk',
      themePreference: 'DARK',
      notificationsEnabled: true,
      reminderTime: '09:30',
      timezone: 'Europe/Kyiv',
      audioAutoplayEnabled: true,
      lessonSize: 25,
      createdAt: prismaSettings.createdAt,
      updatedAt: prismaSettings.updatedAt,
    });
  });

  it('toUserSettings casts themePreference to ThemePreference', () => {
    const result = toUserSettings({
      ...prismaSettings,
      themePreference: 'LIGHT',
    });

    expect(result.themePreference).toBe('LIGHT');
  });
});

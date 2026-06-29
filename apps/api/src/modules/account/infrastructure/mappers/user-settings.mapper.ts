import { ThemePreference, UserSettings } from '../../domain/types';

type PrismaUserSettingsRecord = {
  id: string;
  userId: string;
  interfaceLocale: string;
  themePreference: string;
  notificationsEnabled: boolean;
  reminderTime: string;
  timezone: string;
  audioAutoplayEnabled: boolean;
  lessonSize: number;
  createdAt: Date;
  updatedAt: Date;
};

export function toUserSettings(
  settings: PrismaUserSettingsRecord,
): UserSettings {
  return {
    id: settings.id,
    userId: settings.userId,
    interfaceLocale: settings.interfaceLocale,
    themePreference: settings.themePreference as ThemePreference,
    notificationsEnabled: settings.notificationsEnabled,
    reminderTime: settings.reminderTime,
    timezone: settings.timezone,
    audioAutoplayEnabled: settings.audioAutoplayEnabled,
    lessonSize: settings.lessonSize,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
}

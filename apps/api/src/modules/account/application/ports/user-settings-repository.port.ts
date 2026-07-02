import { ThemePreference, UserSettings } from '../../domain/types';

export const USER_SETTINGS_REPOSITORY = Symbol('USER_SETTINGS_REPOSITORY');

export type UpdateUserSettingsInput = {
  userId: string;
  interfaceLocale?: string;
  themePreference?: ThemePreference;
  notificationsEnabled?: boolean;
  reminderTime?: string;
  timezone?: string;
  audioAutoplayEnabled?: boolean;
  lessonSize?: number;
};

export type UserSettingsRepositoryPort = {
  findByUserId(userId: string): Promise<UserSettings | null>;
  createForUser(userId: string): Promise<UserSettings>;
  update(input: UpdateUserSettingsInput): Promise<UserSettings>;
  findWithNotificationsEnabled(): Promise<UserSettings[]>;
};

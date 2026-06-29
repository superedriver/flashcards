import { ThemePreference } from './theme-preference.type';

export type UserSettings = {
  id: string;
  userId: string;
  interfaceLocale: string;
  themePreference: ThemePreference;
  notificationsEnabled: boolean;
  reminderTime: string;
  timezone: string;
  audioAutoplayEnabled: boolean;
  lessonSize: number;
  createdAt: Date;
  updatedAt: Date;
};

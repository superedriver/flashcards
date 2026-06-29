import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  UpdateUserSettingsInput,
  UserSettingsRepositoryPort,
} from '../../application/ports/user-settings-repository.port';
import { ThemePreference, UserSettings } from '../../domain/types';
import { toUserSettings } from '../mappers/user-settings.mapper';

@Injectable()
export class PrismaUserSettingsRepository implements UserSettingsRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserSettings | null> {
    const settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    return settings ? toUserSettings(settings) : null;
  }

  async createForUser(userId: string): Promise<UserSettings> {
    const settings = await this.prisma.userSettings.create({
      data: { userId },
    });

    return toUserSettings(settings);
  }

  async update(input: UpdateUserSettingsInput): Promise<UserSettings> {
    const data: {
      interfaceLocale?: string;
      themePreference?: ThemePreference;
      notificationsEnabled?: boolean;
      reminderTime?: string;
      timezone?: string;
      audioAutoplayEnabled?: boolean;
      lessonSize?: number;
    } = {};

    if (input.interfaceLocale !== undefined) {
      data.interfaceLocale = input.interfaceLocale;
    }

    if (input.themePreference !== undefined) {
      data.themePreference = input.themePreference;
    }

    if (input.notificationsEnabled !== undefined) {
      data.notificationsEnabled = input.notificationsEnabled;
    }

    if (input.reminderTime !== undefined) {
      data.reminderTime = input.reminderTime;
    }

    if (input.timezone !== undefined) {
      data.timezone = input.timezone;
    }

    if (input.audioAutoplayEnabled !== undefined) {
      data.audioAutoplayEnabled = input.audioAutoplayEnabled;
    }

    if (input.lessonSize !== undefined) {
      data.lessonSize = input.lessonSize;
    }

    const settings = await this.prisma.userSettings.update({
      where: { userId: input.userId },
      data,
    });

    return toUserSettings(settings);
  }
}

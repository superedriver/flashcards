import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { ThemePreference, UserSettings } from '../../domain/types';
import {
  USER_SETTINGS_REPOSITORY,
  UserSettingsRepositoryPort,
} from '../ports/user-settings-repository.port';

export type UpdateSettingsInput = {
  userId: string;
  interfaceLocale?: string;
  themePreference?: ThemePreference;
  notificationsEnabled?: boolean;
  reminderTime?: string;
  timezone?: string;
  audioAutoplayEnabled?: boolean;
  lessonSize?: number;
};

export type UpdateSettingsResult = UserSettings;

const SUPPORTED_LOCALES = new Set(['en', 'uk']);
const THEME_PREFERENCES = new Set<ThemePreference>(['SYSTEM', 'LIGHT', 'DARK']);
const REMINDER_TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIMEZONE_MAX_LENGTH = 100;
const LESSON_SIZE_MIN = 5;
const LESSON_SIZE_MAX = 100;

@Injectable()
export class UpdateSettingsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
  ) {}

  async execute(input: UpdateSettingsInput): Promise<UpdateSettingsResult> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const updateData: {
      interfaceLocale?: string;
      themePreference?: ThemePreference;
      notificationsEnabled?: boolean;
      reminderTime?: string;
      timezone?: string;
      audioAutoplayEnabled?: boolean;
      lessonSize?: number;
    } = {};

    if (input.interfaceLocale !== undefined) {
      const interfaceLocale = input.interfaceLocale.trim();

      if (!SUPPORTED_LOCALES.has(interfaceLocale)) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Unsupported interface locale',
        );
      }

      updateData.interfaceLocale = interfaceLocale;
    }

    if (input.themePreference !== undefined) {
      if (!THEME_PREFERENCES.has(input.themePreference)) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Invalid theme preference',
        );
      }

      updateData.themePreference = input.themePreference;
    }

    if (input.notificationsEnabled !== undefined) {
      updateData.notificationsEnabled = input.notificationsEnabled;
    }

    if (input.reminderTime !== undefined) {
      const reminderTime = input.reminderTime.trim();

      if (!REMINDER_TIME_REGEX.test(reminderTime)) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Reminder time must be in HH:mm format between 00:00 and 23:59',
        );
      }

      updateData.reminderTime = reminderTime;
    }

    if (input.timezone !== undefined) {
      const timezone = input.timezone.trim();

      if (!timezone) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Timezone is required',
        );
      }

      if (timezone.length > TIMEZONE_MAX_LENGTH) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Timezone must be at most 100 characters',
        );
      }

      updateData.timezone = timezone;
    }

    if (input.audioAutoplayEnabled !== undefined) {
      updateData.audioAutoplayEnabled = input.audioAutoplayEnabled;
    }

    if (input.lessonSize !== undefined) {
      if (
        !Number.isInteger(input.lessonSize) ||
        input.lessonSize < LESSON_SIZE_MIN ||
        input.lessonSize > LESSON_SIZE_MAX
      ) {
        throw new ApplicationError(
          ErrorCodes.VALIDATION_ERROR,
          'Lesson size must be an integer between 5 and 100',
        );
      }

      updateData.lessonSize = input.lessonSize;
    }

    const existingSettings = await this.userSettingsRepository.findByUserId(
      input.userId,
    );
    if (!existingSettings) {
      await this.userSettingsRepository.createForUser(input.userId);
    }

    return this.userSettingsRepository.update({
      userId: input.userId,
      ...updateData,
    });
  }
}

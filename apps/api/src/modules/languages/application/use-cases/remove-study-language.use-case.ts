import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import {
  USER_SETTINGS_REPOSITORY,
  UserSettingsRepositoryPort,
} from '../../../account/application/ports/user-settings-repository.port';
import { UserStudyLanguageListItem } from '../../domain/types';
import {
  LANGUAGE_REPOSITORY,
  LanguageRepositoryPort,
} from '../ports/language-repository.port';
import {
  USER_STUDY_LANGUAGE_REPOSITORY,
  UserStudyLanguageRepositoryPort,
} from '../ports/user-study-language-repository.port';
import { MyStudyLanguagesUseCase } from './my-study-languages.use-case';

export type RemoveStudyLanguageUseCaseInput = {
  currentUserId: string;
  languageCode: string;
};

export type RemoveStudyLanguageUseCaseResult = UserStudyLanguageListItem[];

@Injectable()
export class RemoveStudyLanguageUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    @Inject(USER_STUDY_LANGUAGE_REPOSITORY)
    private readonly userStudyLanguageRepository: UserStudyLanguageRepositoryPort,
    private readonly myStudyLanguagesUseCase: MyStudyLanguagesUseCase,
  ) {}

  async execute(
    input: RemoveStudyLanguageUseCaseInput,
  ): Promise<RemoveStudyLanguageUseCaseResult> {
    await this.ensureActiveUser(input.currentUserId);
    await this.ensureLanguageExists(input.languageCode);

    const existing = await this.userStudyLanguageRepository.findByUserIdAndCode(
      input.currentUserId,
      input.languageCode,
    );

    if (!existing) {
      throw new ApplicationError(
        ErrorCodes.STUDY_LANGUAGE_NOT_FOUND,
        'Study language not found',
      );
    }

    const settings = await this.ensureSettings(input.currentUserId);

    await this.userStudyLanguageRepository.delete(
      input.currentUserId,
      input.languageCode,
    );

    if (settings.activeTargetLanguage === input.languageCode) {
      const remaining = await this.userStudyLanguageRepository.findByUserId(
        input.currentUserId,
      );
      const nextActive = remaining[0]?.languageCode ?? null;

      await this.userSettingsRepository.update({
        userId: input.currentUserId,
        activeTargetLanguage: nextActive,
      });
    }

    return this.myStudyLanguagesUseCase.execute({
      currentUserId: input.currentUserId,
    });
  }

  private async ensureSettings(userId: string) {
    const settings = await this.userSettingsRepository.findByUserId(userId);

    if (settings) {
      return settings;
    }

    return this.userSettingsRepository.createForUser(userId);
  }

  private async ensureActiveUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }
  }

  private async ensureLanguageExists(languageCode: string): Promise<void> {
    const language = await this.languageRepository.findByCode(languageCode);

    if (!language) {
      throw new ApplicationError(
        ErrorCodes.LANGUAGE_NOT_FOUND,
        'Language not found',
      );
    }
  }
}

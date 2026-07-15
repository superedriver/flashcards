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

export type SetActiveTargetLanguageUseCaseInput = {
  currentUserId: string;
  languageCode: string;
};

export type SetActiveTargetLanguageUseCaseResult = UserStudyLanguageListItem[];

@Injectable()
export class SetActiveTargetLanguageUseCase {
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
    input: SetActiveTargetLanguageUseCaseInput,
  ): Promise<SetActiveTargetLanguageUseCaseResult> {
    await this.ensureActiveUser(input.currentUserId);
    await this.ensureLanguageExists(input.languageCode);
    await this.ensureSettings(input.currentUserId);

    await this.userStudyLanguageRepository.upsert(
      input.currentUserId,
      input.languageCode,
    );

    await this.userSettingsRepository.update({
      userId: input.currentUserId,
      activeTargetLanguage: input.languageCode,
    });

    return this.myStudyLanguagesUseCase.execute({
      currentUserId: input.currentUserId,
    });
  }

  private async ensureSettings(userId: string): Promise<void> {
    const settings = await this.userSettingsRepository.findByUserId(userId);

    if (!settings) {
      await this.userSettingsRepository.createForUser(userId);
    }
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

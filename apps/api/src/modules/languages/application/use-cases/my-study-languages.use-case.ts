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
  USER_STUDY_LANGUAGE_REPOSITORY,
  UserStudyLanguageRepositoryPort,
} from '../ports/user-study-language-repository.port';

export type MyStudyLanguagesUseCaseInput = {
  currentUserId: string;
};

export type MyStudyLanguagesUseCaseResult = UserStudyLanguageListItem[];

@Injectable()
export class MyStudyLanguagesUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    @Inject(USER_STUDY_LANGUAGE_REPOSITORY)
    private readonly userStudyLanguageRepository: UserStudyLanguageRepositoryPort,
  ) {}

  async execute(
    input: MyStudyLanguagesUseCaseInput,
  ): Promise<MyStudyLanguagesUseCaseResult> {
    await this.ensureActiveUser(input.currentUserId);

    const [settings, studyLanguages] = await Promise.all([
      this.userSettingsRepository.findByUserId(input.currentUserId),
      this.userStudyLanguageRepository.findByUserId(input.currentUserId),
    ]);

    const activeTargetLanguage = settings?.activeTargetLanguage ?? null;

    return studyLanguages
      .map((item) => ({
        ...item,
        isActive: item.languageCode === activeTargetLanguage,
      }))
      .sort((left, right) => {
        if (left.isActive !== right.isActive) {
          return left.isActive ? -1 : 1;
        }

        return right.createdAt.getTime() - left.createdAt.getTime();
      });
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
}

import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { MyStudyLanguagesUseCase } from '../../../languages/application/use-cases/my-study-languages.use-case';
import { MyAccount } from '../../domain/types';
import {
  USER_PROFILE_REPOSITORY,
  UserProfileRepositoryPort,
} from '../ports/user-profile-repository.port';
import {
  USER_SETTINGS_REPOSITORY,
  UserSettingsRepositoryPort,
} from '../ports/user-settings-repository.port';

export type GetMyAccountInput = {
  userId: string;
};

export type GetMyAccountResult = MyAccount;

@Injectable()
export class GetMyAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepository: UserProfileRepositoryPort,
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    private readonly myStudyLanguagesUseCase: MyStudyLanguagesUseCase,
  ) {}

  async execute(input: GetMyAccountInput): Promise<GetMyAccountResult> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    let profile = await this.userProfileRepository.findByUserId(input.userId);
    if (!profile) {
      profile = await this.userProfileRepository.createForUser(input.userId);
    }

    let settings = await this.userSettingsRepository.findByUserId(input.userId);
    if (!settings) {
      settings = await this.userSettingsRepository.createForUser(input.userId);
    }

    if (user.blockedAt !== null) {
      return {
        user,
        profile,
        settings,
        studyLanguages: [],
        needsStudyLanguageOnboarding: false,
      };
    }

    const studyLanguages = await this.myStudyLanguagesUseCase.execute({
      currentUserId: input.userId,
    });

    return {
      user,
      profile,
      settings,
      studyLanguages,
      needsStudyLanguageOnboarding: studyLanguages.length === 0,
    };
  }
}

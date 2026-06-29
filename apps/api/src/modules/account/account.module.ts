import { Module } from '@nestjs/common';
import { USER_PROFILE_REPOSITORY } from './application/ports/user-profile-repository.port';
import { USER_SETTINGS_REPOSITORY } from './application/ports/user-settings-repository.port';
import { PrismaUserProfileRepository } from './infrastructure/persistence/prisma-user-profile.repository';
import { PrismaUserSettingsRepository } from './infrastructure/persistence/prisma-user-settings.repository';

@Module({
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY,
      useClass: PrismaUserProfileRepository,
    },
    {
      provide: USER_SETTINGS_REPOSITORY,
      useClass: PrismaUserSettingsRepository,
    },
  ],
  exports: [USER_PROFILE_REPOSITORY, USER_SETTINGS_REPOSITORY],
})
export class AccountModule {}

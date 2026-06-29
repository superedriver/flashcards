import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { USER_PROFILE_REPOSITORY } from './application/ports/user-profile-repository.port';
import { USER_SETTINGS_REPOSITORY } from './application/ports/user-settings-repository.port';
import { GetMyAccountUseCase } from './application/use-cases/get-my-account.use-case';
import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';
import { PrismaUserProfileRepository } from './infrastructure/persistence/prisma-user-profile.repository';
import { PrismaUserSettingsRepository } from './infrastructure/persistence/prisma-user-settings.repository';
import { AccountResolver } from './presentation/graphql/resolvers/account.resolver';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY,
      useClass: PrismaUserProfileRepository,
    },
    {
      provide: USER_SETTINGS_REPOSITORY,
      useClass: PrismaUserSettingsRepository,
    },
    GetMyAccountUseCase,
    UpdateProfileUseCase,
    AccountResolver,
  ],
  exports: [
    USER_PROFILE_REPOSITORY,
    USER_SETTINGS_REPOSITORY,
    GetMyAccountUseCase,
    UpdateProfileUseCase,
  ],
})
export class AccountModule {}

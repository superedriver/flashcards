import { Module } from '@nestjs/common';
import { USER_PROFILE_REPOSITORY } from './application/ports/user-profile-repository.port';
import { PrismaUserProfileRepository } from './infrastructure/persistence/prisma-user-profile.repository';

@Module({
  providers: [
    {
      provide: USER_PROFILE_REPOSITORY,
      useClass: PrismaUserProfileRepository,
    },
  ],
  exports: [USER_PROFILE_REPOSITORY],
})
export class AccountModule {}

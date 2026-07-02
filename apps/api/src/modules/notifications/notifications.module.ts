import { Module } from '@nestjs/common';
import { PUSH_TOKEN_REPOSITORY } from './application/ports/push-token-repository.port';
import { PrismaPushTokenRepository } from './infrastructure/persistence/prisma-push-token.repository';

@Module({
  providers: [
    {
      provide: PUSH_TOKEN_REPOSITORY,
      useClass: PrismaPushTokenRepository,
    },
  ],
  exports: [PUSH_TOKEN_REPOSITORY],
})
export class NotificationsModule {}

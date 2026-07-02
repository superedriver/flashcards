import { Module } from '@nestjs/common';
import { PUSH_NOTIFICATION_PROVIDER } from './application/ports/push-notification-provider.port';
import { PUSH_TOKEN_REPOSITORY } from './application/ports/push-token-repository.port';
import { PrismaPushTokenRepository } from './infrastructure/persistence/prisma-push-token.repository';
import { MockPushNotificationProvider } from './infrastructure/providers/mock-push-notification.provider';

@Module({
  providers: [
    {
      provide: PUSH_TOKEN_REPOSITORY,
      useClass: PrismaPushTokenRepository,
    },
    MockPushNotificationProvider,
    {
      provide: PUSH_NOTIFICATION_PROVIDER,
      useExisting: MockPushNotificationProvider,
    },
  ],
  exports: [PUSH_TOKEN_REPOSITORY, PUSH_NOTIFICATION_PROVIDER],
})
export class NotificationsModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PUSH_NOTIFICATION_PROVIDER } from './application/ports/push-notification-provider.port';
import { PUSH_TOKEN_REPOSITORY } from './application/ports/push-token-repository.port';
import { PrismaPushTokenRepository } from './infrastructure/persistence/prisma-push-token.repository';
import { ExpoPushNotificationProvider } from './infrastructure/providers/expo-push-notification.provider';
import { MockPushNotificationProvider } from './infrastructure/providers/mock-push-notification.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PUSH_TOKEN_REPOSITORY,
      useClass: PrismaPushTokenRepository,
    },
    MockPushNotificationProvider,
    ExpoPushNotificationProvider,
    {
      provide: PUSH_NOTIFICATION_PROVIDER,
      useFactory: (
        configService: ConfigService,
        mockPushNotificationProvider: MockPushNotificationProvider,
        expoPushNotificationProvider: ExpoPushNotificationProvider,
      ) => {
        const provider = configService.get<string>('push.provider', 'mock');

        if (provider === 'expo') {
          return expoPushNotificationProvider;
        }

        return mockPushNotificationProvider;
      },
      inject: [
        ConfigService,
        MockPushNotificationProvider,
        ExpoPushNotificationProvider,
      ],
    },
  ],
  exports: [PUSH_TOKEN_REPOSITORY, PUSH_NOTIFICATION_PROVIDER],
})
export class NotificationsModule {}

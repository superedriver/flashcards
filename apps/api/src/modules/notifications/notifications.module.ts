import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from '../account/account.module';
import { AuthModule } from '../auth/auth.module';
import { LessonsModule } from '../lessons/lessons.module';
import { InternalJobGuard } from '../../common/guards/internal-job.guard';
import { PUSH_NOTIFICATION_PROVIDER } from './application/ports/push-notification-provider.port';
import { PUSH_TOKEN_REPOSITORY } from './application/ports/push-token-repository.port';
import { RegisterPushTokenUseCase } from './application/use-cases/register-push-token.use-case';
import { RemovePushTokenUseCase } from './application/use-cases/remove-push-token.use-case';
import { SendDueCardRemindersUseCase } from './application/use-cases/send-due-card-reminders.use-case';
import { PrismaPushTokenRepository } from './infrastructure/persistence/prisma-push-token.repository';
import { ExpoPushNotificationProvider } from './infrastructure/providers/expo-push-notification.provider';
import { MockPushNotificationProvider } from './infrastructure/providers/mock-push-notification.provider';
import { NotificationsResolver } from './presentation/graphql/resolvers/notifications.resolver';
import { InternalNotificationsController } from './presentation/http/internal-notifications.controller';

@Module({
  imports: [ConfigModule, AuthModule, AccountModule, LessonsModule],
  controllers: [InternalNotificationsController],
  providers: [
    InternalJobGuard,
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
    RegisterPushTokenUseCase,
    RemovePushTokenUseCase,
    SendDueCardRemindersUseCase,
    NotificationsResolver,
  ],
  exports: [
    PUSH_TOKEN_REPOSITORY,
    PUSH_NOTIFICATION_PROVIDER,
    RegisterPushTokenUseCase,
    RemovePushTokenUseCase,
    SendDueCardRemindersUseCase,
  ],
})
export class NotificationsModule {}

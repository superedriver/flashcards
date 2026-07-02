import { Inject, Injectable } from '@nestjs/common';
import {
  USER_SETTINGS_REPOSITORY,
  UserSettingsRepositoryPort,
} from '../../../account/application/ports/user-settings-repository.port';
import { UserSettings } from '../../../account/domain/types';
import {
  CARD_REVIEW_STATE_REPOSITORY,
  CardReviewStateRepositoryPort,
} from '../../../lessons/application/ports/card-review-state-repository.port';
import {
  PUSH_NOTIFICATION_PROVIDER,
  PushNotificationProviderPort,
} from '../ports/push-notification-provider.port';
import {
  PUSH_TOKEN_REPOSITORY,
  PushTokenRepositoryPort,
} from '../ports/push-token-repository.port';
import { PushMessage, PushToken } from '../../domain/types';

export type SendDueCardRemindersUseCaseInput = {
  now: Date;
};

export type SendDueCardRemindersUseCaseResult = {
  checkedUsers: number;
  notifiedUsers: number;
  sentMessages: number;
  failedMessages: number;
};

const REMINDER_TITLE = 'Time to review';
const REMINDER_BODY = 'You have cards due for review.';

@Injectable()
export class SendDueCardRemindersUseCase {
  constructor(
    @Inject(USER_SETTINGS_REPOSITORY)
    private readonly userSettingsRepository: UserSettingsRepositoryPort,
    @Inject(CARD_REVIEW_STATE_REPOSITORY)
    private readonly cardReviewStateRepository: CardReviewStateRepositoryPort,
    @Inject(PUSH_TOKEN_REPOSITORY)
    private readonly pushTokenRepository: PushTokenRepositoryPort,
    @Inject(PUSH_NOTIFICATION_PROVIDER)
    private readonly pushNotificationProvider: PushNotificationProviderPort,
  ) {}

  async execute(
    input: SendDueCardRemindersUseCaseInput,
  ): Promise<SendDueCardRemindersUseCaseResult> {
    const settings =
      await this.userSettingsRepository.findWithNotificationsEnabled();
    const reminderSettings = settings.filter((setting) =>
      isReminderHour(setting, input.now),
    );

    let notifiedUsers = 0;
    let sentMessages = 0;
    let failedMessages = 0;

    const userIdsToNotify: string[] = [];

    for (const setting of reminderSettings) {
      const dueCount = await this.cardReviewStateRepository.countDueForUser({
        userId: setting.userId,
        now: input.now,
      });

      if (dueCount > 0) {
        userIdsToNotify.push(setting.userId);
      }
    }

    if (userIdsToNotify.length === 0) {
      return {
        checkedUsers: reminderSettings.length,
        notifiedUsers: 0,
        sentMessages: 0,
        failedMessages: 0,
      };
    }

    const pushTokens =
      await this.pushTokenRepository.findActiveForUsers(userIdsToNotify);

    const tokensByUserId = groupTokensByUserId(pushTokens);
    const messages: PushMessage[] = [];
    const messageOwners: PushToken[] = [];

    for (const userId of userIdsToNotify) {
      const userTokens = tokensByUserId.get(userId) ?? [];

      if (userTokens.length === 0) {
        continue;
      }

      notifiedUsers += 1;

      for (const pushToken of userTokens) {
        messages.push({
          to: pushToken.token,
          title: REMINDER_TITLE,
          body: REMINDER_BODY,
          data: {
            type: 'DUE_CARDS_REMINDER',
          },
        });
        messageOwners.push(pushToken);
      }
    }

    if (messages.length === 0) {
      return {
        checkedUsers: reminderSettings.length,
        notifiedUsers: 0,
        sentMessages: 0,
        failedMessages: 0,
      };
    }

    const sendResult = await this.pushNotificationProvider.send(messages);
    sentMessages = sendResult.successCount;
    failedMessages = sendResult.failureCount;

    if (sendResult.invalidTokens.length > 0) {
      const invalidTokenSet = new Set(sendResult.invalidTokens);

      for (const pushToken of messageOwners) {
        if (invalidTokenSet.has(pushToken.token)) {
          await this.pushTokenRepository.disable({
            userId: pushToken.userId,
            token: pushToken.token,
          });
        }
      }
    }

    const usedAt = input.now;

    for (const pushToken of messageOwners) {
      await this.pushTokenRepository.markUsed(pushToken.id, usedAt);
    }

    return {
      checkedUsers: reminderSettings.length,
      notifiedUsers,
      sentMessages,
      failedMessages,
    };
  }
}

function isReminderHour(settings: UserSettings, now: Date): boolean {
  const localHour = getLocalHour(now, settings.timezone);
  const reminderHour = parseReminderHour(settings.reminderTime);

  return localHour === reminderHour;
}

function getLocalHour(now: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const hourPart = parts.find((part) => part.type === 'hour');

  return Number(hourPart?.value ?? '0');
}

function parseReminderHour(reminderTime: string): number {
  const [hourPart] = reminderTime.split(':');

  return Number(hourPart ?? '0');
}

function groupTokensByUserId(
  pushTokens: PushToken[],
): Map<string, PushToken[]> {
  const grouped = new Map<string, PushToken[]>();

  for (const pushToken of pushTokens) {
    const existing = grouped.get(pushToken.userId) ?? [];
    existing.push(pushToken);
    grouped.set(pushToken.userId, existing);
  }

  return grouped;
}

import { Injectable, Logger } from '@nestjs/common';
import {
  PushNotificationProviderPort,
  PushSendResult,
} from '../../application/ports/push-notification-provider.port';
import { PushMessage } from '../../domain/types';

const PREVIEW_MAX_LENGTH = 100;

@Injectable()
export class MockPushNotificationProvider implements PushNotificationProviderPort {
  private readonly logger = new Logger(MockPushNotificationProvider.name);

  send(messages: PushMessage[]): Promise<PushSendResult> {
    this.logger.log(`Mock push: sending ${messages.length} message(s)`);

    for (const message of messages) {
      this.logger.log(
        `Mock push preview title="${truncatePreview(message.title)}" body="${truncatePreview(message.body)}"`,
      );
    }

    return Promise.resolve({
      successCount: messages.length,
      failureCount: 0,
      invalidTokens: [],
    });
  }
}

function truncatePreview(value: string): string {
  const trimmed = value.trim();

  if (trimmed.length <= PREVIEW_MAX_LENGTH) {
    return trimmed;
  }

  return trimmed.slice(0, PREVIEW_MAX_LENGTH);
}

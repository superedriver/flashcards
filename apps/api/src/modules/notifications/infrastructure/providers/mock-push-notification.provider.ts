import { Injectable } from '@nestjs/common';

import { logPushDeliverySummary } from '../../../../common/observability';
import {
  PushNotificationProviderPort,
  PushSendResult,
} from '../../application/ports/push-notification-provider.port';
import { PushMessage } from '../../domain/types';

@Injectable()
export class MockPushNotificationProvider implements PushNotificationProviderPort {
  send(messages: PushMessage[]): Promise<PushSendResult> {
    const result = {
      successCount: messages.length,
      failureCount: 0,
      invalidTokens: [] as string[],
    };

    logPushDeliverySummary({
      provider: 'mock',
      successCount: result.successCount,
      failureCount: result.failureCount,
      invalidTokenCount: result.invalidTokens.length,
    });

    return Promise.resolve(result);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import {
  PushNotificationProviderPort,
  PushSendResult,
} from '../../application/ports/push-notification-provider.port';
import { PushMessage } from '../../domain/types';

@Injectable()
export class ExpoPushNotificationProvider implements PushNotificationProviderPort {
  private readonly logger = new Logger(ExpoPushNotificationProvider.name);
  private readonly expo = new Expo();

  async send(messages: PushMessage[]): Promise<PushSendResult> {
    const validMessages = messages.filter((message) =>
      Expo.isExpoPushToken(message.to),
    );

    const skippedCount = messages.length - validMessages.length;
    const expoMessages: ExpoPushMessage[] = validMessages.map((message) => ({
      to: message.to,
      title: message.title,
      body: message.body,
      data: message.data,
    }));

    if (expoMessages.length === 0) {
      return {
        successCount: 0,
        failureCount: skippedCount,
        invalidTokens: messages
          .filter((message) => !Expo.isExpoPushToken(message.to))
          .map((message) => message.to),
      };
    }

    const chunks = this.expo.chunkPushNotifications(expoMessages);
    let successCount = 0;
    let failureCount = skippedCount;
    const invalidTokens: string[] = messages
      .filter((message) => !Expo.isExpoPushToken(message.to))
      .map((message) => message.to);

    for (const chunk of chunks) {
      try {
        const tickets = await this.expo.sendPushNotificationsAsync(chunk);
        const chunkResult = this.collectTicketResults(chunk, tickets);
        successCount += chunkResult.successCount;
        failureCount += chunkResult.failureCount;
        invalidTokens.push(...chunkResult.invalidTokens);
      } catch (error) {
        this.logger.error('Expo push chunk failed');
        failureCount += chunk.length;

        if (error instanceof Error) {
          this.logger.error(error.message);
        }
      }
    }

    return {
      successCount,
      failureCount,
      invalidTokens,
    };
  }

  private collectTicketResults(
    chunk: ExpoPushMessage[],
    tickets: ExpoPushTicket[],
  ): Pick<PushSendResult, 'successCount' | 'failureCount' | 'invalidTokens'> {
    let successCount = 0;
    let failureCount = 0;
    const invalidTokens: string[] = [];

    tickets.forEach((ticket, index) => {
      if (ticket.status === 'ok') {
        successCount += 1;
        return;
      }

      failureCount += 1;

      const token = this.resolveTokenFromChunk(chunk[index]);

      if (ticket.details?.error === 'DeviceNotRegistered' && token !== null) {
        invalidTokens.push(token);
      }
    });

    return { successCount, failureCount, invalidTokens };
  }

  private resolveTokenFromChunk(
    message: ExpoPushMessage | undefined,
  ): string | null {
    if (!message) {
      return null;
    }

    if (typeof message.to === 'string') {
      return message.to;
    }

    if (Array.isArray(message.to) && message.to.length > 0) {
      return message.to[0] ?? null;
    }

    return null;
  }
}

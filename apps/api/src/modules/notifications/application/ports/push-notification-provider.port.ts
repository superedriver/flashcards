import { PushMessage } from '../../domain/types';

export const PUSH_NOTIFICATION_PROVIDER = Symbol('PUSH_NOTIFICATION_PROVIDER');

export type PushSendResult = {
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
};

export type PushNotificationProviderPort = {
  send(messages: PushMessage[]): Promise<PushSendResult>;
};

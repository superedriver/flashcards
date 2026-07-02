import { PushToken } from '../../domain/types';

export const PUSH_TOKEN_REPOSITORY = Symbol('PUSH_TOKEN_REPOSITORY');

export type RegisterPushTokenInput = {
  userId: string;
  token: string;
  deviceId?: string | null;
  platform?: string | null;
};

export type PushTokenRepositoryPort = {
  register(input: RegisterPushTokenInput): Promise<PushToken>;
  findActiveByUserId(userId: string): Promise<PushToken[]>;
  findActiveForUsers(userIds: string[]): Promise<PushToken[]>;
  disable(input: { userId: string; token: string }): Promise<void>;
  markUsed(tokenId: string, usedAt: Date): Promise<void>;
};

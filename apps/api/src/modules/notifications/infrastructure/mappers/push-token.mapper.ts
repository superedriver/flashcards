import { PushProvider, PushToken } from '../../domain/types';

type PrismaPushTokenRecord = {
  id: string;
  userId: string;
  provider: string;
  token: string;
  deviceId: string | null;
  platform: string | null;
  disabledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date | null;
};

export function toPushToken(record: PrismaPushTokenRecord): PushToken {
  return {
    id: record.id,
    userId: record.userId,
    provider: record.provider as PushProvider,
    token: record.token,
    deviceId: record.deviceId,
    platform: record.platform,
    disabledAt: record.disabledAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    lastUsedAt: record.lastUsedAt,
  };
}

import { PushProvider } from './push-provider.type';

export type PushToken = {
  id: string;
  userId: string;
  provider: PushProvider;
  token: string;
  deviceId: string | null;
  platform: string | null;
  disabledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date | null;
};

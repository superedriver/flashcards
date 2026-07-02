import { toPushToken } from './push-token.mapper';

const prismaPushToken = {
  id: 'token-1',
  userId: 'user-1',
  provider: 'EXPO',
  token: 'ExponentPushToken[abc]',
  deviceId: 'device-1',
  platform: 'ios',
  disabledAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  lastUsedAt: new Date('2026-06-02T00:00:00.000Z'),
};

describe('push-token.mapper', () => {
  it('toPushToken maps all fields from Prisma record', () => {
    expect(toPushToken(prismaPushToken)).toEqual({
      id: 'token-1',
      userId: 'user-1',
      provider: 'EXPO',
      token: 'ExponentPushToken[abc]',
      deviceId: 'device-1',
      platform: 'ios',
      disabledAt: null,
      createdAt: prismaPushToken.createdAt,
      updatedAt: prismaPushToken.updatedAt,
      lastUsedAt: prismaPushToken.lastUsedAt,
    });
  });

  it('toPushToken casts provider to PushProvider enum', () => {
    expect(toPushToken(prismaPushToken).provider).toBe('EXPO');
  });
});

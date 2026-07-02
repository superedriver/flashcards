import { PushMessage } from '../../domain/types';

const mockIsExpoPushToken = jest.fn();
const mockChunkPushNotifications = jest.fn();
const mockSendPushNotificationsAsync = jest.fn();

jest.mock('expo-server-sdk', () => ({
  __esModule: true,
  default: class MockExpo {
    static isExpoPushToken = mockIsExpoPushToken;

    chunkPushNotifications = mockChunkPushNotifications;

    sendPushNotificationsAsync = mockSendPushNotificationsAsync;
  },
}));

import { ExpoPushNotificationProvider } from './expo-push-notification.provider';

describe('ExpoPushNotificationProvider', () => {
  const provider = new ExpoPushNotificationProvider();

  beforeEach(() => {
    jest.clearAllMocks();
    mockChunkPushNotifications.mockImplementation((messages: PushMessage[]) => [
      messages,
    ]);
  });

  it('treats non-Expo tokens as invalid without calling Expo send API', async () => {
    mockIsExpoPushToken.mockReturnValue(false);

    const result = await provider.send([
      {
        to: 'not-a-valid-token',
        title: 'Title',
        body: 'Body',
      },
    ]);

    expect(result).toEqual({
      successCount: 0,
      failureCount: 1,
      invalidTokens: ['not-a-valid-token'],
    });
    expect(mockSendPushNotificationsAsync).not.toHaveBeenCalled();
  });

  it('returns invalidTokens for malformed token values', async () => {
    mockIsExpoPushToken.mockImplementation(
      (token: string) => token === 'ExponentPushToken[valid]',
    );

    const result = await provider.send([
      {
        to: 'bad-token',
        title: 'Title',
        body: 'Body',
      },
      {
        to: 'ExponentPushToken[valid]',
        title: 'Title',
        body: 'Body',
      },
    ]);

    expect(result.invalidTokens).toContain('bad-token');
    expect(mockSendPushNotificationsAsync).toHaveBeenCalled();
  });

  it('maps valid Expo tokens and aggregates ticket success/failure counts', async () => {
    mockIsExpoPushToken.mockReturnValue(true);
    mockSendPushNotificationsAsync.mockResolvedValue([
      { status: 'ok', id: 'ticket-1' },
      {
        status: 'error',
        message: 'failed',
        details: { error: 'MessageTooBig' },
      },
    ]);

    const result = await provider.send([
      {
        to: 'ExponentPushToken[one]',
        title: 'Title 1',
        body: 'Body 1',
      },
      {
        to: 'ExponentPushToken[two]',
        title: 'Title 2',
        body: 'Body 2',
      },
    ]);

    expect(result.successCount).toBe(1);
    expect(result.failureCount).toBe(1);
    expect(mockChunkPushNotifications).toHaveBeenCalledWith([
      {
        to: 'ExponentPushToken[one]',
        title: 'Title 1',
        body: 'Body 1',
        data: undefined,
      },
      {
        to: 'ExponentPushToken[two]',
        title: 'Title 2',
        body: 'Body 2',
        data: undefined,
      },
    ]);
  });

  it('collects DeviceNotRegistered tokens as invalidTokens', async () => {
    mockIsExpoPushToken.mockReturnValue(true);
    mockSendPushNotificationsAsync.mockResolvedValue([
      {
        status: 'error',
        message: 'Device not registered',
        details: { error: 'DeviceNotRegistered' },
      },
    ]);

    const result = await provider.send([
      {
        to: 'ExponentPushToken[stale]',
        title: 'Title',
        body: 'Body',
      },
    ]);

    expect(result.invalidTokens).toContain('ExponentPushToken[stale]');
    expect(result.failureCount).toBe(1);
  });

  it('handles Expo chunk send errors by counting failures without throwing', async () => {
    mockIsExpoPushToken.mockReturnValue(true);
    mockSendPushNotificationsAsync.mockRejectedValue(
      new Error('network error'),
    );

    const result = await provider.send([
      {
        to: 'ExponentPushToken[one]',
        title: 'Title',
        body: 'Body',
      },
    ]);

    expect(result).toEqual({
      successCount: 0,
      failureCount: 1,
      invalidTokens: [],
    });
  });
});

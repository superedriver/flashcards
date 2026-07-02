import { MockPushNotificationProvider } from './mock-push-notification.provider';

describe('MockPushNotificationProvider', () => {
  const provider = new MockPushNotificationProvider();

  it('returns successCount equal to message count', async () => {
    const result = await provider.send([
      {
        to: 'ExponentPushToken[one]',
        title: 'Title',
        body: 'Body',
      },
      {
        to: 'ExponentPushToken[two]',
        title: 'Title 2',
        body: 'Body 2',
      },
    ]);

    expect(result.successCount).toBe(2);
  });

  it('returns zero failureCount and empty invalidTokens', async () => {
    const result = await provider.send([
      {
        to: 'ExponentPushToken[one]',
        title: 'Title',
        body: 'Body',
      },
    ]);

    expect(result.failureCount).toBe(0);
    expect(result.invalidTokens).toEqual([]);
  });

  it('handles empty message array', async () => {
    const result = await provider.send([]);

    expect(result).toEqual({
      successCount: 0,
      failureCount: 0,
      invalidTokens: [],
    });
  });
});

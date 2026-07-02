import { UserSettings } from '../../../account/domain/types';
import { PushToken } from '../../domain/types';
import { SendDueCardRemindersUseCase } from './send-due-card-reminders.use-case';

const now = new Date('2026-01-15T19:00:00.000Z');

function createUserSettings(
  overrides: Partial<UserSettings> & Pick<UserSettings, 'userId'>,
): UserSettings {
  const { userId, ...rest } = overrides;

  return {
    id: `settings-${userId}`,
    userId,
    interfaceLocale: 'en',
    themePreference: 'SYSTEM',
    notificationsEnabled: true,
    reminderTime: '14:00',
    timezone: 'America/New_York',
    audioAutoplayEnabled: false,
    lessonSize: 20,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...rest,
  };
}

function createPushToken(
  overrides: Partial<PushToken> & Pick<PushToken, 'userId'>,
): PushToken {
  const { userId, ...rest } = overrides;

  return {
    id: `token-${userId}`,
    userId,
    provider: 'EXPO',
    token: `ExponentPushToken[${userId}]`,
    deviceId: null,
    platform: 'ios',
    disabledAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    lastUsedAt: null,
    ...rest,
  };
}

function createUseCase(options?: {
  settings?: UserSettings[];
  dueCounts?: Record<string, number>;
  pushTokens?: PushToken[];
  sendResult?: {
    successCount: number;
    failureCount: number;
    invalidTokens: string[];
  };
}) {
  const findWithNotificationsEnabled = jest
    .fn()
    .mockResolvedValue(options?.settings ?? []);
  const countDueForUser = jest
    .fn()
    .mockImplementation(({ userId }: { userId: string }) =>
      Promise.resolve(options?.dueCounts?.[userId] ?? 0),
    );
  const findActiveForUsers = jest
    .fn()
    .mockResolvedValue(options?.pushTokens ?? []);
  const disable = jest.fn().mockResolvedValue(undefined);
  const markUsed = jest.fn().mockResolvedValue(undefined);
  const send = jest.fn().mockResolvedValue(
    options?.sendResult ?? {
      successCount: options?.pushTokens?.length ?? 0,
      failureCount: 0,
      invalidTokens: [],
    },
  );

  const useCase = new SendDueCardRemindersUseCase(
    {
      findByUserId: jest.fn(),
      createForUser: jest.fn(),
      update: jest.fn(),
      findWithNotificationsEnabled,
    },
    {
      findByUserAndCard: jest.fn(),
      findDueCardIdsForDeck: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser,
      findNextDueAtForDeck: jest.fn(),
      upsert: jest.fn(),
    },
    {
      register: jest.fn(),
      findActiveByUserId: jest.fn(),
      findActiveForUsers,
      disable,
      markUsed,
    },
    { send },
  );

  return {
    useCase,
    findWithNotificationsEnabled,
    countDueForUser,
    findActiveForUsers,
    disable,
    markUsed,
    send,
  };
}

describe('SendDueCardRemindersUseCase', () => {
  it('returns zero notified/sent counts when no users match reminder hour', async () => {
    const { useCase, countDueForUser } = createUseCase({
      settings: [
        createUserSettings({
          userId: 'user-1',
          reminderTime: '09:00',
          timezone: 'America/New_York',
        }),
      ],
    });

    const result = await useCase.execute({ now });

    expect(result).toEqual({
      checkedUsers: 0,
      notifiedUsers: 0,
      sentMessages: 0,
      failedMessages: 0,
    });
    expect(countDueForUser).not.toHaveBeenCalled();
  });

  it('includes users whose local hour matches reminderTime/timezone', async () => {
    const { useCase, countDueForUser } = createUseCase({
      settings: [
        createUserSettings({
          userId: 'user-1',
          reminderTime: '14:00',
          timezone: 'America/New_York',
        }),
        createUserSettings({
          userId: 'user-2',
          reminderTime: '09:00',
          timezone: 'America/New_York',
        }),
      ],
      dueCounts: { 'user-1': 0 },
    });

    const result = await useCase.execute({ now });

    expect(result.checkedUsers).toBe(1);
    expect(countDueForUser).toHaveBeenCalledWith({
      userId: 'user-1',
      now,
    });
    expect(countDueForUser).toHaveBeenCalledTimes(1);
  });

  it('skips users with zero due cards', async () => {
    const { useCase, findActiveForUsers, send } = createUseCase({
      settings: [createUserSettings({ userId: 'user-1' })],
      dueCounts: { 'user-1': 0 },
    });

    const result = await useCase.execute({ now });

    expect(result).toEqual({
      checkedUsers: 1,
      notifiedUsers: 0,
      sentMessages: 0,
      failedMessages: 0,
    });
    expect(findActiveForUsers).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('notifies users with due cards and active push tokens', async () => {
    const pushToken = createPushToken({ userId: 'user-1' });
    const { useCase, send, markUsed } = createUseCase({
      settings: [createUserSettings({ userId: 'user-1' })],
      dueCounts: { 'user-1': 3 },
      pushTokens: [pushToken],
      sendResult: { successCount: 1, failureCount: 0, invalidTokens: [] },
    });

    const result = await useCase.execute({ now });

    expect(result).toEqual({
      checkedUsers: 1,
      notifiedUsers: 1,
      sentMessages: 1,
      failedMessages: 0,
    });
    expect(send).toHaveBeenCalledWith([
      {
        to: pushToken.token,
        title: 'Time to review',
        body: 'You have cards due for review.',
        data: { type: 'DUE_CARDS_REMINDER' },
      },
    ]);
    expect(markUsed).toHaveBeenCalledWith(pushToken.id, now);
  });

  it('skips users with due cards but no active push tokens', async () => {
    const { useCase, send } = createUseCase({
      settings: [createUserSettings({ userId: 'user-1' })],
      dueCounts: { 'user-1': 2 },
      pushTokens: [],
    });

    const result = await useCase.execute({ now });

    expect(result).toEqual({
      checkedUsers: 1,
      notifiedUsers: 0,
      sentMessages: 0,
      failedMessages: 0,
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('does not include auth tokens or secrets in push message data', async () => {
    const pushToken = createPushToken({ userId: 'user-1' });
    const { useCase, send } = createUseCase({
      settings: [createUserSettings({ userId: 'user-1' })],
      dueCounts: { 'user-1': 1 },
      pushTokens: [pushToken],
    });

    await useCase.execute({ now });

    const [messages] = send.mock.calls[0] as [
      Array<{ data: Record<string, string> }>,
    ];
    expect(messages[0]!.data).toEqual({ type: 'DUE_CARDS_REMINDER' });
    expect(JSON.stringify(messages)).not.toMatch(
      /secret|authorization|bearer/i,
    );
  });

  it('disables invalid tokens returned by provider', async () => {
    const pushToken = createPushToken({
      userId: 'user-1',
      token: 'ExponentPushToken[invalid]',
    });
    const { useCase, disable } = createUseCase({
      settings: [createUserSettings({ userId: 'user-1' })],
      dueCounts: { 'user-1': 1 },
      pushTokens: [pushToken],
      sendResult: {
        successCount: 0,
        failureCount: 1,
        invalidTokens: ['ExponentPushToken[invalid]'],
      },
    });

    await useCase.execute({ now });

    expect(disable).toHaveBeenCalledWith({
      userId: 'user-1',
      token: 'ExponentPushToken[invalid]',
    });
  });

  it('handles provider failures without throwing', async () => {
    const pushToken = createPushToken({ userId: 'user-1' });
    const { useCase } = createUseCase({
      settings: [createUserSettings({ userId: 'user-1' })],
      dueCounts: { 'user-1': 1 },
      pushTokens: [pushToken],
      sendResult: {
        successCount: 0,
        failureCount: 1,
        invalidTokens: [],
      },
    });

    await expect(useCase.execute({ now })).resolves.toEqual({
      checkedUsers: 1,
      notifiedUsers: 1,
      sentMessages: 0,
      failedMessages: 1,
    });
  });
});

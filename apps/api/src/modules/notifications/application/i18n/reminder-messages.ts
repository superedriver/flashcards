export type ReminderLocale = 'en' | 'uk';

export type ReminderMessage = {
  title: string;
  body: string;
};

const REMINDER_MESSAGES: Record<ReminderLocale, ReminderMessage> = {
  en: {
    title: 'Time to review',
    body: 'You have cards due for review.',
  },
  uk: {
    title: 'Час повторити',
    body: 'У вас є картки, які потрібно повторити.',
  },
};

export function resolveReminderLocale(
  interfaceLocale: string | null | undefined,
): ReminderLocale {
  return interfaceLocale === 'uk' ? 'uk' : 'en';
}

export function getReminderMessage(
  interfaceLocale: string | null | undefined,
): ReminderMessage {
  return REMINDER_MESSAGES[resolveReminderLocale(interfaceLocale)];
}

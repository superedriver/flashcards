import { getReminderMessage, resolveReminderLocale } from './reminder-messages';

describe('reminder-messages', () => {
  it('resolveReminderLocale returns uk only for uk', () => {
    expect(resolveReminderLocale('uk')).toBe('uk');
    expect(resolveReminderLocale('en')).toBe('en');
    expect(resolveReminderLocale('de')).toBe('en');
    expect(resolveReminderLocale(null)).toBe('en');
  });

  it('getReminderMessage returns English copy by default', () => {
    expect(getReminderMessage('en')).toEqual({
      title: 'Time to review',
      body: 'You have cards due for review.',
    });
  });

  it('getReminderMessage returns Ukrainian copy for uk locale', () => {
    expect(getReminderMessage('uk')).toEqual({
      title: 'Час повторити',
      body: 'У вас є картки, які потрібно повторити.',
    });
  });
});

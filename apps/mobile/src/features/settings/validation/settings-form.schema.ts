import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createSettingsFormSchema(t: TFunction) {
  return z.object({
    interfaceLocale: z.enum(['en', 'uk'], {
      errorMap: () => ({ message: t('settings.validation.interfaceLocale') }),
    }),
    lessonSize: z.coerce
      .number({
        invalid_type_error: t('settings.validation.lessonSizeNumber'),
      })
      .int(t('settings.validation.lessonSizeWhole'))
      .min(5, t('settings.validation.lessonSizeMin'))
      .max(100, t('settings.validation.lessonSizeMax')),
    notificationsEnabled: z.boolean(),
    reminderTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, t('settings.validation.reminderTimeFormat'))
      .nullable()
      .optional(),
    timezone: z
      .string()
      .trim()
      .min(1, t('settings.validation.timezoneRequired'))
      .max(100, t('settings.validation.timezoneTooLong')),
  })
}

export type SettingsFormValues = z.infer<ReturnType<typeof createSettingsFormSchema>>

export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

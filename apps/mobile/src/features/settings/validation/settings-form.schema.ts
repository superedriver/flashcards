import { z } from 'zod'

export const settingsFormSchema = z.object({
  interfaceLocale: z.enum(['en', 'uk'], {
    errorMap: () => ({ message: 'Select a supported interface language.' }),
  }),
  lessonSize: z.coerce
    .number({
      invalid_type_error: 'Lesson size must be a number.',
    })
    .int('Lesson size must be a whole number.')
    .min(5, 'Lesson size must be at least 5 cards.')
    .max(100, 'Lesson size must be at most 100 cards.'),
  notificationsEnabled: z.boolean(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour time in HH:mm format (e.g. 09:00).')
    .nullable()
    .optional(),
  timezone: z.string().trim().min(1, 'Timezone is required.').max(100, 'Timezone is too long.'),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

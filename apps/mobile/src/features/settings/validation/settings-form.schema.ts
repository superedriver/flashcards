import { z } from 'zod'

export const settingsFormSchema = z.object({
  lessonSize: z.coerce.number().int().min(5).max(100),
  notificationsEnabled: z.boolean(),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),
  timezone: z.string().trim().min(1).max(100),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>

export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

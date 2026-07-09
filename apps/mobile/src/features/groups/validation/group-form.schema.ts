import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createGroupFormSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t('groups.validation.nameRequired'))
      .max(120, t('groups.validation.nameTooLong')),
    description: z.string().trim().max(1000, t('groups.validation.descriptionTooLong')).optional(),
  })
}

export type GroupFormValues = z.infer<ReturnType<typeof createGroupFormSchema>>

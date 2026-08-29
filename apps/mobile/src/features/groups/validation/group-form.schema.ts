import type { TFunction } from 'i18next'
import { z } from 'zod'

export const GROUP_NAME_MAX_LENGTH = 60
export const GROUP_DESCRIPTION_MAX_LENGTH = 300

export function createGroupFormSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t('groups.validation.nameRequired'))
      .max(GROUP_NAME_MAX_LENGTH, t('groups.validation.nameTooLong')),
    description: z
      .string()
      .trim()
      .max(GROUP_DESCRIPTION_MAX_LENGTH, t('groups.validation.descriptionTooLong'))
      .optional(),
  })
}

export type GroupFormValues = z.infer<ReturnType<typeof createGroupFormSchema>>

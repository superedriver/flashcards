import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createInviteUserSchema(t: TFunction) {
  return z.object({
    email: z.string().trim().email(t('groups.validation.emailInvalid')),
  })
}

export type InviteUserValues = z.infer<ReturnType<typeof createInviteUserSchema>>

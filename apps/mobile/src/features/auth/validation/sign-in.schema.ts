import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createSignInSchema(t: TFunction) {
  return z.object({
    email: z
      .string()
      .min(1, t('auth.validation.emailRequired'))
      .email(t('auth.validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('auth.validation.passwordRequired'))
      .min(8, t('auth.validation.passwordMin'))
      .max(128, t('auth.validation.passwordMax')),
  })
}

export type SignInFormValues = z.infer<ReturnType<typeof createSignInSchema>>

import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createResetPasswordSchema(t: TFunction) {
  return z
    .object({
      confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
      newPassword: z
        .string()
        .min(1, t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordMin'))
        .max(128, t('auth.validation.passwordMax')),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: t('auth.validation.passwordsMustMatch'),
      path: ['confirmPassword'],
    })
}

export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>

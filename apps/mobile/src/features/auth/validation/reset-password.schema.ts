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
        .max(128, t('auth.validation.passwordMax'))
        .regex(/[A-Z]/, t('auth.validation.passwordUppercase'))
        .regex(/[a-z]/, t('auth.validation.passwordLowercase'))
        .regex(/[0-9]/, t('auth.validation.passwordDigit')),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: t('auth.validation.passwordsMustMatch'),
      path: ['confirmPassword'],
    })
}

export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordSchema>>

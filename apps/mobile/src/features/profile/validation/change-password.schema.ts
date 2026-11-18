import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createChangePasswordSchema(t: TFunction) {
  return z
    .object({
      confirmNewPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
      currentPassword: z.string().min(1, t('auth.validation.passwordRequired')),
      newPassword: z
        .string()
        .min(1, t('auth.validation.passwordRequired'))
        .min(8, t('auth.validation.passwordMin'))
        .max(128, t('auth.validation.passwordMax'))
        .regex(/[A-Z]/, t('auth.validation.passwordUppercase'))
        .regex(/[a-z]/, t('auth.validation.passwordLowercase'))
        .regex(/[0-9]/, t('auth.validation.passwordDigit')),
    })
    .refine((values) => values.newPassword === values.confirmNewPassword, {
      message: t('auth.validation.passwordsMustMatch'),
      path: ['confirmNewPassword'],
    })
}

export type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>

import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createSignUpSchema(t: TFunction) {
  return z
    .object({
      confirmPassword: z.string().min(1, t('auth.validation.confirmPasswordRequired')),
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
    .refine((values) => values.password === values.confirmPassword, {
      message: t('auth.validation.passwordsMustMatch'),
      path: ['confirmPassword'],
    })
}

export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>

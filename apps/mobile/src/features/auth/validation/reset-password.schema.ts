import { z } from 'zod'

export const resetPasswordSchema = z
  .object({
    confirmPassword: z.string().min(1, 'Confirm your password'),
    newPassword: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

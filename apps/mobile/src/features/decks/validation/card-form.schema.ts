import { z } from 'zod'

export const cardFormSchema = z.object({
  front: z.string().trim().min(1, 'Front is required').max(2000, 'Front is too long'),
  back: z.string().trim().min(1, 'Back is required').max(4000, 'Back is too long'),
  example: z.string().trim().max(4000, 'Example is too long').optional().or(z.literal('')),
  notes: z.string().trim().max(4000, 'Notes are too long').optional().or(z.literal('')),
})

export type CardFormValues = z.infer<typeof cardFormSchema>

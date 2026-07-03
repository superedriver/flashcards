import { z } from 'zod'

export const deckFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
  description: z.string().trim().max(1000, 'Description is too long').optional().or(z.literal('')),
})

export type DeckFormValues = z.infer<typeof deckFormSchema>

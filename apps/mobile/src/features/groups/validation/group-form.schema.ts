import { z } from 'zod'

export const groupFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120, 'Name is too long.'),
  description: z.string().trim().max(1000, 'Description is too long.').optional(),
})

export type GroupFormValues = z.infer<typeof groupFormSchema>

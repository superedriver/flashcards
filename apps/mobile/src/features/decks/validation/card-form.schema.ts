import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createCardFormSchema(t: TFunction) {
  return z.object({
    front: z
      .string()
      .trim()
      .min(1, t('decks.validation.frontRequired'))
      .max(2000, t('decks.validation.frontTooLong')),
    back: z
      .string()
      .trim()
      .min(1, t('decks.validation.backRequired'))
      .max(4000, t('decks.validation.backTooLong')),
    example: z
      .string()
      .trim()
      .max(4000, t('decks.validation.exampleTooLong'))
      .optional()
      .or(z.literal('')),
    notes: z
      .string()
      .trim()
      .max(4000, t('decks.validation.notesTooLong'))
      .optional()
      .or(z.literal('')),
  })
}

export type CardFormValues = z.infer<ReturnType<typeof createCardFormSchema>>

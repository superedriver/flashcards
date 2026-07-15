import type { TFunction } from 'i18next'
import { z } from 'zod'

export function createDeckFormSchema(t: TFunction) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t('decks.validation.titleRequired'))
      .max(120, t('decks.validation.titleTooLong')),
    description: z
      .string()
      .trim()
      .max(1000, t('decks.validation.descriptionTooLong'))
      .optional()
      .or(z.literal('')),
    targetLanguage: z.string().trim().min(1, t('decks.validation.targetLanguageRequired')),
    sourceLanguage: z.string().trim().min(1, t('decks.validation.sourceLanguageRequired')),
  })
}

export type DeckFormValues = z.infer<ReturnType<typeof createDeckFormSchema>>

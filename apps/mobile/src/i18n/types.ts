import type { en } from './resources/en'

export const SUPPORTED_LOCALES = ['en', 'uk'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'en'

export type TranslationResources = typeof en

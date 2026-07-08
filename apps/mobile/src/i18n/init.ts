import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from './resources/en'
import { uk } from './resources/uk'
import { DEFAULT_LOCALE, type AppLocale, SUPPORTED_LOCALES } from './types'

function isAppLocale(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function resolveDeviceLocale(): AppLocale {
  const languageCode = getLocales()[0]?.languageCode?.toLowerCase()

  if (languageCode === 'uk') {
    return 'uk'
  }

  return DEFAULT_LOCALE
}

export function normalizeAppLocale(value: string | null | undefined): AppLocale {
  if (value && isAppLocale(value)) {
    return value
  }

  return DEFAULT_LOCALE
}

export function getCurrentLocale(): AppLocale {
  return normalizeAppLocale(i18n.resolvedLanguage ?? i18n.language)
}

export async function setAppLocale(locale: AppLocale): Promise<void> {
  await i18n.changeLanguage(locale)
}

const initialLocale = resolveDeviceLocale()

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
  },
  lng: initialLocale,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: [...SUPPORTED_LOCALES],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n

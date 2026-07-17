import { DEFAULT_LOCALE, type AppLocale } from './types'
import { normalizeAppLocale, setAppLocale } from './init'
import { persistLocale } from './locale-storage'

/** Logged-out / guest UI is always English. */
export async function applyGuestLocale(): Promise<AppLocale> {
  await setAppLocale(DEFAULT_LOCALE)
  await persistLocale(DEFAULT_LOCALE)
  return DEFAULT_LOCALE
}

export async function bootstrapLocale(): Promise<AppLocale> {
  return applyGuestLocale()
}

export async function applyLocaleFromBackend(
  interfaceLocale: string | null | undefined,
): Promise<AppLocale> {
  const locale = normalizeAppLocale(interfaceLocale)

  await setAppLocale(locale)
  await persistLocale(locale)

  return locale
}

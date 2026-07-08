import { normalizeAppLocale, resolveDeviceLocale, setAppLocale } from './init'
import { getPersistedLocale, persistLocale } from './locale-storage'
import { type AppLocale } from './types'

export async function bootstrapLocale(): Promise<AppLocale> {
  const persistedLocale = await getPersistedLocale()
  const locale = persistedLocale ?? resolveDeviceLocale()

  await setAppLocale(locale)

  if (!persistedLocale) {
    await persistLocale(locale)
  }

  return locale
}

export async function applyLocaleFromBackend(
  interfaceLocale: string | null | undefined,
): Promise<AppLocale> {
  const locale = normalizeAppLocale(interfaceLocale)

  await setAppLocale(locale)
  await persistLocale(locale)

  return locale
}

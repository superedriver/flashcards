import { type AppLocale } from './types'
import { resolveDeviceLocale, setAppLocale } from './init'
import { getPersistedLocale, persistLocale } from './locale-storage'

export async function applyGuestLocale(): Promise<AppLocale> {
  const persisted = await getPersistedLocale()
  const locale = persisted ?? resolveDeviceLocale()
  await setAppLocale(locale)
  await persistLocale(locale)
  return locale
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

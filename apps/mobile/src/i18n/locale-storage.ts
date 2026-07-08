import AsyncStorage from '@react-native-async-storage/async-storage'

import { normalizeAppLocale } from './init'
import { type AppLocale } from './types'

const LOCALE_STORAGE_KEY = 'flashcards.interfaceLocale'

export async function getPersistedLocale(): Promise<AppLocale | null> {
  const value = await AsyncStorage.getItem(LOCALE_STORAGE_KEY)

  if (!value) {
    return null
  }

  return normalizeAppLocale(value)
}

export async function persistLocale(locale: AppLocale): Promise<void> {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export async function clearPersistedLocale(): Promise<void> {
  await AsyncStorage.removeItem(LOCALE_STORAGE_KEY)
}

import AsyncStorage from '@react-native-async-storage/async-storage'

const ACTIVE_TARGET_LANGUAGE_STORAGE_KEY = 'flashcards.activeTargetLanguage'

export async function getPersistedActiveTargetLanguage(): Promise<string | null> {
  const value = await AsyncStorage.getItem(ACTIVE_TARGET_LANGUAGE_STORAGE_KEY)

  if (!value) {
    return null
  }

  const trimmed = value.trim()

  return trimmed.length > 0 ? trimmed : null
}

export async function persistActiveTargetLanguage(languageCode: string): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_TARGET_LANGUAGE_STORAGE_KEY, languageCode)
}

export async function clearPersistedActiveTargetLanguage(): Promise<void> {
  await AsyncStorage.removeItem(ACTIVE_TARGET_LANGUAGE_STORAGE_KEY)
}

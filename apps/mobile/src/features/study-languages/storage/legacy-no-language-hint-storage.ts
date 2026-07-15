import AsyncStorage from '@react-native-async-storage/async-storage'

const LEGACY_DECKS_HINT_KEY = 'flashcards.legacyNoLanguageDecksHintShown'

export async function hasShownLegacyNoLanguageHint(): Promise<boolean> {
  const value = await AsyncStorage.getItem(LEGACY_DECKS_HINT_KEY)

  return value === '1'
}

export async function markLegacyNoLanguageHintShown(): Promise<void> {
  await AsyncStorage.setItem(LEGACY_DECKS_HINT_KEY, '1')
}

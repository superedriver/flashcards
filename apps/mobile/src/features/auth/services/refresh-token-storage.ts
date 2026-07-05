import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

import { REFRESH_TOKEN_KEY } from './access-token-memory'

export async function getRefreshToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null
  }

  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
}

export async function setRefreshToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    return
  }

  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token)
}

export async function clearRefreshToken(): Promise<void> {
  if (Platform.OS === 'web') {
    return
  }

  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}

export function usesWebRefreshTokenCookie(): boolean {
  return Platform.OS === 'web'
}

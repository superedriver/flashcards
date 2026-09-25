import * as AppleAuthentication from 'expo-apple-authentication'
import { Platform } from 'react-native'

export type AppleAuthResult = {
  identityToken: string
}

export async function signInWithApple(): Promise<AppleAuthResult> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple Sign In is only available on iOS')
  }

  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  })

  if (!credential.identityToken) {
    throw new Error('Apple Sign In did not return an identity token')
  }

  return { identityToken: credential.identityToken }
}

export async function isAppleAuthAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false
  }

  return AppleAuthentication.isAvailableAsync()
}

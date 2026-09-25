import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'
import { env } from '@/config/env'

WebBrowser.maybeCompleteAuthSession()

export type GoogleAuthResult = {
  idToken: string
}

export type GoogleAuthService = {
  signIn(): Promise<GoogleAuthResult>
}

// Expo Go / web use the web client ID; native builds use the iOS/Android client ID.
// For simplicity we use a single client ID for all platforms from env.
// The API verifies the token with the same client ID.
export function useGoogleAuth(): {
  signIn: () => Promise<GoogleAuthResult>
  isConfigured: boolean
} {
  const clientId = env.googleClientId || 'unconfigured'
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId,
    // On web the redirect URI is handled automatically by expo-auth-session
    ...(Platform.OS !== 'web' && {
      redirectUri: `flashcards://`,
    }),
  })

  const isConfigured = Boolean(env.googleClientId)

  const signIn = async (): Promise<GoogleAuthResult> => {
    if (!isConfigured) {
      throw new Error('Google Sign In is not configured')
    }

    const result = await promptAsync()

    if (result.type === 'success' && result.params.id_token) {
      return { idToken: result.params.id_token }
    }

    if (result.type === 'cancel' || result.type === 'dismiss') {
      throw new Error('Google Sign In was cancelled')
    }

    throw new Error('Google Sign In failed')
  }

  // Keep reference to response for side-effects (handled by WebBrowser.maybeCompleteAuthSession)
  void response

  return { signIn, isConfigured }
}

// Legacy placeholder kept for non-hook call sites
export const googleAuthService: GoogleAuthService = {
  async signIn() {
    throw new Error('Use useGoogleAuth() hook instead of googleAuthService directly')
  },
}

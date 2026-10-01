import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'
import {
  GoogleOneTapSignIn,
  isCancelledResponse,
  isSuccessResponse,
} from 'react-native-nitro-google-signin'
import { env } from '@/config/env'

WebBrowser.maybeCompleteAuthSession()

export type GoogleAuthResult = {
  idToken: string
}

export type GoogleAuthService = {
  signIn(): Promise<GoogleAuthResult>
}

function useGoogleAuthNative(): {
  signIn: () => Promise<GoogleAuthResult>
  isConfigured: boolean
} {
  const isConfigured = Boolean(env.googleClientId)

  const signIn = async (): Promise<GoogleAuthResult> => {
    if (!isConfigured) {
      throw new Error('Google Sign In is not configured')
    }

    GoogleOneTapSignIn.configure({ webClientId: env.googleClientId })

    const response = await GoogleOneTapSignIn.presentExplicitSignIn()

    if (isCancelledResponse(response)) {
      throw new Error('Google Sign In was cancelled')
    }

    if (isSuccessResponse(response) && response.data?.idToken) {
      return { idToken: response.data.idToken }
    }

    throw new Error('Google Sign In failed')
  }

  return { signIn, isConfigured }
}

function useGoogleAuthWeb(): {
  signIn: () => Promise<GoogleAuthResult>
  isConfigured: boolean
} {
  const clientId = env.googleClientId || 'unconfigured'
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({ clientId })

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

  void response

  return { signIn, isConfigured }
}

export function useGoogleAuth(): {
  signIn: () => Promise<GoogleAuthResult>
  isConfigured: boolean
} {
  // Rules of Hooks: both hooks are always called unconditionally.
  // Only the result from the correct platform is used.
  const native = useGoogleAuthNative()
  const web = useGoogleAuthWeb()

  return Platform.OS === 'web' ? web : native
}

// Legacy placeholder kept for non-hook call sites
export const googleAuthService: GoogleAuthService = {
  async signIn() {
    throw new Error('Use useGoogleAuth() hook instead of googleAuthService directly')
  },
}

import { resolveApiUrl } from './validate-api-url'

export const env = {
  apiUrl: resolveApiUrl(process.env.EXPO_PUBLIC_API_URL, __DEV__),
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? '',
} as const

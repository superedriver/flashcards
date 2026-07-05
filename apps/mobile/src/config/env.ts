import { validateApiUrl } from './validate-api-url'

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/graphql'

validateApiUrl(apiUrl)

export const env = {
  apiUrl,
} as const

const LOCAL_DEV_FALLBACK = 'http://localhost:3000/graphql'

export function resolveApiUrl(rawUrl: string | undefined, isDev: boolean): string {
  const apiUrl = rawUrl?.trim()

  if (isDev) {
    return apiUrl || LOCAL_DEV_FALLBACK
  }

  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is required in production builds and must use https://.')
  }

  validateApiUrl(apiUrl)
  return apiUrl
}

export function validateApiUrl(apiUrl: string): void {
  if (apiUrl.startsWith('https://')) {
    return
  }

  throw new Error(
    'EXPO_PUBLIC_API_URL must use https:// in production builds. Update the API URL to a secure endpoint.',
  )
}

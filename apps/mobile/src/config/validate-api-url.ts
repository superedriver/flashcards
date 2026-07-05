function isLocalHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')
    )
  } catch {
    return false
  }
}

export function validateApiUrl(apiUrl: string): void {
  if (__DEV__) {
    return
  }

  if (apiUrl.startsWith('https://') || isLocalHttpUrl(apiUrl)) {
    return
  }

  if (apiUrl.startsWith('http://')) {
    throw new Error(
      'EXPO_PUBLIC_API_URL must use https:// in production builds. Update the API URL to a secure endpoint.',
    )
  }
}

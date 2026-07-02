const REFRESH_TOKEN_KEY = 'flashcards.refreshToken'

let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string): void {
  accessToken = token
}

export function clearAccessToken(): void {
  accessToken = null
}

export { REFRESH_TOKEN_KEY }

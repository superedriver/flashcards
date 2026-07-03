let currentPushToken: string | null = null

export function getCurrentPushToken(): string | null {
  return currentPushToken
}

export function setCurrentPushToken(token: string): void {
  currentPushToken = token
}

export function clearCurrentPushToken(): void {
  currentPushToken = null
}

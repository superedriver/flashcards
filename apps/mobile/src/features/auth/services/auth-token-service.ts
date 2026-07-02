import { clearAccessToken, getAccessToken, setAccessToken } from './access-token-memory'
import { clearRefreshToken, getRefreshToken, setRefreshToken } from './refresh-token-storage'

export const authTokenService = {
  async clearTokens(): Promise<void> {
    clearAccessToken()
    await clearRefreshToken()
  },

  getAccessToken(): string | null {
    return getAccessToken()
  },

  getRefreshToken(): Promise<string | null> {
    return getRefreshToken()
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    setAccessToken(accessToken)
    await setRefreshToken(refreshToken)
  },
}

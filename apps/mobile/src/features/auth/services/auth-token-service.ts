import { clearAccessToken, getAccessToken, setAccessToken } from './access-token-memory'
import {
  clearRefreshToken,
  getRefreshToken,
  setRefreshToken,
  usesWebRefreshTokenCookie,
} from './refresh-token-storage'

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

  async setTokens(accessToken: string, refreshToken?: string | null): Promise<void> {
    setAccessToken(accessToken)

    if (!usesWebRefreshTokenCookie() && refreshToken) {
      await setRefreshToken(refreshToken)
    }
  },

  usesWebRefreshTokenCookie,
}

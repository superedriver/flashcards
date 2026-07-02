import { print } from 'graphql'

import { env } from '@/config/env'
import { RefreshTokenDocument } from '@/graphql/generated'

import { mapSafeUserToAuthUser, useAuthStore } from '../state/auth-store'
import { authTokenService } from './auth-token-service'

type RefreshTokenResponse = {
  data?: {
    refreshToken?: {
      accessToken: string
      refreshToken: string
      user: Parameters<typeof mapSafeUserToAuthUser>[0]
    }
  }
  errors?: Array<{ message: string }>
}

export async function clearAuthSession(): Promise<void> {
  await authTokenService.clearTokens()
  useAuthStore.getState().clearAuth()
}

export async function performRefreshToken(): Promise<boolean> {
  const refreshToken = await authTokenService.getRefreshToken()
  if (!refreshToken) {
    return false
  }

  try {
    const response = await fetch(env.apiUrl, {
      body: JSON.stringify({
        query: print(RefreshTokenDocument),
        variables: {
          input: { refreshToken },
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const result = (await response.json()) as RefreshTokenResponse

    if (!response.ok || result.errors?.length || !result.data?.refreshToken) {
      return false
    }

    const payload = result.data.refreshToken
    await authTokenService.setTokens(payload.accessToken, payload.refreshToken)
    useAuthStore.getState().setAuthResult(mapSafeUserToAuthUser(payload.user))

    return true
  } catch {
    return false
  }
}

export async function applyAuthPayload(payload: {
  accessToken: string
  refreshToken: string
  user: Parameters<typeof mapSafeUserToAuthUser>[0]
}): Promise<void> {
  await authTokenService.setTokens(payload.accessToken, payload.refreshToken)
  useAuthStore.getState().setAuthResult(mapSafeUserToAuthUser(payload.user))
}

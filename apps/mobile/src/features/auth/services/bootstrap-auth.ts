import { performRefreshToken } from '@/features/auth/services/auth-session'
import { authTokenService } from '@/features/auth/services/auth-token-service'
import { useAuthStore } from '@/features/auth/state/auth-store'

export async function bootstrapAuth(): Promise<void> {
  const store = useAuthStore.getState()
  store.setBootstrapping(true)

  try {
    const refreshToken = await authTokenService.getRefreshToken()

    if (!refreshToken) {
      return
    }

    const success = await performRefreshToken()

    if (!success) {
      await authTokenService.clearTokens()
      store.clearAuth()
    }
  } finally {
    useAuthStore.getState().setBootstrapping(false)
  }
}

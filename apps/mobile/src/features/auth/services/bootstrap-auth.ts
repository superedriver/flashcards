import { Platform } from 'react-native'

import { performRefreshToken } from '@/features/auth/services/auth-session'
import { authTokenService } from '@/features/auth/services/auth-token-service'
import { useAuthStore } from '@/features/auth/state/auth-store'
import { applyGuestLocale } from '@/i18n/bootstrap-locale'
import { syncLocaleFromBackend } from '@/i18n/sync-locale-from-backend'

export async function bootstrapAuth(): Promise<void> {
  const store = useAuthStore.getState()
  store.setBootstrapping(true)

  try {
    const refreshToken = await authTokenService.getRefreshToken()

    if (!refreshToken && Platform.OS !== 'web') {
      await applyGuestLocale()
      return
    }

    const success = await performRefreshToken()

    if (!success) {
      await authTokenService.clearTokens()
      store.clearAuth()
      await applyGuestLocale()
      return
    }

    await syncLocaleFromBackend()
  } finally {
    useAuthStore.getState().setBootstrapping(false)
  }
}

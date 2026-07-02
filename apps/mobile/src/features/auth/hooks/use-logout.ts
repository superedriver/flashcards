import { useRouter } from 'expo-router'
import { useCallback } from 'react'

import { clearAuthSession } from '@/features/auth/services/auth-session'
import { authTokenService } from '@/features/auth/services/auth-token-service'
import { apolloClient } from '@/graphql/apollo-client'
import { useLogoutMutation } from '@/graphql/generated'

export function useLogout() {
  const router = useRouter()
  const [logoutMutation] = useLogoutMutation()

  return useCallback(async () => {
    const refreshToken = await authTokenService.getRefreshToken()

    if (refreshToken) {
      try {
        await logoutMutation({
          variables: {
            input: { refreshToken },
          },
        })
      } catch {
        // Local logout must still proceed if backend logout fails.
      }
    }

    await clearAuthSession()
    await apolloClient.clearStore()
    router.replace('/(auth)/sign-in')
  }, [logoutMutation, router])
}

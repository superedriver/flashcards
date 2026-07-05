import { clearAuthSession } from '@/features/auth/services/auth-session'
import { useAuthStore } from '@/features/auth/state/auth-store'

export async function handleSessionExpired(): Promise<void> {
  await clearAuthSession()
  useAuthStore.getState().setError('Your session has expired. Please sign in again.')

  const { apolloClient } = await import('@/graphql/apollo-client')
  await apolloClient.clearStore()

  const { router } = await import('expo-router')
  router.replace('/(auth)/sign-in')
}

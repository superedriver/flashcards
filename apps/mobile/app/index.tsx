import { Redirect } from 'expo-router'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { LoadingState, Screen } from '@/ui/components'

export default function IndexScreen() {
  const { isAuthenticated, isBootstrapping, user } = useAuth()

  if (isBootstrapping) {
    return (
      <Screen>
        <LoadingState message="Loading session..." />
      </Screen>
    )
  }

  if (isAuthenticated && user) {
    return <Redirect href={getPostAuthRedirectHref(user)} />
  }

  return <Redirect href="/(auth)/sign-in" />
}

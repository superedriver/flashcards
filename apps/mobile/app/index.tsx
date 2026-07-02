import { Redirect } from 'expo-router'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { LoadingState, Screen } from '@/ui/components'

export default function IndexScreen() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <Screen>
        <LoadingState message="Loading session..." />
      </Screen>
    )
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />
  }

  return <Redirect href="/(auth)/sign-in" />
}

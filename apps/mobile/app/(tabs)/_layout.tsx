import { Redirect, Tabs } from 'expo-router'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { LoadingState, Screen } from '@/ui/components'

export default function TabsLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <Screen>
        <LoadingState message="Loading session..." />
      </Screen>
    )
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />
  }

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="decks" options={{ title: 'Decks' }} />
      <Tabs.Screen name="public" options={{ title: 'Public' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}

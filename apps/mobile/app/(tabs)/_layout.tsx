import { Redirect, Tabs } from 'expo-router'

import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { StudyLanguageSelector } from '@/features/study-languages/components/study-language-selector'
import { LoadingState, Screen } from '@/ui/components'

export default function TabsLayout() {
  const gate = useAuthGate('protected')

  if (gate.status === 'loading') {
    return (
      <Screen>
        <LoadingState message="Loading session..." />
      </Screen>
    )
  }

  if (gate.status === 'redirect') {
    return <Redirect href={gate.href} />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTitle: () => <StudyLanguageSelector />,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="decks" options={{ title: 'Decks' }} />
      <Tabs.Screen name="public" options={{ title: 'Public' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}

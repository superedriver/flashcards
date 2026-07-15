import { Redirect, Tabs } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { StudyLanguageSelector } from '@/features/study-languages/components/study-language-selector'
import { useStudyLanguageOnboardingGate } from '@/features/study-languages/hooks/use-study-language-onboarding-gate'
import { LoadingState, Screen } from '@/ui/components'

export default function TabsLayout() {
  const { t } = useTranslation()
  const gate = useAuthGate('protected')
  const onboardingGate = useStudyLanguageOnboardingGate('protected')

  if (gate.status === 'loading' || onboardingGate.status === 'loading') {
    return (
      <Screen>
        <LoadingState message={t('common.loading')} />
      </Screen>
    )
  }

  if (gate.status === 'redirect') {
    return <Redirect href={gate.href} />
  }

  if (onboardingGate.status === 'redirect') {
    return <Redirect href={onboardingGate.href} />
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
      <Tabs.Screen name="public" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}

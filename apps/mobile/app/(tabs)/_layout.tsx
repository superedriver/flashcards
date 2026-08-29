import { Ionicons } from '@expo/vector-icons'
import { Redirect, Tabs, router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { StudyLanguageSelector } from '@/features/study-languages/components/study-language-selector'
import { useStudyLanguageOnboardingGate } from '@/features/study-languages/hooks/use-study-language-onboarding-gate'
import { LoadingState, Screen } from '@/ui/components'

type TabIconName = keyof typeof Ionicons.glyphMap

function TabBarIcon({
  focused,
  name,
  outlineName,
}: {
  focused: boolean
  name: TabIconName
  outlineName: TabIconName
}) {
  return (
    <Ionicons
      color={focused ? '#1976d2' : '#666666'}
      name={focused ? name : outlineName}
      size={22}
    />
  )
}

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
        tabBarActiveTintColor: '#1976d2',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: t('common.tabs.home'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="home" outlineName="home-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="decks"
        listeners={{
          tabPress: (event) => {
            // Always open the decks list (do not restore a nested deck detail stack).
            event.preventDefault()
            router.navigate('/decks')
          },
        }}
        options={{
          title: t('common.tabs.decks'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="albums" outlineName="albums-outline" />
          ),
        }}
      />
      <Tabs.Screen name="public" options={{ href: null }} />
      <Tabs.Screen name="preview" options={{ href: null }} />
      <Tabs.Screen name="groups" options={{ href: null }} />
      <Tabs.Screen name="lessons" options={{ headerShown: false, href: null }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('common.tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="person" outlineName="person-outline" />
          ),
        }}
      />
    </Tabs>
  )
}

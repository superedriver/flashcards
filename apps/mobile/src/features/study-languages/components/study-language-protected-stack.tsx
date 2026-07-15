import { Redirect, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { useStudyLanguageOnboardingGate } from '@/features/study-languages/hooks/use-study-language-onboarding-gate'
import { LoadingState, Screen } from '@/ui/components'

type StudyLanguageProtectedStackProps = {
  children?: never
}

export function StudyLanguageProtectedStack(_props: StudyLanguageProtectedStackProps) {
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

  return <Stack screenOptions={{ headerShown: false }} />
}

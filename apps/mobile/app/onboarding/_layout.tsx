import { Redirect, Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { useStudyLanguageOnboardingGate } from '@/features/study-languages/hooks/use-study-language-onboarding-gate'
import { LoadingState, Screen } from '@/ui/components'

export default function OnboardingLayout() {
  const { t } = useTranslation()
  const authGate = useAuthGate('protected')
  const onboardingGate = useStudyLanguageOnboardingGate('onboarding')

  if (authGate.status === 'loading' || onboardingGate.status === 'loading') {
    return (
      <Screen>
        <LoadingState message={t('common.loading')} />
      </Screen>
    )
  }

  if (authGate.status === 'redirect') {
    return <Redirect href={authGate.href} />
  }

  if (onboardingGate.status === 'redirect') {
    return <Redirect href={onboardingGate.href} />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

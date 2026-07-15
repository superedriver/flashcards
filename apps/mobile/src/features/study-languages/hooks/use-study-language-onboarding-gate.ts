import type { Href } from 'expo-router'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'

export type StudyLanguageOnboardingGateResult =
  | { status: 'loading' }
  | { status: 'redirect'; href: Href }
  | { status: 'ready' }

export function useStudyLanguageOnboardingGate(
  mode: 'protected' | 'onboarding' = 'protected',
): StudyLanguageOnboardingGateResult {
  const { isAuthenticated, isBootstrapping } = useAuth()
  const { loading, needsStudyLanguageOnboarding } = useStudyLanguageContext()

  if (isBootstrapping || (isAuthenticated && loading)) {
    return { status: 'loading' }
  }

  if (!isAuthenticated) {
    return { status: 'ready' }
  }

  if (mode === 'onboarding') {
    if (!needsStudyLanguageOnboarding) {
      return { status: 'redirect', href: '/(tabs)' }
    }

    return { status: 'ready' }
  }

  if (needsStudyLanguageOnboarding) {
    return { status: 'redirect', href: '/onboarding/study-languages' }
  }

  return { status: 'ready' }
}

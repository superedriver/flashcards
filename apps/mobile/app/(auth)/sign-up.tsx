import { Redirect } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { SignUpForm } from '@/features/auth/components/sign-up-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export default function SignUpScreen() {
  const { t } = useTranslation()
  const { error } = useAuth()
  const gate = useAuthGate('guestOnly')

  if (gate.status === 'loading') {
    return (
      <Screen>
        <LoadingState message={t('auth.loadingSession')} />
      </Screen>
    )
  }

  if (gate.status === 'redirect') {
    return <Redirect href={gate.href} />
  }

  return (
    <Screen scrollable variant="narrow">
      <PageTitle title={t('auth.signUp.title')} />
      {error ? <ErrorState message={error} /> : null}
      <SignUpForm />
    </Screen>
  )
}

import { Redirect } from 'expo-router'

import { SignInForm } from '@/features/auth/components/sign-in-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export default function SignInScreen() {
  const { error } = useAuth()
  const gate = useAuthGate('guestOnly')

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
    <Screen variant="narrow">
      <PageTitle title="Sign In" />
      {error ? <ErrorState message={error} /> : null}
      <SignInForm />
    </Screen>
  )
}

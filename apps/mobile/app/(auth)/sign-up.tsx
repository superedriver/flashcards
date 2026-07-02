import { Redirect } from 'expo-router'

import { SignUpForm } from '@/features/auth/components/sign-up-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export default function SignUpScreen() {
  const { error, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />
  }

  return (
    <Screen>
      <PageTitle title="Sign Up" />
      {error ? <ErrorState message={error} /> : null}
      <SignUpForm />
    </Screen>
  )
}

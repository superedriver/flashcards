import { Redirect } from 'expo-router'

import { SignInForm } from '@/features/auth/components/sign-in-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export default function SignInScreen() {
  const { error, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />
  }

  return (
    <Screen>
      <PageTitle title="Sign In" />
      {error ? <ErrorState message={error} /> : null}
      <SignInForm />
    </Screen>
  )
}

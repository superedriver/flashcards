import { Redirect } from 'expo-router'

import { SignUpForm } from '@/features/auth/components/sign-up-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export default function SignUpScreen() {
  const { error, isAuthenticated, isBootstrapping, user } = useAuth()

  if (isBootstrapping) {
    return (
      <Screen>
        <LoadingState message="Loading session..." />
      </Screen>
    )
  }

  if (isAuthenticated && user) {
    return <Redirect href={getPostAuthRedirectHref(user)} />
  }

  return (
    <Screen variant="narrow">
      <PageTitle title="Sign Up" />
      {error ? <ErrorState message={error} /> : null}
      <SignUpForm />
    </Screen>
  )
}

import { Redirect } from 'expo-router'

import { SignUpForm } from '@/features/auth/components/sign-up-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export default function SignUpScreen() {
  const { error, isAuthenticated, user } = useAuth()

  if (isAuthenticated && user) {
    return <Redirect href={getPostAuthRedirectHref(user)} />
  }

  return (
    <Screen>
      <PageTitle title="Sign Up" />
      {error ? <ErrorState message={error} /> : null}
      <SignUpForm />
    </Screen>
  )
}

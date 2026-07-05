import { Redirect } from 'expo-router'

import { SignInForm } from '@/features/auth/components/sign-in-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export default function SignInScreen() {
  const { error, isAuthenticated, user } = useAuth()

  if (isAuthenticated && user) {
    return <Redirect href={getPostAuthRedirectHref(user)} />
  }

  return (
    <Screen variant="narrow">
      <PageTitle title="Sign In" />
      {error ? <ErrorState message={error} /> : null}
      <SignInForm />
    </Screen>
  )
}

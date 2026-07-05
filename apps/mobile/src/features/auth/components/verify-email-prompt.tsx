import { Redirect, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { View } from 'react-native'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useResendVerificationEmailMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function VerifyEmailPrompt() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />
  }

  if (user?.emailVerifiedAt) {
    return <Redirect href="/(tabs)" />
  }

  const handleResend = async () => {
    if (isSubmittingRef.current || isSubmitting) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError(null)
    setFeedback(null)

    try {
      await resendVerificationEmail()
      setFeedback('Verification email sent. Check your inbox.')
    } catch {
      setError('Could not resend verification email. Try again later.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <Screen variant="narrow">
      <PageTitle title="Verify Your Email" />
      <AppText>
        We sent a verification link to {user?.email ?? 'your email address'}. Open the link to
        verify your account.
      </AppText>

      <View style={{ gap: 12, marginTop: 16 }}>
        <AppButton disabled={isSubmitting} onPress={() => void handleResend()}>
          {isSubmitting ? 'Sending...' : 'Resend verification email'}
        </AppButton>
        <AppButton onPress={() => router.replace('/(tabs)')}>Continue to app</AppButton>
      </View>

      {feedback ? <AppText style={{ color: '#2e7d32', marginTop: 12 }}>{feedback}</AppText> : null}
      {error ? <ErrorState message={error} onRetry={() => void handleResend()} /> : null}
    </Screen>
  )
}

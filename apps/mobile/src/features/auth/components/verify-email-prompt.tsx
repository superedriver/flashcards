import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useResendVerificationEmailMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function VerifyEmailPrompt() {
  const router = useRouter()
  const { user } = useAuth()
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleResend = async () => {
    setIsSubmitting(true)
    setError(null)
    setFeedback(null)

    try {
      await resendVerificationEmail()
      setFeedback('Verification email sent.')
    } catch {
      setError('Could not resend verification email. Try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen>
      <PageTitle title="Verify Your Email" />
      <AppText>
        We sent a verification link to {user?.email ?? 'your email address'}. Open the link to
        verify your account.
      </AppText>

      <View style={{ gap: 12, marginTop: 16 }}>
        <AppButton disabled={isSubmitting} onPress={() => void handleResend()}>
          Resend verification email
        </AppButton>
        <AppButton onPress={() => router.replace('/(tabs)')}>Continue to app</AppButton>
      </View>

      {feedback ? <AppText>{feedback}</AppText> : null}
      {error ? <ErrorState message={error} /> : null}
    </Screen>
  )
}

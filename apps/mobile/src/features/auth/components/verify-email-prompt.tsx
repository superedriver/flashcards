import { Redirect, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useResendVerificationEmailMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function VerifyEmailPrompt() {
  const { t } = useTranslation()
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
      setFeedback(t('auth.verifyEmail.resendSuccess'))
    } catch {
      setError(t('auth.verifyEmail.resendFailed'))
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <Screen variant="narrow">
      <PageTitle title={t('auth.verifyEmail.promptTitle')} />
      <AppText>
        {t('auth.verifyEmail.promptBody', {
          email: user?.email ?? t('auth.verifyEmail.promptBodyFallback'),
        })}
      </AppText>

      <View style={{ gap: 12, marginTop: 16 }}>
        <AppButton disabled={isSubmitting} onPress={() => void handleResend()}>
          {isSubmitting ? t('auth.verifyEmail.resending') : t('auth.verifyEmail.resend')}
        </AppButton>
        <AppButton onPress={() => router.replace('/(tabs)')}>
          {t('auth.verifyEmail.continueToApp')}
        </AppButton>
      </View>

      {feedback ? <AppText style={{ color: '#2e7d32', marginTop: 12 }}>{feedback}</AppText> : null}
      {error ? <ErrorState message={error} onRetry={() => void handleResend()} /> : null}
    </Screen>
  )
}

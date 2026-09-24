import { Redirect, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { useResendVerificationEmailMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { Screen } from '@/ui/components'

const COOLDOWN_SECONDS = 45

export function VerifyEmailPrompt() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [resendVerificationEmail] = useResendVerificationEmailMutation()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const isSubmittingRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />
  }

  if (user?.emailVerifiedAt) {
    return <Redirect href="/(tabs)" />
  }

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS)
    intervalRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResend = async () => {
    if (isSubmittingRef.current || isSubmitting || cooldown > 0) return

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError(null)
    setFeedback(null)

    try {
      await resendVerificationEmail()
      setFeedback(t('auth.verifyEmail.resendSuccess'))
      startCooldown()
    } catch {
      setError(t('auth.verifyEmail.resendFailed'))
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  const resendDisabled = isSubmitting || cooldown > 0

  const resendLabel = isSubmitting
    ? t('auth.verifyEmail.resending')
    : cooldown > 0
      ? t('auth.verifyEmail.resendCooldown', { seconds: cooldown })
      : t('auth.verifyEmail.resend')

  return (
    <Screen scrollable>
      <View
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          maxWidth: 400,
          paddingTop: 32,
          width: '100%',
        }}
      >
        <AppText style={{ fontSize: 48, marginBottom: 16 }}>✉️</AppText>

        <AppText style={{ fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' }}>
          {t('auth.verifyEmail.promptTitle')}
        </AppText>

        <AppText style={{ color: '#666666', fontSize: 15, marginBottom: 4, textAlign: 'center' }}>
          {t('auth.verifyEmail.promptBody')}
        </AppText>
        <AppText
          style={{
            color: '#111111',
            fontSize: 15,
            fontWeight: '600',
            marginBottom: 28,
            textAlign: 'center',
          }}
        >
          {user?.email ?? t('auth.verifyEmail.promptBodyFallback')}
        </AppText>

        {feedback ? (
          <AppText
            style={{ color: '#2e7d32', fontSize: 14, marginBottom: 16, textAlign: 'center' }}
          >
            {feedback}
          </AppText>
        ) : null}

        {error ? (
          <AppText
            style={{ color: '#c62828', fontSize: 14, marginBottom: 16, textAlign: 'center' }}
          >
            {error}
          </AppText>
        ) : null}

        <Pressable
          accessibilityRole="button"
          disabled={resendDisabled}
          onPress={() => void handleResend()}
          style={({ pressed }) => ({
            alignItems: 'center',
            borderColor: resendDisabled ? '#cccccc' : '#1976d2',
            borderRadius: 10,
            borderWidth: 1.5,
            height: 48,
            justifyContent: 'center',
            marginBottom: 12,
            opacity: pressed ? 0.8 : 1,
            width: '100%',
          })}
        >
          <AppText
            style={{
              color: resendDisabled ? '#aaaaaa' : '#1976d2',
              fontSize: 15,
              fontWeight: '600',
            }}
          >
            {resendLabel}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.replace('/(tabs)')}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, paddingVertical: 10 })}
        >
          <AppText style={{ color: '#888888', fontSize: 14 }}>
            {t('auth.verifyEmail.continueToApp')}
          </AppText>
        </Pressable>
      </View>
    </Screen>
  )
}

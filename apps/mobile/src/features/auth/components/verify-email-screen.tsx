import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { mapSafeUserToAuthUser, useAuthStore } from '@/features/auth/state/auth-store'
import type { AuthUser } from '@/features/auth/types/auth-user'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { useVerifyEmailMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function VerifyEmailScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token?: string }>()
  const [verifyEmail] = useVerifyEmailMutation()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [verifiedUser, setVerifiedUser] = useState<AuthUser | null>(null)
  const [attempt, setAttempt] = useState(0)

  const runVerification = useCallback(async () => {
    if (!token || typeof token !== 'string') {
      setStatus('error')
      setMessage(t('auth.verifyEmail.tokenMissing'))
      return
    }

    setStatus('loading')
    setMessage(null)

    try {
      const result = await verifyEmail({
        variables: {
          input: { token },
        },
      })

      const user = result.data?.verifyEmail

      if (!user) {
        setStatus('error')
        setMessage(t('auth.verifyEmail.failed'))
        return
      }

      const authUser = mapSafeUserToAuthUser(user)
      useAuthStore.getState().setUser(authUser)
      setVerifiedUser(authUser)
      setStatus('success')
      setMessage(t('auth.verifyEmail.success'))
    } catch {
      setStatus('error')
      setMessage(t('auth.verifyEmail.failed'))
    }
  }, [t, token, verifyEmail])

  useEffect(() => {
    void runVerification()
  }, [attempt, runVerification])

  const handleRetry = () => {
    setAttempt((current) => current + 1)
  }

  return (
    <Screen variant="narrow">
      <PageTitle title={t('auth.verifyEmail.title')} />
      {status === 'loading' ? <LoadingState message={t('auth.verifyEmail.verifying')} /> : null}
      {status === 'success' ? (
        <View style={{ gap: 12 }}>
          <AppText>{message}</AppText>
          <AppButton
            onPress={() => {
              if (verifiedUser) {
                router.replace(getPostAuthRedirectHref(verifiedUser))
              }
            }}
          >
            {t('auth.verifyEmail.continue')}
          </AppButton>
        </View>
      ) : null}
      {status === 'error' ? (
        <View style={{ gap: 12 }}>
          <ErrorState
            message={message ?? t('auth.verifyEmail.verificationFailed')}
            onRetry={handleRetry}
          />
          <AppButton onPress={() => router.replace('/(auth)/sign-in')}>
            {t('auth.verifyEmail.backToSignIn')}
          </AppButton>
        </View>
      ) : null}
    </Screen>
  )
}

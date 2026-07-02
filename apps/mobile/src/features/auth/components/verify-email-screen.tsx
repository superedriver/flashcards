import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

import { mapSafeUserToAuthUser, useAuthStore } from '@/features/auth/state/auth-store'
import { useVerifyEmailMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function VerifyEmailScreen() {
  const router = useRouter()
  const { token } = useLocalSearchParams<{ token?: string }>()
  const [verifyEmail] = useVerifyEmailMutation()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!token || typeof token !== 'string') {
      setStatus('error')
      setMessage('Verification token is missing.')
      return
    }

    void verifyEmail({
      variables: {
        input: { token },
      },
    })
      .then((result) => {
        const user = result.data?.verifyEmail

        if (!user) {
          setStatus('error')
          setMessage('Email verification failed.')
          return
        }

        useAuthStore.getState().setUser(mapSafeUserToAuthUser(user))
        setStatus('success')
        setMessage('Your email has been verified.')
      })
      .catch(() => {
        setStatus('error')
        setMessage('Email verification failed.')
      })
  }, [token, verifyEmail])

  return (
    <Screen>
      <PageTitle title="Verify Email" />
      {status === 'loading' ? <LoadingState message="Verifying email..." /> : null}
      {status === 'success' ? (
        <View style={{ gap: 12 }}>
          <AppText>{message}</AppText>
          <AppButton onPress={() => router.replace('/(tabs)')}>Continue</AppButton>
        </View>
      ) : null}
      {status === 'error' ? <ErrorState message={message ?? 'Verification failed.'} /> : null}
    </Screen>
  )
}

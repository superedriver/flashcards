import { gql, useMutation } from '@apollo/client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import { useGoogleAuth } from '@/features/auth/services/google-auth.service'
import { signInWithApple, isAppleAuthAvailable } from '@/features/auth/services/apple-auth.service'
import { AppText } from '@/ui/primitives'
import { AppButton } from '@/ui/primitives'
import { useEffect } from 'react'

const LINK_OAUTH_MUTATION = gql`
  mutation LinkOAuthAccount($input: LinkOAuthAccountInput!) {
    linkOAuthAccount(input: $input)
  }
`

export function LinkedAccountsCard() {
  const { t } = useTranslation()
  const [linkOAuthAccount] = useMutation(LINK_OAUTH_MUTATION)
  const { signIn: signInGoogle, isConfigured: isGoogleConfigured } = useGoogleAuth()
  const [isAppleAvailable, setIsAppleAvailable] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [successProvider, setSuccessProvider] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (Platform.OS !== 'ios') return
    void isAppleAuthAvailable().then(setIsAppleAvailable)
  }, [])

  const handleLinkGoogle = async () => {
    if (loadingProvider) return
    setLoadingProvider('google')
    setError(null)
    setSuccessProvider(null)

    try {
      const { idToken } = await signInGoogle()
      await linkOAuthAccount({ variables: { input: { provider: 'google', token: idToken } } })
      setSuccessProvider('google')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message !== 'Google Sign In was cancelled') {
        setError(t('profile.linkedAccounts.linkFailed'))
      }
    } finally {
      setLoadingProvider(null)
    }
  }

  const handleLinkApple = async () => {
    if (loadingProvider) return
    setLoadingProvider('apple')
    setError(null)
    setSuccessProvider(null)

    try {
      const { identityToken } = await signInWithApple()
      await linkOAuthAccount({
        variables: { input: { provider: 'apple', token: identityToken } },
      })
      setSuccessProvider('apple')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message !== 'ERR_REQUEST_CANCELED') {
        setError(t('profile.linkedAccounts.linkFailed'))
      }
    } finally {
      setLoadingProvider(null)
    }
  }

  const showGoogle = isGoogleConfigured
  const showApple = isAppleAvailable

  if (!showGoogle && !showApple) {
    return null
  }

  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>
        {t('profile.linkedAccounts.title')}
      </AppText>

      {showGoogle ? (
        successProvider === 'google' ? (
          <AppText style={{ color: '#2e7d32', fontSize: 14 }}>
            {t('profile.linkedAccounts.googleLinked')}
          </AppText>
        ) : (
          <AppButton
            disabled={loadingProvider === 'google'}
            onPress={() => void handleLinkGoogle()}
          >
            {loadingProvider === 'google'
              ? t('profile.linkedAccounts.linking')
              : t('profile.linkedAccounts.linkGoogle')}
          </AppButton>
        )
      ) : null}

      {showApple ? (
        successProvider === 'apple' ? (
          <AppText style={{ color: '#2e7d32', fontSize: 14 }}>
            {t('profile.linkedAccounts.appleLinked')}
          </AppText>
        ) : (
          <AppButton disabled={loadingProvider === 'apple'} onPress={() => void handleLinkApple()}>
            {loadingProvider === 'apple'
              ? t('profile.linkedAccounts.linking')
              : t('profile.linkedAccounts.linkApple')}
          </AppButton>
        )
      ) : null}

      {error ? <AppText style={{ color: '#b00020', fontSize: 14 }}>{error}</AppText> : null}
    </View>
  )
}

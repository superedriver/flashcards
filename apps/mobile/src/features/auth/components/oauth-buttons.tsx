import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, View } from 'react-native'

import { applyAuthPayload } from '@/features/auth/services/auth-session'
import { isAppleAuthAvailable, signInWithApple } from '@/features/auth/services/apple-auth.service'
import { useGoogleAuth } from '@/features/auth/services/google-auth.service'
import { mapSafeUserToAuthUser } from '@/features/auth/state/auth-store'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { AppText } from '@/ui/primitives'

const GOOGLE_AUTH_MUTATION = gql`
  mutation GoogleAuth($input: GoogleOAuthInput!) {
    googleAuth(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        role
        emailVerifiedAt
        blockedAt
        createdAt
        updatedAt
      }
    }
  }
`

const APPLE_AUTH_MUTATION = gql`
  mutation AppleAuth($input: AppleOAuthInput!) {
    appleAuth(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        role
        emailVerifiedAt
        blockedAt
        createdAt
        updatedAt
      }
    }
  }
`

type GoogleAuthPayload = {
  googleAuth: {
    accessToken: string
    refreshToken?: string | null
    user: Parameters<typeof mapSafeUserToAuthUser>[0]
  }
}

type AppleAuthPayload = {
  appleAuth: {
    accessToken: string
    refreshToken?: string | null
    user: Parameters<typeof mapSafeUserToAuthUser>[0]
  }
}

export function OAuthButtons() {
  const { t } = useTranslation()
  const router = useRouter()
  const { signIn: signInGoogle, isConfigured: isGoogleConfigured } = useGoogleAuth()
  const [googleAuth] = useMutation<GoogleAuthPayload>(GOOGLE_AUTH_MUTATION)
  const [appleAuth] = useMutation<AppleAuthPayload>(APPLE_AUTH_MUTATION)
  const [isAppleAvailable, setIsAppleAvailable] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'apple' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (Platform.OS !== 'ios') return
    void isAppleAuthAvailable().then(setIsAppleAvailable)
  }, [])

  const hasAny = isGoogleConfigured || isAppleAvailable

  if (!hasAny) return null

  const handleGoogle = async () => {
    if (loadingProvider) return
    setLoadingProvider('google')
    setError(null)
    try {
      const { idToken } = await signInGoogle()
      const result = await googleAuth({ variables: { input: { idToken } } })
      const payload = result.data?.googleAuth
      if (!payload) {
        setError(t('auth.google.failed'))
        return
      }
      await applyAuthPayload(payload)
      router.replace(getPostAuthRedirectHref(mapSafeUserToAuthUser(payload.user)))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message !== 'Google Sign In was cancelled') {
        setError(t('auth.google.failed'))
      }
    } finally {
      setLoadingProvider(null)
    }
  }

  const handleApple = async () => {
    if (loadingProvider) return
    setLoadingProvider('apple')
    setError(null)
    try {
      const { identityToken } = await signInWithApple()
      const result = await appleAuth({ variables: { input: { identityToken } } })
      const payload = result.data?.appleAuth
      if (!payload) {
        setError(t('auth.apple.failed'))
        return
      }
      await applyAuthPayload(payload)
      router.replace(getPostAuthRedirectHref(mapSafeUserToAuthUser(payload.user)))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message !== 'ERR_REQUEST_CANCELED') {
        setError(t('auth.apple.failed'))
      }
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <View style={{ gap: 10 }}>
      {isGoogleConfigured ? (
        <OAuthProviderButton
          disabled={loadingProvider !== null}
          label={loadingProvider === 'google' ? t('auth.google.loading') : t('auth.google.label')}
          onPress={() => void handleGoogle()}
        />
      ) : null}

      {isAppleAvailable ? (
        <OAuthProviderButton
          disabled={loadingProvider !== null}
          label={loadingProvider === 'apple' ? t('auth.apple.loading') : t('auth.apple.label')}
          onPress={() => void handleApple()}
        />
      ) : null}

      {error ? (
        <AppText style={{ color: '#b00020', fontSize: 13, textAlign: 'center' }}>{error}</AppText>
      ) : null}
    </View>
  )
}

function OAuthProviderButton({
  label,
  disabled,
  onPress,
}: {
  label: string
  disabled: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: pressed ? '#f9fafb' : '#ffffff',
        borderColor: '#d0d5dd',
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 44,
        opacity: disabled ? 0.6 : 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
      })}
      onPress={onPress}
    >
      <AppText style={{ color: '#344054', fontSize: 15, fontWeight: '500' }}>{label}</AppText>
    </Pressable>
  )
}

import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { applyAuthPayload } from '@/features/auth/services/auth-session'
import { mapSafeUserToAuthUser } from '@/features/auth/state/auth-store'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { isAppleAuthAvailable, signInWithApple } from '@/features/auth/services/apple-auth.service'
import { AppButton } from '@/ui/primitives'

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

type AppleAuthPayload = {
  appleAuth: {
    accessToken: string
    refreshToken?: string | null
    user: Parameters<typeof mapSafeUserToAuthUser>[0]
  }
}

export function AppleLoginButton() {
  const { t } = useTranslation()
  const router = useRouter()
  const [appleAuth] = useMutation<AppleAuthPayload>(APPLE_AUTH_MUTATION)
  const [isLoading, setIsLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return
    }

    void isAppleAuthAvailable().then(setIsAvailable)
  }, [])

  if (!isAvailable) {
    return null
  }

  const handlePress = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const { identityToken } = await signInWithApple()
      const result = await appleAuth({
        variables: { input: { identityToken } },
      })
      const payload = result.data?.appleAuth

      if (!payload) {
        return
      }

      await applyAuthPayload(payload)
      router.replace(getPostAuthRedirectHref(mapSafeUserToAuthUser(payload.user)))
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (message !== 'ERR_REQUEST_CANCELED') {
        // User cancelled — no error shown
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppButton
      accessibilityHint={t('auth.apple.hint')}
      accessibilityLabel={t('auth.apple.label')}
      disabled={isLoading}
      onPress={() => void handlePress()}
    >
      {isLoading ? t('auth.apple.loading') : t('auth.apple.label')}
    </AppButton>
  )
}

import { gql, useMutation } from '@apollo/client'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { applyAuthPayload } from '@/features/auth/services/auth-session'
import { mapSafeUserToAuthUser } from '@/features/auth/state/auth-store'
import { getPostAuthRedirectHref } from '@/features/auth/utils/get-post-auth-redirect'
import { useGoogleAuth } from '@/features/auth/services/google-auth.service'
import { AppButton } from '@/ui/primitives'

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

type GoogleAuthPayload = {
  googleAuth: {
    accessToken: string
    refreshToken?: string | null
    user: Parameters<typeof mapSafeUserToAuthUser>[0]
  }
}

export function GoogleLoginButton() {
  const { t } = useTranslation()
  const router = useRouter()
  const { signIn, isConfigured } = useGoogleAuth()
  const [googleAuth] = useMutation<GoogleAuthPayload>(GOOGLE_AUTH_MUTATION)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePress = async () => {
    if (isLoading) return
    setIsLoading(true)
    setError(null)

    try {
      const { idToken } = await signIn()
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
      setIsLoading(false)
    }
  }

  if (!isConfigured) {
    return null
  }

  return (
    <>
      <AppButton
        accessibilityHint={t('auth.google.hint')}
        accessibilityLabel={t('auth.google.label')}
        disabled={isLoading}
        onPress={() => void handlePress()}
      >
        {isLoading ? t('auth.google.loading') : t('auth.google.label')}
      </AppButton>
      {error ? null : null}
    </>
  )
}

import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { AuthLocaleSwitcher } from '@/features/auth/components/auth-locale-switcher'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { LoadingState, Screen } from '@/ui/components'

export default function AuthLayout() {
  const { t } = useTranslation()
  const { isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <Screen>
        <LoadingState message={t('auth.loadingSession')} />
      </Screen>
    )
  }

  const headerRight = () => <AuthLocaleSwitcher />

  return (
    <Stack screenOptions={{ headerShown: true, headerRight }}>
      <Stack.Screen name="sign-in" options={{ title: t('auth.signIn.title') }} />
      <Stack.Screen name="sign-up" options={{ title: t('auth.signUp.title') }} />
      <Stack.Screen name="verify-email-prompt" options={{ title: t('auth.verifyEmail.title') }} />
      <Stack.Screen name="verify-email" options={{ title: t('auth.verifyEmail.title') }} />
      <Stack.Screen name="forgot-password" options={{ title: t('auth.forgotPassword.title') }} />
      <Stack.Screen name="reset-password" options={{ title: t('auth.resetPassword.title') }} />
    </Stack>
  )
}

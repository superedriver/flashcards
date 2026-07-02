import { Stack } from 'expo-router'

import { useAuth } from '@/features/auth/hooks/use-auth'
import { LoadingState, Screen } from '@/ui/components'

export default function AuthLayout() {
  const { isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return (
      <Screen>
        <LoadingState message="Loading session..." />
      </Screen>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
      <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="verify-email-prompt" options={{ title: 'Verify Email' }} />
      <Stack.Screen name="verify-email" options={{ title: 'Verify Email' }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
      <Stack.Screen name="reset-password" options={{ title: 'Reset Password' }} />
    </Stack>
  )
}

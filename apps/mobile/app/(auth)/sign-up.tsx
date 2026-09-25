import { Redirect } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SignUpForm } from '@/features/auth/components/sign-up-form'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { useAuthGate } from '@/features/auth/hooks/use-auth-gate'
import { LoadingState, Screen } from '@/ui/components'

export default function SignUpScreen() {
  const { t } = useTranslation()
  const gate = useAuthGate('guestOnly')

  useAuth()

  if (gate.status === 'loading') {
    return (
      <Screen>
        <LoadingState message={t('auth.loadingSession')} />
      </Screen>
    )
  }

  if (gate.status === 'redirect') {
    return <Redirect href={gate.href} />
  }

  return (
    <Screen scrollable variant="narrow">
      <View style={{ flex: 1, justifyContent: 'center', minHeight: 560 }}>
        <SignUpForm />
      </View>
    </Screen>
  )
}

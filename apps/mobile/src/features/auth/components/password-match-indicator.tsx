import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

const GREEN = '#16a34a'
const RED = '#dc2626'

export function PasswordMatchIndicator({
  confirmPassword,
  password,
}: {
  confirmPassword: string
  password: string
}) {
  const { t } = useTranslation()
  const met = confirmPassword.length > 0 && password === confirmPassword

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
      <View
        style={{
          backgroundColor: met ? GREEN : RED,
          borderRadius: 4,
          height: 8,
          width: 8,
        }}
      />
      <AppText style={{ color: met ? GREEN : RED, fontSize: 12 }}>
        {t('auth.passwordStrength.passwordsMatch')}
      </AppText>
    </View>
  )
}

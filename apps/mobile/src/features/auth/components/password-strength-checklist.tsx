import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

const GREEN = '#16a34a'
const RED = '#dc2626'

function Rule({ met, label }: { met: boolean; label: string }) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
      <AppText style={{ color: met ? GREEN : RED, fontSize: 12, width: 12 }}>
        {met ? '✓' : '✗'}
      </AppText>
      <AppText style={{ color: met ? GREEN : RED, fontSize: 12 }}>{label}</AppText>
    </View>
  )
}

export function PasswordStrengthChecklist({ password }: { password: string }) {
  const { t } = useTranslation()

  return (
    <View style={{ gap: 4 }}>
      <Rule met={password.length >= 8} label={t('auth.passwordStrength.minLength')} />
      <Rule met={/[A-Z]/.test(password)} label={t('auth.passwordStrength.uppercase')} />
      <Rule met={/[a-z]/.test(password)} label={t('auth.passwordStrength.lowercase')} />
      <Rule met={/[0-9]/.test(password)} label={t('auth.passwordStrength.digit')} />
    </View>
  )
}

export function passwordMeetsAllRules(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  )
}

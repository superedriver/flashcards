import { useTranslation } from 'react-i18next'
import { ActivityIndicator, View } from 'react-native'

import { AppText } from '@/ui/primitives'

type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message }: LoadingStateProps) {
  const { t } = useTranslation()
  const displayMessage = message ?? t('common.loading')

  return (
    <View
      accessibilityLabel={displayMessage}
      accessibilityRole="progressbar"
      style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}
    >
      <ActivityIndicator accessibilityLabel={t('common.loading')} />
      <AppText style={{ color: '#666666', textAlign: 'center' }}>{displayMessage}</AppText>
    </View>
  )
}

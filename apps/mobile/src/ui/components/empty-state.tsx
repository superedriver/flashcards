import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppButton, AppText } from '@/ui/primitives'

type EmptyStateProps = {
  actionLabel?: string
  message?: string
  onAction?: () => void
}

export function EmptyState({ actionLabel, message, onAction }: EmptyStateProps) {
  const { t } = useTranslation()
  const displayMessage = message ?? t('common.empty')

  return (
    <View style={{ gap: 12, paddingVertical: 16 }}>
      <AppText style={{ color: '#666666', textAlign: 'center' }}>{displayMessage}</AppText>
      {onAction && actionLabel ? <AppButton onPress={onAction}>{actionLabel}</AppButton> : null}
    </View>
  )
}

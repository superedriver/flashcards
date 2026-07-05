import { View } from 'react-native'

import { AppButton, AppText } from '@/ui/primitives'

type EmptyStateProps = {
  actionLabel?: string
  message?: string
  onAction?: () => void
}

export function EmptyState({
  actionLabel,
  message = 'Nothing here yet.',
  onAction,
}: EmptyStateProps) {
  return (
    <View style={{ gap: 12, paddingVertical: 16 }}>
      <AppText style={{ color: '#666666', textAlign: 'center' }}>{message}</AppText>
      {onAction && actionLabel ? <AppButton onPress={onAction}>{actionLabel}</AppButton> : null}
    </View>
  )
}

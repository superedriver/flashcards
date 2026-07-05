import { View } from 'react-native'

import { AppButton, AppText } from '@/ui/primitives'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <View accessibilityRole="alert" style={{ gap: 12, paddingVertical: 16 }}>
      <AppText
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={{ color: '#c0392b' }}
      >
        {message}
      </AppText>
      {onRetry ? (
        <AppButton
          accessibilityHint="Retries the previous action."
          accessibilityLabel={retryLabel}
          onPress={onRetry}
        >
          {retryLabel}
        </AppButton>
      ) : null}
    </View>
  )
}

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppButton, AppText } from '@/ui/primitives'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({ message, onRetry, retryLabel }: ErrorStateProps) {
  const { t } = useTranslation()
  const displayMessage = message ?? t('common.error')
  const displayRetryLabel = retryLabel ?? t('common.retry')

  return (
    <View accessibilityRole="alert" style={{ gap: 12, paddingVertical: 16 }}>
      <AppText
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={{ color: '#c0392b' }}
      >
        {displayMessage}
      </AppText>
      {onRetry ? (
        <AppButton
          accessibilityHint="Retries the previous action."
          accessibilityLabel={displayRetryLabel}
          onPress={onRetry}
        >
          {displayRetryLabel}
        </AppButton>
      ) : null}
    </View>
  )
}

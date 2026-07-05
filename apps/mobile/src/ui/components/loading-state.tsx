import { ActivityIndicator, View } from 'react-native'

import { AppText } from '@/ui/primitives'

type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <View
      accessibilityLabel={message}
      accessibilityRole="progressbar"
      style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}
    >
      <ActivityIndicator accessibilityLabel="Loading" />
      <AppText style={{ color: '#666666', textAlign: 'center' }}>{message}</AppText>
    </View>
  )
}

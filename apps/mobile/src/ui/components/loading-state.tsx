import { ActivityIndicator, View } from 'react-native'

import { AppText } from '@/ui/primitives'

type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <View style={{ alignItems: 'center', gap: 12, paddingVertical: 24 }}>
      <ActivityIndicator />
      <AppText style={{ color: '#666666', textAlign: 'center' }}>{message}</AppText>
    </View>
  )
}

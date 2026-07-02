import { Text } from 'tamagui'

type LoadingStateProps = {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return <Text style={{ color: '#666666' }}>{message}</Text>
}

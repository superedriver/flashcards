import { Text } from 'tamagui'

type EmptyStateProps = {
  message?: string
}

export function EmptyState({ message = 'Nothing here yet.' }: EmptyStateProps) {
  return <Text style={{ color: '#666666' }}>{message}</Text>
}

import { Text } from 'tamagui'

type ErrorStateProps = {
  message?: string
}

export function ErrorState({ message = 'Something went wrong.' }: ErrorStateProps) {
  return <Text style={{ color: '#c0392b' }}>{message}</Text>
}

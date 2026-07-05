import { AppText } from '@/ui/primitives'

type AuthFieldErrorProps = {
  message?: string
}

export function AuthFieldError({ message }: AuthFieldErrorProps) {
  if (!message) {
    return null
  }

  return <AppText style={{ color: '#c0392b', fontSize: 14 }}>{message}</AppText>
}

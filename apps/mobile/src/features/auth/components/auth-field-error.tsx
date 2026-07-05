import { AppText } from '@/ui/primitives'

type AuthFieldErrorProps = {
  message?: string
}

export function AuthFieldError({ message }: AuthFieldErrorProps) {
  if (!message) {
    return null
  }

  return (
    <AppText
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={{ color: '#c0392b', fontSize: 14 }}
    >
      {message}
    </AppText>
  )
}

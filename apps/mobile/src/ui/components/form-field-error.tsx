import { AppText } from '@/ui/primitives'

type FormFieldErrorProps = {
  message?: string
}

export function FormFieldError({ message }: FormFieldErrorProps) {
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

import type { ComponentProps } from 'react'
import { Platform } from 'react-native'
import { Input } from 'tamagui'

type AppInputProps = ComponentProps<typeof Input> & {
  onPaste?: (event: {
    clipboardData?: { getData: (type: string) => string }
    nativeEvent?: { clipboardData?: { getData: (type: string) => string } }
    preventDefault: () => void
  }) => void
}

export function AppInput({
  accessibilityHint: _accessibilityHint,
  accessibilityLabel,
  accessibilityRole = 'text',
  secureTextEntry,
  style,
  ...props
}: AppInputProps) {
  if (Platform.OS === 'web') {
    return (
      <Input
        aria-label={accessibilityLabel}
        // @ts-expect-error — web-only HTML attribute for password masking
        type={secureTextEntry ? 'password' : undefined}
        style={style}
        {...props}
      />
    )
  }

  return (
    <Input
      accessibilityRole={accessibilityRole}
      secureTextEntry={secureTextEntry}
      style={style}
      {...props}
    />
  )
}

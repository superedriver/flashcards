import type { ComponentProps } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import { Input } from 'tamagui'

type AppInputProps = ComponentProps<typeof Input> & {
  onPaste?: (event: {
    clipboardData?: { getData: (type: string) => string }
    nativeEvent?: { clipboardData?: { getData: (type: string) => string } }
    preventDefault: () => void
  }) => void
}

const webPasswordInputStyle = {
  backgroundColor: 'hsla(0, 0%, 95%, 1)',
  borderColor: 'hsla(0, 0%, 91%, 1)',
  borderRadius: 8,
  borderWidth: 1,
  color: 'hsla(0, 0%, 9%, 1)',
  fontSize: 16,
  lineHeight: 22,
  minHeight: 44,
  paddingHorizontal: 12,
  paddingVertical: 10,
  placeholderTextColor: 'hsla(0, 0%, 56%, 1)',
  width: '100%',
} as const

export function AppInput({
  accessibilityRole = 'text',
  secureTextEntry,
  style,
  ...props
}: AppInputProps) {
  if (Platform.OS === 'web' && secureTextEntry) {
    const { placeholderTextColor, ...layoutStyle } = webPasswordInputStyle

    return (
      <RNTextInput
        accessibilityRole={accessibilityRole}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry
        style={[layoutStyle, style as ComponentProps<typeof RNTextInput>['style']]}
        {...(props as ComponentProps<typeof RNTextInput>)}
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

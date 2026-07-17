import type { ComponentProps } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import { Input } from 'tamagui'

type AppInputProps = ComponentProps<typeof Input>

const webPasswordInputStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#cccccc',
  borderRadius: 8,
  borderWidth: 1,
  color: '#111111',
  fontSize: 16,
  lineHeight: 22,
  minHeight: 44,
  paddingHorizontal: 12,
  paddingVertical: 10,
  width: '100%',
} as const

export function AppInput({
  accessibilityRole = 'text',
  secureTextEntry,
  style,
  ...props
}: AppInputProps) {
  if (Platform.OS === 'web' && secureTextEntry) {
    return (
      <RNTextInput
        accessibilityRole={accessibilityRole}
        secureTextEntry
        style={[webPasswordInputStyle, style as ComponentProps<typeof RNTextInput>['style']]}
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

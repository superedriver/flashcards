import type { ComponentProps } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import { Input } from 'tamagui'

type AppInputProps = ComponentProps<typeof Input>

export function AppInput({ accessibilityRole = 'text', secureTextEntry, ...props }: AppInputProps) {
  if (Platform.OS === 'web' && secureTextEntry) {
    return (
      <RNTextInput
        accessibilityRole={accessibilityRole}
        secureTextEntry
        {...(props as ComponentProps<typeof RNTextInput>)}
      />
    )
  }

  return (
    <Input accessibilityRole={accessibilityRole} secureTextEntry={secureTextEntry} {...props} />
  )
}

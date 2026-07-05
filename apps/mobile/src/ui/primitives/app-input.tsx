import type { ComponentProps } from 'react'
import { Input } from 'tamagui'

type AppInputProps = ComponentProps<typeof Input>

export function AppInput({ accessibilityRole = 'text', style, ...props }: AppInputProps) {
  return (
    <Input accessibilityRole={accessibilityRole} style={[{ minHeight: 44 }, style]} {...props} />
  )
}

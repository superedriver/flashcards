import type { ComponentProps } from 'react'
import { Input } from 'tamagui'

type AppInputProps = ComponentProps<typeof Input>

export function AppInput({ accessibilityRole = 'text', ...props }: AppInputProps) {
  return <Input accessibilityRole={accessibilityRole} {...props} />
}

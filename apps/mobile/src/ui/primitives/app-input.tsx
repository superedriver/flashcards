import type { ComponentProps } from 'react'
import { Input } from 'tamagui'

type AppInputProps = ComponentProps<typeof Input>

export function AppInput(props: AppInputProps) {
  return <Input {...props} />
}

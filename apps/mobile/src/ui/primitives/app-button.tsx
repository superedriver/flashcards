import type { ComponentProps } from 'react'
import { Button } from 'tamagui'

type AppButtonProps = ComponentProps<typeof Button>

export function AppButton(props: AppButtonProps) {
  return <Button {...props} />
}

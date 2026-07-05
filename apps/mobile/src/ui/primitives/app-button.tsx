import type { ComponentProps } from 'react'
import { Button } from 'tamagui'

type AppButtonProps = ComponentProps<typeof Button>

export function AppButton({ accessibilityRole = 'button', height = 44, ...props }: AppButtonProps) {
  return <Button accessibilityRole={accessibilityRole} height={height} {...props} />
}

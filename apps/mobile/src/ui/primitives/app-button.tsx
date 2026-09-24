import type { ComponentProps } from 'react'
import { Platform } from 'react-native'
import { Button } from 'tamagui'

type AppButtonProps = ComponentProps<typeof Button>

export function AppButton({
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  ...props
}: AppButtonProps) {
  if (Platform.OS === 'web') {
    return <Button aria-label={accessibilityLabel} {...props} />
  }

  return (
    <Button
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole ?? 'button'}
      {...props}
    />
  )
}

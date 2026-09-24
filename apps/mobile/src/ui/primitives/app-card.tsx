import type { ComponentProps, ReactNode } from 'react'
import { Platform } from 'react-native'
import { Card } from 'tamagui'

type AppCardProps = ComponentProps<typeof Card> & {
  children: ReactNode
}

export function AppCard({
  accessibilityHint,
  accessibilityLabel,
  accessibilityRole,
  children,
  ...props
}: AppCardProps) {
  if (Platform.OS === 'web') {
    return (
      <Card aria-label={accessibilityLabel} {...props}>
        {children}
      </Card>
    )
  }

  return (
    <Card
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...props}
    >
      {children}
    </Card>
  )
}

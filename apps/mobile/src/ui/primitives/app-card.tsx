import type { ComponentProps, ReactNode } from 'react'
import { Card } from 'tamagui'

type AppCardProps = ComponentProps<typeof Card> & {
  children: ReactNode
}

export function AppCard({ children, ...props }: AppCardProps) {
  return <Card {...props}>{children}</Card>
}

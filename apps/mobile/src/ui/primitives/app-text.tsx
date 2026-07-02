import type { ComponentProps } from 'react'
import { Text } from 'tamagui'

type AppTextProps = ComponentProps<typeof Text>

export function AppText(props: AppTextProps) {
  return <Text {...props} />
}

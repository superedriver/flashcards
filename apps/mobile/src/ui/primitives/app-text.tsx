import type { ComponentProps } from 'react'
import { Platform } from 'react-native'
import { Text } from 'tamagui'

type AppTextProps = ComponentProps<typeof Text>

const webTextStyle =
  Platform.OS === 'web'
    ? ({
        flexShrink: 1,
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
      } as const)
    : undefined

export function AppText({ style, ...props }: AppTextProps) {
  return <Text style={[webTextStyle, style]} {...props} />
}

import type { ComponentProps, ReactNode } from 'react'
import { Platform, Text as RNText, type TextStyle } from 'react-native'
import { Text } from 'tamagui'

type AppTextProps = ComponentProps<typeof Text>

const webTextStyle = {
  flexShrink: 1,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
} as TextStyle

export function AppText({
  accessibilityLiveRegion,
  accessibilityRole,
  children,
  style,
  ...props
}: AppTextProps) {
  if (Platform.OS === 'web') {
    return (
      <RNText
        accessibilityRole={accessibilityRole}
        aria-live={accessibilityLiveRegion === 'polite' ? 'polite' : undefined}
        style={[webTextStyle, style as ComponentProps<typeof RNText>['style']]}
      >
        {children as ReactNode}
      </RNText>
    )
  }

  return (
    <Text
      accessibilityLiveRegion={accessibilityLiveRegion}
      accessibilityRole={accessibilityRole}
      style={style}
      {...props}
    >
      {children}
    </Text>
  )
}

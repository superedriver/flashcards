import type { ComponentProps, ReactNode } from 'react'
import { Platform, Text as RNText, type TextProps, type TextStyle } from 'react-native'
import { Text } from 'tamagui'

type AppTextProps = ComponentProps<typeof Text> & Pick<TextProps, 'ellipsizeMode' | 'numberOfLines'>

const webTextStyle = {
  flexShrink: 1,
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
} as TextStyle

const webClampedTextStyle = {
  flexShrink: 1,
  overflow: 'hidden',
} as TextStyle

export function AppText({
  accessibilityLiveRegion,
  accessibilityRole,
  children,
  ellipsizeMode,
  numberOfLines,
  style,
  ...props
}: AppTextProps) {
  if (Platform.OS === 'web') {
    return (
      <RNText
        accessibilityRole={accessibilityRole}
        aria-live={accessibilityLiveRegion === 'polite' ? 'polite' : undefined}
        ellipsizeMode={ellipsizeMode}
        numberOfLines={numberOfLines}
        style={[
          numberOfLines != null ? webClampedTextStyle : webTextStyle,
          style as ComponentProps<typeof RNText>['style'],
        ]}
      >
        {children as ReactNode}
      </RNText>
    )
  }

  return (
    <Text
      accessibilityLiveRegion={accessibilityLiveRegion}
      accessibilityRole={accessibilityRole}
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines}
      style={style}
      {...props}
    >
      {children}
    </Text>
  )
}

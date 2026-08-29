import type { ComponentProps, ReactNode } from 'react'
import { Platform, Text as RNText, type TextProps, type TextStyle } from 'react-native'
import { Text } from 'tamagui'

type AppTextProps = ComponentProps<typeof Text> &
  Pick<TextProps, 'ellipsizeMode' | 'numberOfLines'> & {
    title?: string
  }

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
  title,
  ...props
}: AppTextProps) {
  if (Platform.OS === 'web') {
    return (
      <RNText
        {...({
          accessibilityRole,
          'aria-live': accessibilityLiveRegion === 'polite' ? 'polite' : undefined,
          ellipsizeMode,
          numberOfLines,
          style: [
            numberOfLines != null ? webClampedTextStyle : webTextStyle,
            style as ComponentProps<typeof RNText>['style'],
          ],
          title,
        } as TextProps)}
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

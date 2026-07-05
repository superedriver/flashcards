import type { ReactNode } from 'react'
import { ScrollView, View, useWindowDimensions, type ViewProps } from 'react-native'

import {
  type ScreenVariant,
  getScreenContentContainerStyle,
  getScreenPadding,
} from '@/ui/utils/responsive'

type ScreenProps = ViewProps & {
  children: ReactNode
  scrollable?: boolean
  variant?: ScreenVariant
}

export function Screen({
  children,
  scrollable = false,
  variant = 'default',
  style,
  ...rest
}: ScreenProps) {
  const { width } = useWindowDimensions()
  const padding = getScreenPadding(width)
  const contentContainerStyle = getScreenContentContainerStyle(width, variant)
  const content = <View style={contentContainerStyle}>{children}</View>

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding }}
        style={[{ flex: 1 }, style]}
        {...rest}
      >
        {content}
      </ScrollView>
    )
  }

  return (
    <View style={[{ flex: 1, padding }, style]} {...rest}>
      {content}
    </View>
  )
}

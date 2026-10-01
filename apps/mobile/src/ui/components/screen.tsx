import type { ReactNode } from 'react'
import { ScrollView, View, useWindowDimensions, type ViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
  const insets = useSafeAreaInsets()
  const padding = getScreenPadding(width)
  const contentContainerStyle = getScreenContentContainerStyle(width, variant)
  const content = <View style={[contentContainerStyle, { flex: 1 }]}>{children}</View>

  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding, paddingTop: Math.max(padding, insets.top) }}
        style={[{ flex: 1 }, style]}
        {...rest}
      >
        {content}
      </ScrollView>
    )
  }

  return (
    <View
      style={[{ flex: 1, padding, paddingTop: Math.max(padding, insets.top) }, style]}
      {...rest}
    >
      {content}
    </View>
  )
}

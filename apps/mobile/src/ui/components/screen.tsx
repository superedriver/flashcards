import type { ReactNode } from 'react'
import { ScrollView, View, type ViewProps } from 'react-native'

type ScreenProps = ViewProps & {
  children: ReactNode
  scrollable?: boolean
}

export function Screen({ children, scrollable = false, style, ...rest }: ScreenProps) {
  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        style={[{ flex: 1 }, style]}
        {...rest}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View style={[{ flex: 1, padding: 16 }, style]} {...rest}>
      {children}
    </View>
  )
}

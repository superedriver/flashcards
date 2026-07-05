import { View } from 'react-native'
import { Text } from 'tamagui'

type PageTitleProps = {
  title: string
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <View accessibilityRole="header" style={{ marginBottom: 8 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>
        {title}
      </Text>
    </View>
  )
}

import { View } from 'react-native'
import { Text } from 'tamagui'

type PageTitleProps = {
  title: string
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>{title}</Text>
    </View>
  )
}

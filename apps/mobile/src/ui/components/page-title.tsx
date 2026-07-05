import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type PageTitleProps = {
  title: string
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <View accessibilityRole="header" style={{ marginBottom: 8 }}>
      <AppText accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>
        {title}
      </AppText>
    </View>
  )
}

import type { ReactNode } from 'react'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type PageTitleProps = {
  title: string
  trailing?: ReactNode
}

export function PageTitle({ title, trailing }: PageTitleProps) {
  return (
    <View
      accessibilityRole="header"
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}
    >
      <AppText
        accessibilityRole="header"
        style={{ flex: 1, fontSize: 24, fontWeight: '700', paddingRight: 8 }}
      >
        {title}
      </AppText>
      {trailing}
    </View>
  )
}

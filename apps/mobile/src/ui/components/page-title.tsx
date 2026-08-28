import type { ReactNode } from 'react'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type PageTitleProps = {
  afterTitle?: ReactNode
  title: string
  trailing?: ReactNode
}

export function PageTitle({ afterTitle, title, trailing }: PageTitleProps) {
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
      <View
        style={{ alignItems: 'center', flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
      >
        <AppText accessibilityRole="header" style={{ fontSize: 24, fontWeight: '700' }}>
          {title}
        </AppText>
        {afterTitle}
      </View>
      {trailing}
    </View>
  )
}

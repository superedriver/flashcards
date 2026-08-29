import type { ReactNode } from 'react'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type SettingsLabeledRowProps = {
  label: string
  trailing?: ReactNode
}

export function SettingsLabeledRow({ label, trailing }: SettingsLabeledRowProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
        minHeight: 36,
      }}
    >
      <AppText style={{ color: '#344054', flexShrink: 1, fontSize: 14, fontWeight: '600' }}>
        {label}
      </AppText>
      {trailing}
    </View>
  )
}

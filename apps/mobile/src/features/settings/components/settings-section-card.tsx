import type { ReactNode } from 'react'
import { View } from 'react-native'

type SettingsSectionCardProps = {
  children: ReactNode
}

export function SettingsSectionCard({ children }: SettingsSectionCardProps) {
  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderColor: '#e4e7ec',
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
        overflow: 'hidden',
        padding: 12,
      }}
    >
      {children}
    </View>
  )
}

import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'

import { AppText } from '@/ui/primitives'

export type LanguageRowItem = {
  code: string
  englishName: string
  nativeName: string
  flag: string
}

type LanguageListRowProps = {
  language: LanguageRowItem
  onPress?: () => void
  rightAccessory?: ReactNode
  selected?: boolean
  disabled?: boolean
}

export function LanguageListRow({
  language,
  onPress,
  rightAccessory,
  selected = false,
  disabled = false,
}: LanguageListRowProps) {
  const content = (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: selected ? '#e3f2fd' : '#ffffff',
        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1,
        flexDirection: 'row',
        gap: 12,
        opacity: disabled ? 0.5 : 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <AppText style={{ fontSize: 28 }}>{language.flag}</AppText>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText style={{ fontSize: 16, fontWeight: '600' }}>{language.nativeName}</AppText>
        <AppText style={{ color: '#666666', fontSize: 14 }}>{language.englishName}</AppText>
      </View>
      {rightAccessory}
    </View>
  )

  if (!onPress) {
    return content
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {content}
    </Pressable>
  )
}

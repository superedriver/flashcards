import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type FieldLabelProps = {
  children: string
  flag?: string
}

export function FieldLabel({ children, flag }: FieldLabelProps) {
  if (flag) {
    return (
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6, marginBottom: 4 }}>
        <AppText accessibilityRole="text" style={{ fontWeight: '600' }}>
          {children}
        </AppText>
        <AppText style={{ fontSize: 18, lineHeight: 22 }}>{flag}</AppText>
      </View>
    )
  }

  return (
    <AppText accessibilityRole="text" style={{ fontWeight: '600', marginBottom: 4 }}>
      {children}
    </AppText>
  )
}

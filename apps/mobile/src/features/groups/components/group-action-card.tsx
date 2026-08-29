import { Ionicons } from '@expo/vector-icons'
import { Pressable, View } from 'react-native'

import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type GroupActionCardProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
  subtitle: string
}

export function GroupActionCard({ icon, label, onPress, subtitle }: GroupActionCardProps) {
  return (
    <Pressable
      {...buttonA11yProps(label, subtitle)}
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#e4e7ec',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        minHeight: 72,
        minWidth: 0,
        paddingHorizontal: 12,
        paddingVertical: 12,
        width: '100%',
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#e8f0fe',
          borderRadius: 10,
          height: 40,
          justifyContent: 'center',
          width: 40,
        }}
      >
        <Ionicons color="#1a56db" name={icon} size={20} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <AppText numberOfLines={1} style={{ fontSize: 15, fontWeight: '700' }}>
          {label}
        </AppText>
        <AppText numberOfLines={1} style={{ color: '#667085', fontSize: 12 }}>
          {subtitle}
        </AppText>
      </View>
      <Ionicons color="#98a2b3" name="chevron-forward" size={16} />
    </Pressable>
  )
}

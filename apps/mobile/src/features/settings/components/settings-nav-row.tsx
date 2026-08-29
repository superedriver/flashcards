import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'

import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type SettingsNavRowProps = {
  label: string
  onPress: () => void
}

export function SettingsNavRow({ label, onPress }: SettingsNavRowProps) {
  return (
    <Pressable
      {...buttonA11yProps(label)}
      onPress={onPress}
      style={{
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#e4e7ec',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        minWidth: 0,
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 12,
      }}
    >
      <AppText numberOfLines={1} style={{ flex: 1, fontSize: 14, fontWeight: '600' }}>
        {label}
      </AppText>
      <Ionicons color="#98a2b3" name="chevron-forward" size={16} />
    </Pressable>
  )
}

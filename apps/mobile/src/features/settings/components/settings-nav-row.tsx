import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'

import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type SettingsNavRowProps = {
  disabled?: boolean
  label: string
  onPress: () => void
}

export function SettingsNavRow({ disabled = false, label, onPress }: SettingsNavRowProps) {
  return (
    <Pressable
      {...buttonA11yProps(label)}
      accessibilityState={{ disabled }}
      disabled={disabled}
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
        opacity: disabled ? 0.45 : 1,
        paddingHorizontal: 12,
        paddingVertical: 12,
        width: '100%',
      }}
    >
      <AppText numberOfLines={1} style={{ flex: 1, fontSize: 14, fontWeight: '600' }}>
        {label}
      </AppText>
      <Ionicons color="#98a2b3" name="chevron-forward" size={16} />
    </Pressable>
  )
}

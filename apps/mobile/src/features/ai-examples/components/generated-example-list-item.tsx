import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'

import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type GeneratedExampleListItemProps = {
  exampleText: string
  isSelected: boolean
  onSelect: () => void
}

export function GeneratedExampleListItem({
  exampleText,
  isSelected,
  onSelect,
}: GeneratedExampleListItemProps) {
  return (
    <Pressable
      {...buttonA11yProps(exampleText)}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      onPress={onSelect}
      style={{
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 6,
      }}
    >
      <Ionicons
        color={isSelected ? '#1a56db' : '#98a2b3'}
        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
        size={18}
        style={{ marginTop: 2 }}
      />
      <AppText style={{ color: '#1d2939', flex: 1, fontSize: 14, lineHeight: 20 }}>
        {exampleText}
      </AppText>
    </Pressable>
  )
}

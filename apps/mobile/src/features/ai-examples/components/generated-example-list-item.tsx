import { Pressable, View } from 'react-native'

import { AppButton, AppText } from '@/ui/primitives'

type GeneratedExampleListItemProps = {
  exampleText: string
  isSelected: boolean
  onSave?: () => void
  onSelect: () => void
}

export function GeneratedExampleListItem({
  exampleText,
  isSelected,
  onSave,
  onSelect,
}: GeneratedExampleListItemProps) {
  return (
    <Pressable onPress={onSelect}>
      <View
        style={{
          borderColor: isSelected ? '#1565c0' : '#cccccc',
          borderRadius: 8,
          borderWidth: 1,
          gap: 8,
          marginBottom: 8,
          padding: 12,
        }}
      >
        <AppText>{exampleText}</AppText>
        {onSave ? <AppButton onPress={onSave}>Save this example</AppButton> : null}
      </View>
    </Pressable>
  )
}

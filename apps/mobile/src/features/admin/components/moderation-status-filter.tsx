import { DeckModerationStatus } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { View } from 'react-native'

const STATUS_OPTIONS: Array<{ label: string; value: DeckModerationStatus | null }> = [
  { label: 'All', value: null },
  { label: 'Pending', value: DeckModerationStatus.Pending },
  { label: 'Approved', value: DeckModerationStatus.Approved },
  { label: 'Rejected', value: DeckModerationStatus.Rejected },
  { label: 'Hidden', value: DeckModerationStatus.Hidden },
]

type ModerationStatusFilterProps = {
  onChange: (status: DeckModerationStatus | null) => void
  value: DeckModerationStatus | null
}

export function ModerationStatusFilter({ onChange, value }: ModerationStatusFilterProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      {STATUS_OPTIONS.map((option) => {
        const isSelected = value === option.value

        return (
          <AppButton key={option.label} onPress={() => onChange(option.value)}>
            {isSelected ? `[${option.label}]` : option.label}
          </AppButton>
        )
      })}
    </View>
  )
}

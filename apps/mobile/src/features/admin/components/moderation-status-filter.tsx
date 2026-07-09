import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { DeckModerationStatus } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'

const STATUS_OPTIONS = [
  { key: 'all', value: null },
  { key: 'pending', value: DeckModerationStatus.Pending },
  { key: 'approved', value: DeckModerationStatus.Approved },
  { key: 'rejected', value: DeckModerationStatus.Rejected },
  { key: 'hidden', value: DeckModerationStatus.Hidden },
] as const

type ModerationStatusFilterProps = {
  onChange: (status: DeckModerationStatus | null) => void
  value: DeckModerationStatus | null
}

export function ModerationStatusFilter({ onChange, value }: ModerationStatusFilterProps) {
  const { t } = useTranslation()

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      {STATUS_OPTIONS.map((option) => {
        const isSelected = value === option.value
        const label = t(`admin.moderation.statusFilter.${option.key}`)

        return (
          <AppButton key={option.key} onPress={() => onChange(option.value)}>
            {isSelected ? `[${label}]` : label}
          </AppButton>
        )
      })}
    </View>
  )
}

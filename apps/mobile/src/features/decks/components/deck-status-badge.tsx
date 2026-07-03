import type { DeckModerationStatus, DeckVisibility } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { View } from 'react-native'

type DeckStatusBadgeProps = {
  moderationStatus: DeckModerationStatus
  visibility: DeckVisibility
}

export function DeckStatusBadge({ moderationStatus, visibility }: DeckStatusBadgeProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <AppText style={{ color: '#555555', fontSize: 12 }}>{visibility}</AppText>
      <AppText style={{ color: '#555555', fontSize: 12 }}>{moderationStatus}</AppText>
    </View>
  )
}

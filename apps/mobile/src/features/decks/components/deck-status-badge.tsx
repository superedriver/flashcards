import type { DeckModerationStatus, DeckVisibility } from '@/graphql/generated'
import {
  DeckModerationStatus as ModerationStatus,
  DeckVisibility as Visibility,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { View } from 'react-native'

import { getModerationLabel, getVisibilityLabel } from '@/features/decks/utils/format-deck-status'

type DeckStatusBadgeProps = {
  moderationStatus: DeckModerationStatus
  visibility: DeckVisibility
}

function getVisibilityColor(visibility: DeckVisibility): string {
  return visibility === Visibility.Public ? '#1565c0' : '#555555'
}

function getModerationColor(moderationStatus: DeckModerationStatus): string {
  switch (moderationStatus) {
    case ModerationStatus.Approved:
      return '#2e7d32'
    case ModerationStatus.Hidden:
      return '#6d4c41'
    case ModerationStatus.Pending:
      return '#ef6c00'
    case ModerationStatus.Rejected:
      return '#c62828'
    default:
      return '#555555'
  }
}

export function DeckStatusBadge({ moderationStatus, visibility }: DeckStatusBadgeProps) {
  const moderationLabel = getModerationLabel(moderationStatus)

  return (
    <View style={{ flexDirection: 'column', gap: 2 }}>
      <AppText style={{ color: getVisibilityColor(visibility), fontSize: 12, fontWeight: '600' }}>
        {getVisibilityLabel(visibility)}
      </AppText>
      {moderationLabel ? (
        <AppText
          style={{ color: getModerationColor(moderationStatus), fontSize: 12, fontWeight: '600' }}
        >
          {moderationLabel}
        </AppText>
      ) : null}
    </View>
  )
}

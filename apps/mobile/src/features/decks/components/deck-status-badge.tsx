import { Ionicons } from '@expo/vector-icons'
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

type PillStyle = {
  background: string
  border: string
  color: string
  icon: keyof typeof Ionicons.glyphMap
}

function getVisibilityStyle(visibility: DeckVisibility): PillStyle {
  if (visibility === Visibility.Public) {
    return { background: '#eff4ff', border: '#b2ccff', color: '#1565c0', icon: 'globe-outline' }
  }

  return { background: '#e8edf2', border: '#98a2b3', color: '#344054', icon: 'lock-closed-outline' }
}

function getModerationStyle(moderationStatus: DeckModerationStatus): PillStyle | null {
  switch (moderationStatus) {
    case ModerationStatus.Approved:
      return {
        background: '#ecfdf3',
        border: '#abefc6',
        color: '#067647',
        icon: 'checkmark-circle-outline',
      }
    case ModerationStatus.Hidden:
      return {
        background: '#f5f0eb',
        border: '#d6c4b4',
        color: '#6d4c41',
        icon: 'eye-off-outline',
      }
    case ModerationStatus.Pending:
      return { background: '#fff4e5', border: '#f7c48a', color: '#b54708', icon: 'time-outline' }
    case ModerationStatus.Rejected:
      return {
        background: '#fef3f2',
        border: '#fecdca',
        color: '#b42318',
        icon: 'close-circle-outline',
      }
    default:
      return null
  }
}

function StatusPill({ background, border, color, icon, label }: PillStyle & { label: string }) {
  return (
    <View
      style={{
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: background,
        borderColor: border,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      <Ionicons color={color} name={icon} size={14} />
      <AppText style={{ color, fontSize: 12, fontWeight: '600' }}>{label}</AppText>
    </View>
  )
}

export function DeckStatusBadge({ moderationStatus, visibility }: DeckStatusBadgeProps) {
  const moderationLabel = getModerationLabel(moderationStatus)
  const visibilityStyle = getVisibilityStyle(visibility)
  const moderationStyle = getModerationStyle(moderationStatus)

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <StatusPill {...visibilityStyle} label={getVisibilityLabel(visibility)} />
      {moderationLabel && moderationStyle ? (
        <StatusPill {...moderationStyle} label={moderationLabel} />
      ) : null}
    </View>
  )
}

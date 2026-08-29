import { Ionicons } from '@expo/vector-icons'
import type { DeckModerationStatus, DeckVisibility } from '@/graphql/generated'
import {
  DeckModerationStatus as ModerationStatus,
  DeckVisibility as Visibility,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getModerationLabel, getVisibilityLabel } from '@/features/decks/utils/format-deck-status'

type DeckStatusBadgeProps = {
  compact?: boolean
  hideApproved?: boolean
  isOfficial?: boolean
  moderationStatus: DeckModerationStatus
  presentation?: 'default' | 'shared' | 'catalog'
  visibility: DeckVisibility
}

type PillStyle = {
  background: string
  border: string
  color: string
  icon: keyof typeof Ionicons.glyphMap
}

function getVisibilityStyle(visibility: DeckVisibility, compact = false): PillStyle {
  if (compact) {
    return visibility === Visibility.Public
      ? { background: '#f2f4f7', border: '#e4e7ec', color: '#667085', icon: 'globe-outline' }
      : { background: '#f2f4f7', border: '#e4e7ec', color: '#667085', icon: 'lock-closed-outline' }
  }

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

function StatusPill({
  background,
  border,
  color,
  compact = false,
  icon,
  label,
}: PillStyle & { compact?: boolean; label: string }) {
  return (
    <View
      style={{
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: background,
        borderColor: border,
        borderRadius: compact ? 6 : 8,
        borderWidth: 1,
        flexDirection: 'row',
        gap: compact ? 3 : 4,
        paddingHorizontal: compact ? 6 : 8,
        paddingVertical: compact ? 1 : 3,
      }}
    >
      <Ionicons color={color} name={icon} size={compact ? 11 : 13} />
      <AppText style={{ color, fontSize: compact ? 10 : 11, fontWeight: compact ? '500' : '600' }}>
        {label}
      </AppText>
    </View>
  )
}

export function DeckStatusBadge({
  compact = false,
  hideApproved = false,
  isOfficial = false,
  moderationStatus,
  presentation = 'default',
  visibility,
}: DeckStatusBadgeProps) {
  const { t } = useTranslation()

  if (presentation === 'shared') {
    return (
      <StatusPill
        background="#e8f0fe"
        border="#b2ccff"
        color="#1a56db"
        compact={compact}
        icon="people-outline"
        label={t('decks.sections.shared')}
      />
    )
  }

  if (presentation === 'catalog') {
    if (isOfficial) {
      return (
        <StatusPill
          background="#ecfdf3"
          border="#abefc6"
          color="#067647"
          compact={compact}
          icon="star-outline"
          label={t('decks.status.official')}
        />
      )
    }

    return (
      <StatusPill
        {...getVisibilityStyle(Visibility.Public, compact)}
        compact={compact}
        label={getVisibilityLabel(Visibility.Public)}
      />
    )
  }

  const moderationLabel = getModerationLabel(moderationStatus)
  const visibilityStyle = getVisibilityStyle(visibility, compact)
  const moderationStyle = getModerationStyle(moderationStatus)
  const showModeration =
    Boolean(moderationLabel && moderationStyle) &&
    !(hideApproved && moderationStatus === ModerationStatus.Approved)

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: compact ? 4 : 8,
        justifyContent: 'flex-end',
      }}
    >
      <StatusPill {...visibilityStyle} compact={compact} label={getVisibilityLabel(visibility)} />
      {showModeration && moderationLabel && moderationStyle ? (
        <StatusPill {...moderationStyle} compact={compact} label={moderationLabel} />
      ) : null}
    </View>
  )
}

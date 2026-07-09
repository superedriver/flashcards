import { i18n } from '@/i18n'
import { DeckModerationStatus, DeckVisibility } from '@/graphql/generated'

export function getVisibilityLabel(visibility: DeckVisibility): string {
  return visibility === DeckVisibility.Public
    ? i18n.t('decks.status.public')
    : i18n.t('decks.status.private')
}

export function getModerationLabel(moderationStatus: DeckModerationStatus): string | null {
  switch (moderationStatus) {
    case DeckModerationStatus.Approved:
      return i18n.t('decks.status.published')
    case DeckModerationStatus.Hidden:
      return i18n.t('decks.status.hidden')
    case DeckModerationStatus.None:
      return null
    case DeckModerationStatus.Pending:
      return i18n.t('decks.status.pendingReview')
    case DeckModerationStatus.Rejected:
      return i18n.t('decks.status.rejected')
    default:
      return null
  }
}

export function getDeckStatusSummary(
  visibility: DeckVisibility,
  moderationStatus: DeckModerationStatus,
): string {
  const visibilityLabel = getVisibilityLabel(visibility)
  const moderationLabel = getModerationLabel(moderationStatus)

  if (!moderationLabel || moderationStatus === DeckModerationStatus.None) {
    return visibilityLabel
  }

  return `${visibilityLabel}${i18n.t('decks.status.separator')}${moderationLabel}`
}

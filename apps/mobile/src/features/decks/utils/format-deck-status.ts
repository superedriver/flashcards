import { DeckModerationStatus, DeckVisibility } from '@/graphql/generated'

export function getVisibilityLabel(visibility: DeckVisibility): string {
  return visibility === DeckVisibility.Public ? 'Public' : 'Private'
}

export function getModerationLabel(moderationStatus: DeckModerationStatus): string | null {
  switch (moderationStatus) {
    case DeckModerationStatus.Approved:
      return 'Published'
    case DeckModerationStatus.Hidden:
      return 'Hidden'
    case DeckModerationStatus.None:
      return null
    case DeckModerationStatus.Pending:
      return 'Pending review'
    case DeckModerationStatus.Rejected:
      return 'Rejected'
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

  return `${visibilityLabel} · ${moderationLabel}`
}

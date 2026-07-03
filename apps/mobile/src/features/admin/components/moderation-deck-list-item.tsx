import type { ModerationQueueQuery } from '@/graphql/generated'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { DeckStatusBadge } from '@/features/decks/components/deck-status-badge'
import { AppButton, AppCard, AppText } from '@/ui/primitives'

type ModerationDeckListItemProps = {
  deck: ModerationQueueQuery['moderationQueue']['items'][number]
  isSubmitting?: boolean
  onApprove?: (deckId: string) => void
  onHide?: (deckId: string) => void
  onReject?: (deckId: string) => void
  onToggleOfficial?: (deckId: string, isOfficial: boolean) => void
}

export function ModerationDeckListItem({
  deck,
  isSubmitting = false,
  onApprove,
  onHide,
  onReject,
  onToggleOfficial,
}: ModerationDeckListItemProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ fontSize: 18, fontWeight: '600' }}>{deck.title}</AppText>
      <AppText>{deck.ownerEmail}</AppText>
      <AppText>Cards: {deck.cardCount}</AppText>
      {deck.isOfficial ? <AppText style={{ color: '#1976d2' }}>Official deck</AppText> : null}
      <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />

      {onApprove ? (
        <AppButton disabled={isSubmitting} onPress={() => onApprove(deck.id)}>
          Approve
        </AppButton>
      ) : null}
      {onReject ? (
        <AppButton disabled={isSubmitting} onPress={() => onReject(deck.id)}>
          Reject
        </AppButton>
      ) : null}
      {onHide ? (
        <AppButton disabled={isSubmitting} onPress={() => onHide(deck.id)}>
          Hide
        </AppButton>
      ) : null}

      {isAdmin && onToggleOfficial ? (
        <AppButton
          disabled={isSubmitting}
          onPress={() => onToggleOfficial(deck.id, !deck.isOfficial)}
        >
          {deck.isOfficial ? 'Remove Official' : 'Mark Official'}
        </AppButton>
      ) : null}
    </AppCard>
  )
}

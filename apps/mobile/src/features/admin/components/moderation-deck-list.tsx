import type { ModerationQueueQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { ModerationDeckListItem } from './moderation-deck-list-item'

type ModerationDeckListProps = {
  decks: ModerationQueueQuery['moderationQueue']['items']
  isSubmitting?: boolean
  onApprove?: (deckId: string) => void
  onHide?: (deckId: string) => void
  onReject?: (deckId: string) => void
  onToggleOfficial?: (deckId: string, isOfficial: boolean) => void
}

export function ModerationDeckList({
  decks,
  isSubmitting = false,
  onApprove,
  onHide,
  onReject,
  onToggleOfficial,
}: ModerationDeckListProps) {
  if (decks.length === 0) {
    return <EmptyState message="No decks in this moderation queue." />
  }

  return (
    <>
      {decks.map((deck) => (
        <ModerationDeckListItem
          key={deck.id}
          deck={deck}
          isSubmitting={isSubmitting}
          onApprove={onApprove}
          onHide={onHide}
          onReject={onReject}
          onToggleOfficial={onToggleOfficial}
        />
      ))}
    </>
  )
}

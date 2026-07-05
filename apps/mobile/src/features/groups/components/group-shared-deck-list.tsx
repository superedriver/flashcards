import type { GroupSharedDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'
import { AppText } from '@/ui/primitives'

import { GroupSharedDeckListItem } from './group-shared-deck-list-item'

type GroupSharedDeckListProps = {
  decks: GroupSharedDecksQuery['groupSharedDecks']
  onShareDeck?: () => void
}

export function GroupSharedDeckList({ decks, onShareDeck }: GroupSharedDeckListProps) {
  return (
    <>
      <AppText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>Shared decks</AppText>
      {decks.length === 0 ? (
        <EmptyState
          actionLabel={onShareDeck ? 'Share a deck' : undefined}
          message="No decks have been shared with this group yet."
          onAction={onShareDeck}
        />
      ) : (
        decks.map((deck) => <GroupSharedDeckListItem key={deck.id} deck={deck} />)
      )}
    </>
  )
}

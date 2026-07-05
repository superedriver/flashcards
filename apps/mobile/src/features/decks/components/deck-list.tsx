import { FlatList } from 'react-native'

import type { MyDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { DeckListItem } from './deck-list-item'

type DeckListProps = {
  decks: MyDecksQuery['myDecks']
  onCreateDeck?: () => void
}

export function DeckList({ decks, onCreateDeck }: DeckListProps) {
  if (decks.length === 0) {
    return (
      <EmptyState
        actionLabel={onCreateDeck ? 'Create your first deck' : undefined}
        message="You have no decks yet."
        onAction={onCreateDeck}
      />
    )
  }

  return (
    <FlatList
      data={decks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DeckListItem deck={item} />}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  )
}

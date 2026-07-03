import { FlatList } from 'react-native'

import type { MyDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { DeckListItem } from './deck-list-item'

type DeckListProps = {
  decks: MyDecksQuery['myDecks']
}

export function DeckList({ decks }: DeckListProps) {
  if (decks.length === 0) {
    return <EmptyState message="You have no decks yet. Create your first deck." />
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

import { FlatList } from 'react-native'

import type { PublicDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { PublicDeckListItem } from './public-deck-list-item'

type PublicDeckListProps = {
  decks: PublicDecksQuery['publicDecks']['items']
  searchQuery?: string
}

export function PublicDeckList({ decks, searchQuery }: PublicDeckListProps) {
  if (decks.length === 0) {
    return (
      <EmptyState
        message={
          searchQuery
            ? `No public decks match "${searchQuery}".`
            : 'No public decks are available yet.'
        }
      />
    )
  }

  return (
    <FlatList
      data={decks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PublicDeckListItem deck={item} />}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  )
}

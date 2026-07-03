import { FlatList } from 'react-native'

import type { PublicDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { PublicDeckListItem } from './public-deck-list-item'

type PublicDeckListProps = {
  decks: PublicDecksQuery['publicDecks']['items']
}

export function PublicDeckList({ decks }: PublicDeckListProps) {
  if (decks.length === 0) {
    return <EmptyState message="No public decks found." />
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

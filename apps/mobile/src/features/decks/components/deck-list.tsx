import type { ReactElement } from 'react'
import { FlatList, useWindowDimensions, View } from 'react-native'

import type { MyDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'
import { getListNumColumns } from '@/ui/utils/responsive'

import { DeckListItem } from './deck-list-item'

type DeckListProps = {
  decks: MyDecksQuery['myDecks']
  listHeader?: ReactElement | null
  onCreateDeck?: () => void
}

export function DeckList({ decks, listHeader, onCreateDeck }: DeckListProps) {
  const { width } = useWindowDimensions()
  const numColumns = getListNumColumns(width)

  if (decks.length === 0) {
    return (
      <>
        {listHeader}
        <EmptyState
          actionLabel={onCreateDeck ? 'Create your first deck' : undefined}
          message="You have no decks yet."
          onAction={onCreateDeck}
        />
      </>
    )
  }

  return (
    <FlatList
      columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
      contentContainerStyle={{ paddingBottom: 16 }}
      data={decks}
      key={`decks-${numColumns}`}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={listHeader ?? undefined}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={numColumns > 1 ? { flex: 1 } : undefined}>
          <DeckListItem deck={item} />
        </View>
      )}
    />
  )
}

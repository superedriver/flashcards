import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, useWindowDimensions, View } from 'react-native'

import type { MyDecksQuery } from '@/graphql/generated'
import { DeckOrigin } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'
import { getListNumColumns } from '@/ui/utils/responsive'

import { DeckListItem } from './deck-list-item'

type DeckListProps = {
  decks: MyDecksQuery['myDecks']
  listHeader?: ReactElement | null
  onCreateDeck?: () => void
}

export function DeckList({ decks, listHeader, onCreateDeck }: DeckListProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const numColumns = getListNumColumns(width)

  return (
    <FlatList
      columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
      data={decks}
      key={`decks-${numColumns}`}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          actionLabel={onCreateDeck ? t('decks.myDecks.emptyAction') : undefined}
          message={t('decks.myDecks.empty')}
          onAction={onCreateDeck}
        />
      }
      ListHeaderComponent={listHeader ?? undefined}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={numColumns > 1 ? { flex: 1 } : undefined}>
          <DeckListItem deck={{ ...item, origin: DeckOrigin.Own }} layout="fill" />
        </View>
      )}
      style={{ flex: 1 }}
    />
  )
}

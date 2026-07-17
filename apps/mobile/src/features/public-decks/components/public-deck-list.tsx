import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, useWindowDimensions, View } from 'react-native'

import type { PublicDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'
import { getListNumColumns } from '@/ui/utils/responsive'

import { PublicDeckListItem } from './public-deck-list-item'

type PublicDeckListProps = {
  decks: PublicDecksQuery['publicDecks']['items']
  listHeader?: ReactElement | null
  searchQuery?: string
}

export function PublicDeckList({ decks, listHeader, searchQuery }: PublicDeckListProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const numColumns = getListNumColumns(width)

  return (
    <FlatList
      columnWrapperStyle={numColumns > 1 ? { gap: 12 } : undefined}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
      data={decks}
      key={`public-decks-${numColumns}`}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          message={
            searchQuery
              ? t('publicDecks.emptyNoMatch', { query: searchQuery })
              : t('publicDecks.empty')
          }
        />
      }
      ListHeaderComponent={listHeader ?? undefined}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={numColumns > 1 ? { flex: 1 } : undefined}>
          <PublicDeckListItem deck={item} />
        </View>
      )}
      style={{ flex: 1 }}
    />
  )
}

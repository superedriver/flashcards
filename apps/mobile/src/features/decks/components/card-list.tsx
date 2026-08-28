import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'

import type { DeckCardsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { EmptyState } from '@/ui/components'

import { CardListItem } from './card-list-item'

type CardListProps = {
  cards: DeckCardsQuery['deckCards']
  deckId: string
  emptyActionLabel?: string
  isOwner: boolean
  listHeader?: ReactElement | null
  onDeleteCard?: (cardId: string) => void
  onEmptyAction?: () => void
  sectionTitle?: string
}

const CARDS_BORDER = '#c5cdd8'

const cardsBoxEdge = {
  borderColor: CARDS_BORDER,
  borderLeftWidth: 1,
  borderRightWidth: 1,
}

export function CardList({
  cards,
  deckId,
  emptyActionLabel,
  isOwner,
  listHeader,
  onDeleteCard,
  onEmptyAction,
  sectionTitle,
}: CardListProps) {
  const { t } = useTranslation()
  const framed = Boolean(sectionTitle)

  const header =
    listHeader || framed ? (
      <>
        {listHeader}
        {framed ? (
          <View
            style={{
              ...cardsBoxEdge,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderTopWidth: 1,
              paddingHorizontal: 8,
              paddingTop: 8,
            }}
          >
            <AppText style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              {sectionTitle}
            </AppText>
          </View>
        ) : null}
      </>
    ) : undefined

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 16, paddingRight: 16 }}
      data={cards}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <View
          style={
            framed
              ? {
                  ...cardsBoxEdge,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  borderBottomWidth: 1,
                  paddingBottom: 8,
                  paddingHorizontal: 8,
                }
              : undefined
          }
        >
          <EmptyState
            actionLabel={onEmptyAction ? emptyActionLabel : undefined}
            message={t('decks.card.empty')}
            onAction={onEmptyAction}
          />
        </View>
      }
      ListFooterComponent={
        framed && cards.length > 0 ? (
          <View
            style={{
              ...cardsBoxEdge,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              borderBottomWidth: 1,
              height: 8,
            }}
          />
        ) : null
      }
      ListHeaderComponent={header}
      renderItem={({ item, index }) => (
        <View style={framed ? { ...cardsBoxEdge, paddingHorizontal: 8 } : undefined}>
          <CardListItem
            card={item}
            deckId={deckId}
            isOwner={isOwner}
            isOdd={index % 2 === 1}
            onDelete={onDeleteCard}
          />
        </View>
      )}
      style={{ flex: 1 }}
    />
  )
}

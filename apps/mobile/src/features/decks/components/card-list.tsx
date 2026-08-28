import type { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList } from 'react-native'

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

  const header =
    listHeader || sectionTitle ? (
      <>
        {listHeader}
        {sectionTitle ? (
          <AppText style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 8 }}>
            {sectionTitle}
          </AppText>
        ) : null}
      </>
    ) : undefined

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 16, paddingRight: 16 }}
      data={cards}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          actionLabel={onEmptyAction ? emptyActionLabel : undefined}
          message={t('decks.card.empty')}
          onAction={onEmptyAction}
        />
      }
      ListHeaderComponent={header}
      renderItem={({ item, index }) => (
        <CardListItem
          card={item}
          deckId={deckId}
          isOwner={isOwner}
          isOdd={index % 2 === 1}
          onDelete={onDeleteCard}
        />
      )}
      style={{ flex: 1 }}
    />
  )
}

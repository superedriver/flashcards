import { FlatList } from 'react-native'

import type { DeckCardsQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { CardListItem } from './card-list-item'

type CardListProps = {
  cards: DeckCardsQuery['deckCards']
  deckId: string
  emptyActionLabel?: string
  isOwner: boolean
  onDeleteCard?: (cardId: string) => void
  onEmptyAction?: () => void
}

export function CardList({
  cards,
  deckId,
  emptyActionLabel,
  isOwner,
  onDeleteCard,
  onEmptyAction,
}: CardListProps) {
  if (cards.length === 0) {
    return (
      <EmptyState
        actionLabel={onEmptyAction ? emptyActionLabel : undefined}
        message="This deck has no cards yet."
        onAction={onEmptyAction}
      />
    )
  }

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CardListItem card={item} deckId={deckId} isOwner={isOwner} onDelete={onDeleteCard} />
      )}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  )
}

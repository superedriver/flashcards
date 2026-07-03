import { FlatList } from 'react-native'

import type { DeckCardsQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'

import { CardListItem } from './card-list-item'

type CardListProps = {
  cards: DeckCardsQuery['deckCards']
  deckId: string
  isOwner: boolean
  onDeleteCard?: (cardId: string) => void
}

export function CardList({ cards, deckId, isOwner, onDeleteCard }: CardListProps) {
  if (cards.length === 0) {
    return <EmptyState message="This deck has no cards yet." />
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

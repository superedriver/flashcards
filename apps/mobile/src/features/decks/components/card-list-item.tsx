import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import type { DeckCardsQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'

type CardListItemProps = {
  card: DeckCardsQuery['deckCards'][number]
  deckId: string
  isOwner: boolean
  onDelete?: (cardId: string) => void
}

export function CardListItem({ card, deckId, isOwner, onDelete }: CardListItemProps) {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => {
        if (isOwner) {
          router.push(`/decks/${deckId}/cards/${card.id}/edit`)
        }
      }}
    >
      <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
        <AppText style={{ color: '#888888', fontSize: 12 }}>#{card.position}</AppText>
        <AppText style={{ fontSize: 16, fontWeight: '600' }}>{card.front}</AppText>
        <AppText style={{ color: '#444444' }}>{card.back}</AppText>
        {card.example ? (
          <AppText style={{ color: '#666666' }}>Example: {card.example}</AppText>
        ) : null}
        {isOwner && onDelete ? (
          <Pressable onPress={() => onDelete(card.id)}>
            <AppText style={{ color: '#b00020' }}>Delete</AppText>
          </Pressable>
        ) : null}
      </AppCard>
    </Pressable>
  )
}

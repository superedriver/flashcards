import { useRouter } from 'expo-router'
import { View } from 'react-native'

import type { DeckCardsQuery } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'

type CardListItemProps = {
  card: DeckCardsQuery['deckCards'][number]
  deckId: string
  isOwner: boolean
  onDelete?: (cardId: string) => void
}

export function CardListItem({ card, deckId, isOwner, onDelete }: CardListItemProps) {
  const router = useRouter()

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ color: '#888888', fontSize: 12 }}>#{card.position}</AppText>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>{card.front}</AppText>
      <AppText style={{ color: '#444444' }}>{card.back}</AppText>
      {card.example ? (
        <AppText style={{ color: '#666666' }}>Example: {card.example}</AppText>
      ) : null}

      {isOwner ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
          <AppButton onPress={() => router.push(`/decks/${deckId}/cards/${card.id}/edit`)}>
            Edit
          </AppButton>
          {onDelete ? (
            <AppButton background="#b00020" color="white" onPress={() => onDelete(card.id)}>
              Delete
            </AppButton>
          ) : null}
        </View>
      ) : null}
    </AppCard>
  )
}

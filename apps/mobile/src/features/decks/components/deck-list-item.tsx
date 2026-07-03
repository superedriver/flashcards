import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import type { MyDecksQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'

import { DeckStatusBadge } from './deck-status-badge'

type DeckListItemProps = {
  deck: MyDecksQuery['myDecks'][number]
}

export function DeckListItem({ deck }: DeckListItemProps) {
  const router = useRouter()

  return (
    <Pressable onPress={() => router.push(`/decks/${deck.id}`)}>
      <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
        <AppText style={{ fontSize: 18, fontWeight: '600' }}>{deck.title}</AppText>
        {deck.description ? (
          <AppText style={{ color: '#666666' }}>{deck.description}</AppText>
        ) : null}
        <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />
      </AppCard>
    </Pressable>
  )
}

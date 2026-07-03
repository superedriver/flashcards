import type { DeckQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { View } from 'react-native'

import { DeckStatusBadge } from './deck-status-badge'

type DeckHeaderProps = {
  cardCount: number
  deck: DeckQuery['deck']
}

export function DeckHeader({ cardCount, deck }: DeckHeaderProps) {
  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText style={{ fontSize: 24, fontWeight: '700' }}>{deck.title}</AppText>
      {deck.description ? <AppText style={{ color: '#666666' }}>{deck.description}</AppText> : null}
      <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />
      <AppText style={{ color: '#666666' }}>
        {cardCount} {cardCount === 1 ? 'card' : 'cards'}
      </AppText>
    </View>
  )
}

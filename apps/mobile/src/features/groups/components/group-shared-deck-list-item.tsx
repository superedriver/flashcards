import type { GroupSharedDecksQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'
import { DeckStatusBadge } from '@/features/decks/components/deck-status-badge'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

type GroupSharedDeckListItemProps = {
  deck: GroupSharedDecksQuery['groupSharedDecks'][number]
}

export function GroupSharedDeckListItem({ deck }: GroupSharedDeckListItemProps) {
  const router = useRouter()

  return (
    <Pressable onPress={() => router.push(`/decks/${deck.id}`)}>
      <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
        <AppText style={{ fontSize: 18, fontWeight: '600' }}>{deck.title}</AppText>
        <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />
      </AppCard>
    </Pressable>
  )
}

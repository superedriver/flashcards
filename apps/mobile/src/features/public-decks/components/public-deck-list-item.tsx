import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

import type { PublicDecksQuery } from '@/graphql/generated'
import { formatDate } from '@/i18n/formatters'
import { AppCard, AppText } from '@/ui/primitives'

type PublicDeckListItemProps = {
  deck: PublicDecksQuery['publicDecks']['items'][number]
}

export function PublicDeckListItem({ deck }: PublicDeckListItemProps) {
  const router = useRouter()

  return (
    <Pressable onPress={() => router.push(`/public/${deck.id}`)}>
      <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
        <AppText style={{ fontSize: 18, fontWeight: '600' }}>{deck.title}</AppText>
        {deck.isOfficial ? (
          <AppText style={{ color: '#1565c0', fontSize: 12 }}>Official</AppText>
        ) : null}
        {deck.description ? (
          <AppText style={{ color: '#666666' }}>{deck.description}</AppText>
        ) : null}
        <AppText style={{ color: '#888888', fontSize: 12 }}>
          Updated {formatDate(deck.updatedAt)}
        </AppText>
      </AppCard>
    </Pressable>
  )
}

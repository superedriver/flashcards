import { useRouter } from 'expo-router'
import { Pressable, View } from 'react-native'

import { DeckLanguageFlags } from '@/features/decks/components/deck-language-flags'
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
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          <AppText style={{ flex: 1, fontSize: 18, fontWeight: '600' }}>{deck.title}</AppText>
          <DeckLanguageFlags
            flagSize={20}
            sourceLanguage={deck.sourceLanguage}
            targetLanguage={deck.targetLanguage}
          />
        </View>
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

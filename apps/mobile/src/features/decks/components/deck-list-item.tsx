import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { DeckOrigin, type DecksPageQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'

import { DeckStatusBadge } from './deck-status-badge'

type DecksPageDeck = DecksPageQuery['decksPage']['ownDecks'][number]

type DeckListItemProps = {
  deck:
    | DecksPageDeck
    | {
        id: string
        title: string
        description?: string | null
        visibility: DecksPageDeck['visibility']
        moderationStatus: DecksPageDeck['moderationStatus']
        origin?: DeckOrigin
      }
  showOriginBadge?: boolean
}

export function DeckListItem({ deck, showOriginBadge = false }: DeckListItemProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const href = deck.origin === DeckOrigin.Public ? `/public/${deck.id}` : `/decks/${deck.id}`

  return (
    <Pressable onPress={() => router.push(href)}>
      <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
          <AppText style={{ flex: 1, fontSize: 18, fontWeight: '600' }}>{deck.title}</AppText>
          {showOriginBadge && deck.origin ? (
            <AppText
              style={{
                backgroundColor: '#eeeeee',
                borderRadius: 6,
                color: '#555555',
                fontSize: 11,
                fontWeight: '700',
                overflow: 'hidden',
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              {t(`decks.sections.origin.${deck.origin}`)}
            </AppText>
          ) : null}
        </View>
        {deck.description ? (
          <AppText style={{ color: '#666666' }}>{deck.description}</AppText>
        ) : null}
        <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />
      </AppCard>
    </Pressable>
  )
}

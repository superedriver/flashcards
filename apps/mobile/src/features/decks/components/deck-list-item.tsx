import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { DeckOrigin, type DecksPageQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

import { DeckLanguageFlags } from './deck-language-flags'
import { DeckLearningStatsCompact } from './deck-learning-stats-compact'
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
        targetLanguage?: string | null
        sourceLanguage?: string | null
      }
  layout?: 'rail' | 'fill'
  showLearningCounters?: boolean
  showOriginBadge?: boolean
}

const CARD_ACCENTS = ['#dbe7f3', '#e4efe6', '#f3e9db', '#ebe4f2', '#e8ecef'] as const

function accentForId(id: string): string {
  let hash = 0

  for (let index = 0; index < id.length; index += 1) {
    hash = (hash + id.charCodeAt(index) * (index + 1)) % CARD_ACCENTS.length
  }

  return CARD_ACCENTS[hash] ?? CARD_ACCENTS[0]
}

export function DeckListItem({
  deck,
  layout = 'rail',
  showLearningCounters = false,
  showOriginBadge = false,
}: DeckListItemProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const href = deck.origin === DeckOrigin.Public ? `/public/${deck.id}` : `/decks/${deck.id}`
  const accent = accentForId(deck.id)
  const isRail = layout === 'rail'

  return (
    <Pressable
      accessibilityRole="button"
      style={isRail ? { marginRight: 12, width: 168 } : { width: '100%' }}
      onPress={() => router.push(href)}
    >
      <View
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#d7d7d7',
          borderRadius: 12,
          borderWidth: 1,
          minHeight: 220,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            backgroundColor: accent,
            height: 96,
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          {showOriginBadge && deck.origin ? (
            <AppText
              style={{
                alignSelf: 'flex-start',
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 6,
                color: '#444444',
                fontSize: 11,
                fontWeight: '700',
                overflow: 'hidden',
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              {t(`decks.sections.origin.${deck.origin}`)}
            </AppText>
          ) : (
            <View />
          )}
          <DeckLanguageFlags
            flagSize={22}
            sourceLanguage={deck.sourceLanguage}
            targetLanguage={deck.targetLanguage}
          />
        </View>

        <View
          style={{
            flexGrow: 1,
            gap: 8,
            justifyContent: 'space-between',
            minHeight: 124,
            padding: 12,
          }}
        >
          <View style={{ gap: 8 }}>
            <AppText numberOfLines={2} style={{ fontSize: 16, fontWeight: '700', lineHeight: 20 }}>
              {deck.title}
            </AppText>
            {deck.description ? (
              <AppText numberOfLines={2} style={{ color: '#666666', fontSize: 13, lineHeight: 18 }}>
                {deck.description}
              </AppText>
            ) : null}
          </View>
          <View style={{ gap: 8 }}>
            <DeckStatusBadge
              moderationStatus={deck.moderationStatus}
              visibility={deck.visibility}
            />
            {showLearningCounters ? <DeckLearningStatsCompact deckId={deck.id} /> : null}
          </View>
        </View>
      </View>
    </Pressable>
  )
}

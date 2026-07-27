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

/** Fixed rail heights so titles/status/counters cannot stretch neighbors unevenly. */
const RAIL_CARD_HEIGHT_WITH_COUNTERS = 292
const RAIL_CARD_HEIGHT = 220
const TITLE_SLOT_HEIGHT = 40
const STATUS_SLOT_HEIGHT = 36
const COUNTERS_SLOT_HEIGHT = 72

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
  const railHeight = showLearningCounters ? RAIL_CARD_HEIGHT_WITH_COUNTERS : RAIL_CARD_HEIGHT

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
          height: isRail ? railHeight : undefined,
          minHeight: isRail ? undefined : 220,
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
            flex: isRail ? 1 : undefined,
            flexGrow: isRail ? undefined : 1,
            gap: 8,
            justifyContent: 'space-between',
            minHeight: isRail ? undefined : 124,
            padding: 12,
          }}
        >
          <View
            style={isRail ? { height: TITLE_SLOT_HEIGHT, justifyContent: 'flex-start' } : undefined}
          >
            <AppText
              ellipsizeMode="tail"
              numberOfLines={2}
              style={{ fontSize: 16, fontWeight: '700', lineHeight: 20 }}
            >
              {deck.title}
            </AppText>
          </View>
          <View style={{ gap: 8 }}>
            <View
              style={
                isRail ? { height: STATUS_SLOT_HEIGHT, justifyContent: 'flex-start' } : undefined
              }
            >
              <DeckStatusBadge
                moderationStatus={deck.moderationStatus}
                visibility={deck.visibility}
              />
            </View>
            {showLearningCounters ? (
              <View
                style={
                  isRail
                    ? { height: COUNTERS_SLOT_HEIGHT, justifyContent: 'flex-start' }
                    : undefined
                }
              >
                <DeckLearningStatsCompact deckId={deck.id} />
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  )
}

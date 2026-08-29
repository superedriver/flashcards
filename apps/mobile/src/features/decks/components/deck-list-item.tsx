import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, useWindowDimensions, View } from 'react-native'

import { DeckOrigin, type DecksPageQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { getDeckSectionGridItemStyle } from '@/ui/utils/responsive'

import { DeckLanguageFlags } from './deck-language-flags'
import { DeckLearningStatsCompact, useDeckDueCount } from './deck-learning-stats-compact'
import { DeckStartPlayButton } from './deck-start-play-button'
import { DeckStatusBadge } from './deck-status-badge'

type DecksPageDeck = DecksPageQuery['decksPage']['ownDecks'][number]

export type DeckCardSection = 'own' | 'group' | 'public' | 'noLanguage'

type DeckListItemProps = {
  deck:
    | DecksPageDeck
    | {
        id: string
        title: string
        description?: string | null
        visibility: DecksPageDeck['visibility']
        moderationStatus: DecksPageDeck['moderationStatus']
        isOfficial?: boolean
        origin?: DeckOrigin
        targetLanguage?: string | null
        sourceLanguage?: string | null
      }
  layout?: 'rail' | 'fill'
  section?: DeckCardSection
}

function CardBadge({
  deck,
  section,
}: {
  deck: DeckListItemProps['deck']
  section: DeckCardSection
}) {
  if (section === 'group') {
    return (
      <DeckStatusBadge
        moderationStatus={deck.moderationStatus}
        presentation="shared"
        visibility={deck.visibility}
      />
    )
  }

  if (section === 'public') {
    return (
      <DeckStatusBadge
        isOfficial={Boolean(deck.isOfficial)}
        moderationStatus={deck.moderationStatus}
        presentation="catalog"
        visibility={deck.visibility}
      />
    )
  }

  return (
    <DeckStatusBadge
      hideApproved
      moderationStatus={deck.moderationStatus}
      visibility={deck.visibility}
    />
  )
}

function OwnFooter({ deckId }: { deckId: string }) {
  const { t } = useTranslation()
  const dueCount = useDeckDueCount(deckId)

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
      {dueCount > 0 ? (
        <AppText style={{ color: '#1a56db', flex: 1, fontSize: 12, fontWeight: '600' }}>
          {t('decks.learningCounters.due', { count: dueCount })}
        </AppText>
      ) : (
        <View style={{ flex: 1 }} />
      )}
      <DeckStartPlayButton deckId={deckId} />
    </View>
  )
}

function ViewFooter() {
  const { t } = useTranslation()

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
      <AppText style={{ color: '#1a56db', fontSize: 13, fontWeight: '600' }}>
        {t('decks.sections.view')}
      </AppText>
    </View>
  )
}

export function DeckListItem({ deck, layout = 'rail', section = 'own' }: DeckListItemProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { width } = useWindowDimensions()

  const href = deck.origin === DeckOrigin.Public ? `/public/${deck.id}` : `/decks/${deck.id}`
  const isRail = layout === 'rail'
  const showOrigin = section === 'noLanguage' && Boolean(deck.origin)

  return (
    <View
      style={isRail ? getDeckSectionGridItemStyle(width) : { position: 'relative', width: '100%' }}
    >
      <Pressable accessibilityRole="button" onPress={() => router.push(href)}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderColor: '#e4e7ec',
            borderRadius: 12,
            borderWidth: 1,
            boxShadow: '0 1px 3px rgba(16, 24, 40, 0.08)',
            elevation: 2,
            minHeight: isRail ? undefined : 180,
            overflow: 'hidden',
            padding: 12,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: 8,
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <View
              style={{ alignItems: 'center', flex: 1, flexDirection: 'row', gap: 8, minWidth: 0 }}
            >
              {showOrigin ? (
                <AppText
                  style={{
                    backgroundColor: '#f2f4f7',
                    borderRadius: 6,
                    color: '#344054',
                    flexShrink: 0,
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
              <DeckLanguageFlags
                flagSize={18}
                sourceLanguage={deck.sourceLanguage}
                targetLanguage={deck.targetLanguage}
              />
            </View>
            <CardBadge deck={deck} section={section} />
          </View>

          <AppText
            ellipsizeMode="tail"
            numberOfLines={2}
            style={{
              fontSize: 20,
              fontWeight: '700',
              lineHeight: 24,
              marginBottom: section === 'own' ? 12 : 10,
            }}
          >
            {deck.title}
          </AppText>

          {section !== 'own' ? (
            <View style={{ backgroundColor: '#e4e7ec', height: 1, marginBottom: 10 }} />
          ) : null}

          {section === 'own' ? (
            <View style={{ gap: 12 }}>
              <DeckLearningStatsCompact deckId={deck.id} />
              <OwnFooter deckId={deck.id} />
            </View>
          ) : null}

          {section === 'group' ? (
            <View style={{ gap: 12 }}>
              <AppText style={{ color: '#667085', fontSize: 13 }}>
                {t('decks.sections.sharedHint')}
              </AppText>
              <ViewFooter />
            </View>
          ) : null}

          {section === 'public' ? <ViewFooter /> : null}

          {section === 'noLanguage' ? (
            <View style={{ gap: 12 }}>
              <AppText style={{ color: '#b54708', fontSize: 13, fontWeight: '600' }}>
                {t('decks.sections.languageNotSelected')}
              </AppText>
              <ViewFooter />
            </View>
          ) : null}
        </View>
      </Pressable>
    </View>
  )
}

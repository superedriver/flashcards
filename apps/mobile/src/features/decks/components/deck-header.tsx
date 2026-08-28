import type { ReactNode } from 'react'
import type { DeckQuery } from '@/graphql/generated'
import { DeckModerationStatus, DeckVisibility } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { DeckLanguageFlags } from './deck-language-flags'
import { DeckStatusBadge } from './deck-status-badge'

type DeckHeaderProps = {
  deck: DeckQuery['deck']
  trailing?: ReactNode
}

export function DeckHeader({ deck, trailing }: DeckHeaderProps) {
  const { t } = useTranslation()

  if (!deck) {
    return null
  }

  const isPendingPublic =
    deck.visibility === DeckVisibility.Public &&
    deck.moderationStatus === DeckModerationStatus.Pending

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <AppText style={{ flex: 1, fontSize: 24, fontWeight: '700', paddingRight: 8 }}>
          {deck.title}
        </AppText>
        {trailing}
      </View>
      <DeckLanguageFlags
        flagSize={22}
        sourceLanguage={deck.sourceLanguage}
        targetLanguage={deck.targetLanguage}
      />
      {deck.description ? <AppText style={{ color: '#666666' }}>{deck.description}</AppText> : null}
      <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />
      {isPendingPublic ? (
        <AppText style={{ color: '#ef6c00', fontSize: 14 }}>
          {t('decks.actions.pendingModeration')}
        </AppText>
      ) : null}
    </View>
  )
}

import type { DeckQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { DeckLanguageFlags } from './deck-language-flags'
import { DeckStatusBadge } from './deck-status-badge'

type DeckHeaderProps = {
  cardCount: number
  deck: DeckQuery['deck']
}

export function DeckHeader({ cardCount, deck }: DeckHeaderProps) {
  const { t } = useTranslation()

  if (!deck) {
    return null
  }

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText style={{ fontSize: 24, fontWeight: '700' }}>{deck.title}</AppText>
      <DeckLanguageFlags
        flagSize={22}
        sourceLanguage={deck.sourceLanguage}
        targetLanguage={deck.targetLanguage}
      />
      {deck.description ? <AppText style={{ color: '#666666' }}>{deck.description}</AppText> : null}
      <DeckStatusBadge moderationStatus={deck.moderationStatus} visibility={deck.visibility} />
      <AppText style={{ color: '#666666' }}>
        {t('decks.header.cardCount', { count: cardCount })}
      </AppText>
    </View>
  )
}

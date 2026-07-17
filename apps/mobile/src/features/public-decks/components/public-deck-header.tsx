import type { PublicDeckQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { DeckLanguageFlags } from '@/features/decks/components/deck-language-flags'

type PublicDeckHeaderProps = {
  cardCount: number
  deck: PublicDeckQuery['publicDeck']
}

export function PublicDeckHeader({ cardCount, deck }: PublicDeckHeaderProps) {
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
      {deck.isOfficial ? (
        <AppText style={{ color: '#1565c0' }}>{t('publicDecks.header.officialDeck')}</AppText>
      ) : null}
      {deck.description ? <AppText style={{ color: '#666666' }}>{deck.description}</AppText> : null}
      <AppText style={{ color: '#666666' }}>
        {t('publicDecks.header.cardCount', { count: cardCount })}
      </AppText>
    </View>
  )
}

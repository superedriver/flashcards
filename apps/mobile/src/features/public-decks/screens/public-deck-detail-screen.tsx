import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { PublicDeckActions } from '@/features/public-decks/components/public-deck-actions'
import { PublicDeckHeader } from '@/features/public-decks/components/public-deck-header'
import { usePublicDeckCardsQuery, usePublicDeckQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'
import { EmptyState, ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function PublicDeckDetailScreen() {
  const { t } = useTranslation()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()

  const deckQuery = usePublicDeckQuery({
    skip: !deckId,
    variables: { deckId: deckId ?? '' },
  })
  const cardsQuery = usePublicDeckCardsQuery({
    skip: !deckId,
    variables: { deckId: deckId ?? '' },
  })

  const loading = deckQuery.loading || cardsQuery.loading
  const error = deckQuery.error ?? cardsQuery.error
  const deck = deckQuery.data?.publicDeck
  const cards = cardsQuery.data?.publicDeckCards ?? []

  const handleRetry = () => {
    void Promise.all([deckQuery.refetch(), cardsQuery.refetch()])
  }

  return (
    <Screen scrollable>
      <PageTitle title={t('publicDecks.detail.title')} />

      {loading ? <LoadingState message={t('publicDecks.detail.loading')} /> : null}
      {error ? (
        <ErrorState message={t('publicDecks.detail.loadError')} onRetry={handleRetry} />
      ) : null}

      {!loading && !error && deck && deckId ? (
        <>
          <PublicDeckHeader cardCount={cards.length} deck={deck} />
          <PublicDeckActions deckId={deckId} />
          {cards.length === 0 ? (
            <EmptyState message={t('publicDecks.detail.emptyCards')} />
          ) : (
            <AppText style={{ fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
              {t('publicDecks.detail.cardsHeading')}
            </AppText>
          )}
          {cards.map((card) => (
            <AppCard key={card.id} style={{ gap: 6, marginBottom: 12, padding: 16 }}>
              <AppText style={{ color: '#888888', fontSize: 12 }}>#{card.position}</AppText>
              <AppText style={{ fontSize: 16, fontWeight: '600' }}>{card.front}</AppText>
              <AppText style={{ color: '#444444' }}>{card.back}</AppText>
              {card.example ? (
                <AppText style={{ color: '#666666' }}>
                  {t('publicDecks.detail.example', { text: card.example })}
                </AppText>
              ) : null}
            </AppCard>
          ))}
        </>
      ) : null}
    </Screen>
  )
}

import { useLocalSearchParams } from 'expo-router'

import { PublicDeckActions } from '@/features/public-decks/components/public-deck-actions'
import { PublicDeckHeader } from '@/features/public-decks/components/public-deck-header'
import { usePublicDeckCardsQuery, usePublicDeckQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function PublicDeckDetailScreen() {
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

  return (
    <Screen>
      <PageTitle title="Public Deck" />

      {loading ? <LoadingState message="Loading deck..." /> : null}
      {error ? <ErrorState message="Could not load public deck." /> : null}

      {!loading && !error && deck && deckId ? (
        <>
          <PublicDeckHeader cardCount={cards.length} deck={deck} />
          <PublicDeckActions deckId={deckId} />
          {cards.length === 0 ? (
            <AppText style={{ color: '#666666' }}>This deck has no cards.</AppText>
          ) : (
            cards.map((card) => (
              <AppText key={card.id} style={{ marginBottom: 8 }}>
                {card.position}. {card.front} — {card.back}
              </AppText>
            ))
          )}
        </>
      ) : null}
    </Screen>
  )
}

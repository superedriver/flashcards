import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'

import { CardList } from '@/features/decks/components/card-list'
import { DeckActions } from '@/features/decks/components/deck-actions'
import { DeckHeader } from '@/features/decks/components/deck-header'
import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { DeckLearningStatsCard } from '@/features/lessons/components/deck-learning-stats-card'
import { useRouter } from 'expo-router'
import { useDeckCardsQuery, useDeckQuery, useDeleteCardMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function DeckDetailScreen() {
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const { user } = useAuth()
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  const deckQuery = useDeckQuery({
    skip: !deckId,
    variables: { id: deckId ?? '' },
  })
  const cardsQuery = useDeckCardsQuery({
    skip: !deckId,
    variables: { deckId: deckId ?? '' },
  })
  const [deleteCard] = useDeleteCardMutation({
    refetchQueries: ['DeckCards'],
  })

  const loading = deckQuery.loading || cardsQuery.loading
  const error = deckQuery.error ?? cardsQuery.error
  const deck = deckQuery.data?.deck
  const cards = cardsQuery.data?.deckCards ?? []
  const isOwner = Boolean(deck && user && deck.ownerId === user.id)

  const handleRetry = () => {
    void Promise.all([deckQuery.refetch(), cardsQuery.refetch()])
  }

  const handleDeleteCard = (cardId: string) => {
    if (!deckId) {
      return
    }

    confirmDestructiveAction('Delete card', 'This card will be permanently deleted.', () => {
      void (async () => {
        setActionError(null)
        setActionFeedback(null)

        try {
          const result = await deleteCard({
            variables: { cardId },
          })

          if (!result.data?.deleteCard) {
            setActionError('Could not delete card. Please try again.')
            return
          }

          setActionFeedback('Card deleted.')
        } catch (deleteError) {
          setActionError(
            getGraphqlErrorMessage(deleteError, 'Could not delete card. Please try again.'),
          )
        }
      })()
    })
  }

  const listHeader =
    !loading && !error && deck && deckId ? (
      <>
        <DeckHeader cardCount={cards.length} deck={deck} />
        <DeckLearningStatsCard deckId={deckId} />
        <AppButton
          disabled={cards.length === 0}
          onPress={() => router.push(`/lessons/start?deckId=${deckId}`)}
        >
          Start Lesson
        </AppButton>
        <DeckActions deck={deck} isOwner={isOwner} />
      </>
    ) : null

  return (
    <Screen>
      <PageTitle title="Deck Detail" />

      {loading ? <LoadingState message="Loading deck..." /> : null}
      {error ? <ErrorState message="Could not load deck." onRetry={handleRetry} /> : null}
      {actionError ? <ErrorState message={actionError} /> : null}
      {actionFeedback ? <AppText style={{ color: '#2e7d32' }}>{actionFeedback}</AppText> : null}

      {!loading && !error && deck && deckId ? (
        <CardList
          cards={cards}
          deckId={deckId}
          emptyActionLabel="Add card"
          isOwner={isOwner}
          listHeader={listHeader}
          onDeleteCard={isOwner ? handleDeleteCard : undefined}
          onEmptyAction={isOwner ? () => router.push(`/decks/${deckId}/cards/new`) : undefined}
        />
      ) : null}
    </Screen>
  )
}

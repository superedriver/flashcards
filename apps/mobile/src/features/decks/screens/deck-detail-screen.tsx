import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CardList } from '@/features/decks/components/card-list'
import { DeckActions } from '@/features/decks/components/deck-actions'
import { DeckHeader } from '@/features/decks/components/deck-header'
import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import {
  deckNeedsLanguageAssignment,
  promptAssignLanguages,
} from '@/features/decks/utils/deck-language-gate'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { DeckLearningStatsCard } from '@/features/lessons/components/deck-learning-stats-card'
import { useRouter } from 'expo-router'
import { useDeckCardsQuery, useDeckQuery, useDeleteCardMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function DeckDetailScreen() {
  const { t } = useTranslation()
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

    confirmDestructiveAction(t('decks.card.deleteTitle'), t('decks.card.deleteMessage'), () => {
      void (async () => {
        setActionError(null)
        setActionFeedback(null)

        try {
          const result = await deleteCard({
            variables: { cardId },
          })

          if (!result.data?.deleteCard) {
            setActionError(t('decks.card.deleteError'))
            return
          }

          setActionFeedback(t('decks.card.deleted'))
        } catch (deleteError) {
          setActionError(getGraphqlErrorMessage(deleteError, t('decks.card.deleteError')))
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
          onPress={() => {
            if (deckNeedsLanguageAssignment(deck)) {
              promptAssignLanguages(() => router.push(`/decks/${deckId}/assign-languages`))
              return
            }

            router.push(`/lessons/start?deckId=${deckId}`)
          }}
        >
          {t('decks.deckDetail.startLesson')}
        </AppButton>
        <DeckActions deck={deck} isOwner={isOwner} />
      </>
    ) : null

  return (
    <Screen>
      <PageTitle title={t('decks.deckDetail.title')} />

      {loading ? <LoadingState message={t('decks.deckDetail.loading')} /> : null}
      {error ? (
        <ErrorState message={t('decks.deckDetail.loadError')} onRetry={handleRetry} />
      ) : null}
      {actionError ? <ErrorState message={actionError} /> : null}
      {actionFeedback ? <AppText style={{ color: '#2e7d32' }}>{actionFeedback}</AppText> : null}

      {!loading && !error && deck && deckId ? (
        <CardList
          cards={cards}
          deckId={deckId}
          emptyActionLabel={t('decks.deckDetail.addCard')}
          isOwner={isOwner}
          listHeader={listHeader}
          onDeleteCard={isOwner ? handleDeleteCard : undefined}
          onEmptyAction={isOwner ? () => router.push(`/decks/${deckId}/cards/new`) : undefined}
        />
      ) : null}
    </Screen>
  )
}

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'

import { CardForm } from '@/features/decks/components/card-form'
import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import {
  useDeckCardsQuery,
  useDeleteCardMutation,
  useUpdateCardMutation,
} from '@/graphql/generated'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function EditCardScreen() {
  const router = useRouter()
  const { cardId, deckId } = useLocalSearchParams<{ cardId: string; deckId: string }>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, error, loading, refetch } = useDeckCardsQuery({
    skip: !deckId,
    variables: { deckId: deckId ?? '' },
  })

  const card = useMemo(
    () => data?.deckCards.find((item) => item.id === cardId),
    [cardId, data?.deckCards],
  )

  const [updateCard, { loading: isSubmitting }] = useUpdateCardMutation({
    refetchQueries: ['DeckCards'],
  })
  const [deleteCard, { loading: isDeleting }] = useDeleteCardMutation({
    refetchQueries: ['DeckCards'],
  })

  if (loading) {
    return (
      <Screen>
        <PageTitle title="Edit Card" />
        <LoadingState message="Loading card..." />
      </Screen>
    )
  }

  if (error || !card || !deckId || !cardId) {
    return (
      <Screen>
        <PageTitle title="Edit Card" />
        <ErrorState message="Could not load card." onRetry={() => void refetch()} />
      </Screen>
    )
  }

  const handleDelete = () => {
    confirmDestructiveAction('Delete card', 'This card will be permanently deleted.', () => {
      void (async () => {
        setErrorMessage(null)

        try {
          const result = await deleteCard({
            variables: { cardId },
          })

          if (!result.data?.deleteCard) {
            setErrorMessage('Could not delete card. Please try again.')
            return
          }

          router.replace(`/decks/${deckId}`)
        } catch (deleteError) {
          setErrorMessage(
            getGraphqlErrorMessage(deleteError, 'Could not delete card. Please try again.'),
          )
        }
      })()
    })
  }

  return (
    <Screen>
      <PageTitle title="Edit Card" />
      <CardForm
        cardId={cardId}
        defaultValues={{
          back: card.back,
          example: card.example ?? '',
          front: card.front,
          notes: card.notes ?? '',
        }}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting || isDeleting}
        showDelete
        submitLabel="Save Changes"
        submittingLabel="Saving..."
        onCancel={() => router.back()}
        onClearError={() => setErrorMessage(null)}
        onDelete={handleDelete}
        onSubmit={async (values) => {
          setErrorMessage(null)

          try {
            const result = await updateCard({
              variables: {
                input: {
                  back: values.back,
                  cardId,
                  example: optionalText(values.example),
                  front: values.front,
                  notes: optionalText(values.notes),
                },
              },
            })

            if (!result.data?.updateCard) {
              setErrorMessage('Could not update card. Please try again.')
              return
            }

            router.replace(`/decks/${deckId}`)
          } catch (submitError) {
            setErrorMessage(
              getGraphqlErrorMessage(submitError, 'Could not update card. Please try again.'),
            )
          }
        }}
      />
    </Screen>
  )
}

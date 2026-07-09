import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
        <PageTitle title={t('decks.editCard.title')} />
        <LoadingState message={t('decks.editCard.loading')} />
      </Screen>
    )
  }

  if (error || !card || !deckId || !cardId) {
    return (
      <Screen>
        <PageTitle title={t('decks.editCard.title')} />
        <ErrorState message={t('decks.editCard.loadError')} onRetry={() => void refetch()} />
      </Screen>
    )
  }

  const handleDelete = () => {
    confirmDestructiveAction(t('decks.card.deleteTitle'), t('decks.card.deleteMessage'), () => {
      void (async () => {
        setErrorMessage(null)

        try {
          const result = await deleteCard({
            variables: { cardId },
          })

          if (!result.data?.deleteCard) {
            setErrorMessage(t('decks.card.deleteError'))
            return
          }

          router.replace(`/decks/${deckId}`)
        } catch (deleteError) {
          setErrorMessage(getGraphqlErrorMessage(deleteError, t('decks.card.deleteError')))
        }
      })()
    })
  }

  return (
    <Screen>
      <PageTitle title={t('decks.editCard.title')} />
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
        submitLabel={t('decks.editCard.submit')}
        submittingLabel={t('decks.editCard.submitting')}
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
              setErrorMessage(t('decks.editCard.error'))
              return
            }

            router.replace(`/decks/${deckId}`)
          } catch (submitError) {
            setErrorMessage(getGraphqlErrorMessage(submitError, t('decks.editCard.error')))
          }
        }}
      />
    </Screen>
  )
}

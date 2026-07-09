import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DeckForm } from '@/features/decks/components/deck-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { useDeckQuery, useUpdateDeckMutation } from '@/graphql/generated'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function EditDeckScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, error, loading, refetch } = useDeckQuery({
    skip: !deckId,
    variables: { id: deckId ?? '' },
  })

  const [updateDeck, { loading: isSubmitting }] = useUpdateDeckMutation({
    refetchQueries: ['MyDecks', 'Deck'],
  })

  const defaultValues = useMemo(
    () => ({
      description: data?.deck.description ?? '',
      title: data?.deck.title ?? '',
    }),
    [data?.deck.description, data?.deck.title],
  )

  if (loading) {
    return (
      <Screen>
        <PageTitle title={t('decks.editDeck.title')} />
        <LoadingState message={t('decks.editDeck.loading')} />
      </Screen>
    )
  }

  if (error || !data?.deck) {
    return (
      <Screen>
        <PageTitle title={t('decks.editDeck.title')} />
        <ErrorState message={t('decks.editDeck.loadError')} onRetry={() => void refetch()} />
      </Screen>
    )
  }

  return (
    <Screen>
      <PageTitle title={t('decks.editDeck.title')} />
      <DeckForm
        defaultValues={defaultValues}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        submitLabel={t('decks.editDeck.submit')}
        submittingLabel={t('decks.editDeck.submitting')}
        onCancel={() => router.back()}
        onClearError={() => setErrorMessage(null)}
        onSubmit={async (values) => {
          if (!deckId) {
            return
          }

          setErrorMessage(null)

          try {
            const result = await updateDeck({
              variables: {
                input: {
                  deckId,
                  description: optionalText(values.description),
                  title: values.title,
                },
              },
            })

            if (!result.data?.updateDeck) {
              setErrorMessage(t('decks.editDeck.error'))
              return
            }

            router.replace(`/decks/${deckId}`)
          } catch (submitError) {
            setErrorMessage(getGraphqlErrorMessage(submitError, t('decks.editDeck.error')))
          }
        }}
      />
    </Screen>
  )
}

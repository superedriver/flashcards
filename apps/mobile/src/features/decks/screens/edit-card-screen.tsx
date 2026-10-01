import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { CardForm } from '@/features/decks/components/card-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { getLanguageExample } from '@/features/decks/utils/language-examples'
import {
  CARD_MUTATION_REFETCH_QUERIES,
  evictCardCountCache,
} from '@/features/decks/utils/card-mutation-cache'
import {
  useDeckCardsQuery,
  useDeckQuery,
  useDeleteCardMutation,
  useLanguagesQuery,
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

  const { data: deckData } = useDeckQuery({ skip: !deckId, variables: { id: deckId ?? '' } })
  const { data: languagesData } = useLanguagesQuery()

  const flagByCode = new Map(languagesData?.languages.map((l) => [l.code, l.flag]) ?? [])

  const targetCode = deckData?.deck?.targetLanguage ?? null
  const sourceCode = deckData?.deck?.sourceLanguage ?? null
  const frontFlag = targetCode ? (flagByCode.get(targetCode) ?? undefined) : undefined
  const backFlag = sourceCode ? (flagByCode.get(sourceCode) ?? undefined) : undefined

  const frontExample = targetCode ? getLanguageExample(targetCode) : null
  const backExample = sourceCode ? getLanguageExample(sourceCode) : null
  const frontPlaceholder = frontExample
    ? t('decks.cardForm.frontPlaceholderWithExample', { example: frontExample })
    : undefined
  const backPlaceholder = backExample
    ? t('decks.cardForm.backPlaceholderWithExample', { example: backExample })
    : undefined

  const card = useMemo(
    () => data?.deckCards.find((item) => item.id === cardId),
    [cardId, data?.deckCards],
  )

  const [updateCard, { loading: isSubmitting }] = useUpdateCardMutation({
    refetchQueries: ['DeckCards'],
  })
  const [deleteCard, { loading: isDeleting }] = useDeleteCardMutation({
    awaitRefetchQueries: true,
    refetchQueries: [...CARD_MUTATION_REFETCH_QUERIES],
    update: evictCardCountCache,
  })

  if (loading) {
    return (
      <Screen scrollable>
        <View style={{ maxWidth: 640, width: '100%' }}>
          <PageTitle title={t('decks.editCard.title')} />
          <LoadingState message={t('decks.editCard.loading')} />
        </View>
      </Screen>
    )
  }

  if (error || !card || !deckId || !cardId) {
    return (
      <Screen scrollable>
        <View style={{ maxWidth: 640, width: '100%' }}>
          <PageTitle title={t('decks.editCard.title')} />
          <ErrorState message={t('decks.editCard.loadError')} onRetry={() => void refetch()} />
        </View>
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 640, width: '100%' }}>
        <PageTitle title={t('decks.editCard.title')} />
        <CardForm
          backFlag={backFlag}
          backPlaceholder={backPlaceholder}
          cardId={cardId}
          defaultValues={{
            back: card.back,
            example: card.example ?? '',
            front: card.front,
            notes: card.notes ?? '',
          }}
          errorMessage={errorMessage}
          frontFlag={frontFlag}
          frontPlaceholder={frontPlaceholder}
          isSubmitting={isSubmitting || isDeleting}
          showDelete
          submitLabel={t('decks.editCard.submit')}
          submittingLabel={t('decks.editCard.submitting')}
          onCancel={() => router.back()}
          onClearError={() => setErrorMessage(null)}
          onDelete={async () => {
            setErrorMessage(null)

            try {
              const result = await deleteCard({
                variables: { cardId },
              })

              if (!result.data?.deleteCard) {
                setErrorMessage(t('decks.card.deleteError'))
                return false
              }

              router.replace(`/decks/${deckId}`)
              return true
            } catch (deleteError) {
              setErrorMessage(getGraphqlErrorMessage(deleteError, t('decks.card.deleteError')))
              return false
            }
          }}
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
                return false
              }

              router.replace(`/decks/${deckId}`)
              return true
            } catch (submitError) {
              setErrorMessage(getGraphqlErrorMessage(submitError, t('decks.editCard.error')))
              return false
            }
          }}
        />
      </View>
    </Screen>
  )
}

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { DeckForm } from '@/features/decks/components/deck-form'
import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { DeckLanguageWarningCode, useDeckQuery, useUpdateDeckMutation } from '@/graphql/generated'
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
    refetchQueries: ['MyDecks', 'Deck', 'DecksPage'],
  })

  const defaultValues = useMemo(
    () => ({
      description: data?.deck.description ?? '',
      sourceLanguage: data?.deck.sourceLanguage ?? '',
      targetLanguage: data?.deck.targetLanguage ?? '',
      title: data?.deck.title ?? '',
    }),
    [
      data?.deck.description,
      data?.deck.sourceLanguage,
      data?.deck.targetLanguage,
      data?.deck.title,
    ],
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
    <Screen scrollable>
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

          const languagesChanged =
            values.targetLanguage !== (data.deck.targetLanguage ?? '') ||
            values.sourceLanguage !== (data.deck.sourceLanguage ?? '')

          const save = async () => {
            try {
              const result = await updateDeck({
                variables: {
                  input: {
                    deckId,
                    description: optionalText(values.description),
                    sourceLanguage: values.sourceLanguage,
                    targetLanguage: values.targetLanguage,
                    title: values.title,
                  },
                },
              })

              const payload = result.data?.updateDeck

              if (!payload?.deck) {
                setErrorMessage(t('decks.editDeck.error'))
                return
              }

              const sameLanguageWarning = payload.warnings.find(
                (warning) => warning.code === DeckLanguageWarningCode.SourceTargetSame,
              )

              if (sameLanguageWarning) {
                Alert.alert(t('decks.deckForm.sameLanguageTitle'), sameLanguageWarning.message)
              }

              router.replace(`/decks/${deckId}`)
            } catch (submitError) {
              setErrorMessage(getGraphqlErrorMessage(submitError, t('decks.editDeck.error')))
            }
          }

          if (languagesChanged) {
            confirmAction(
              t('decks.editDeck.languageChangeTitle'),
              t('decks.editDeck.languageChangeMessage'),
              () => {
                void save()
              },
            )
            return
          }

          await save()
        }}
      />
    </Screen>
  )
}

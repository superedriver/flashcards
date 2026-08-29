import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { DeckForm } from '@/features/decks/components/deck-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import {
  useAddStudyLanguageMutation,
  useDeckQuery,
  useUpdateDeckMutation,
} from '@/graphql/generated'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'
import { AppText } from '@/ui/primitives'

export function AssignDeckLanguagesScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const { nativeLanguage, studyLanguages } = useStudyLanguageContext()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, error, loading, refetch } = useDeckQuery({
    skip: !deckId,
    variables: { id: deckId ?? '' },
  })

  const [updateDeck, { loading: isSubmitting }] = useUpdateDeckMutation({
    refetchQueries: ['Deck', 'MyDecks', 'DecksPage', 'MyStudyLanguages', 'StudyLanguageBootstrap'],
  })
  const [addStudyLanguage] = useAddStudyLanguageMutation({
    refetchQueries: ['MyStudyLanguages', 'StudyLanguageBootstrap'],
  })

  const defaultValues = useMemo(
    () => ({
      description: data?.deck.description ?? '',
      sourceLanguage: data?.deck.sourceLanguage ?? nativeLanguage ?? '',
      targetLanguage: data?.deck.targetLanguage ?? '',
      title: data?.deck.title ?? '',
    }),
    [
      data?.deck.description,
      data?.deck.sourceLanguage,
      data?.deck.targetLanguage,
      data?.deck.title,
      nativeLanguage,
    ],
  )

  if (loading) {
    return (
      <Screen>
        <PageTitle title={t('decks.assignLanguages.title')} />
        <LoadingState message={t('decks.assignLanguages.loading')} />
      </Screen>
    )
  }

  if (error || !data?.deck) {
    return (
      <Screen>
        <PageTitle title={t('decks.assignLanguages.title')} />
        <ErrorState message={t('decks.assignLanguages.loadError')} onRetry={() => void refetch()} />
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 640, width: '100%' }}>
        <PageTitle title={t('decks.assignLanguages.title')} />
        <AppText style={{ color: '#666666', marginBottom: 16 }}>
          {t('decks.assignLanguages.description')}
        </AppText>
        <DeckForm
          defaultValues={defaultValues}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          submitLabel={t('decks.assignLanguages.submit')}
          submittingLabel={t('decks.assignLanguages.submitting')}
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
                    sourceLanguage: values.sourceLanguage,
                    targetLanguage: values.targetLanguage,
                    title: values.title,
                  },
                },
              })

              if (!result.data?.updateDeck?.deck) {
                setErrorMessage(t('decks.assignLanguages.error'))
                return
              }

              const alreadyStudying = studyLanguages.some(
                (item) => item.languageCode === values.targetLanguage,
              )

              if (!alreadyStudying) {
                await addStudyLanguage({
                  variables: { languageCode: values.targetLanguage },
                })
              }

              router.replace(`/decks/${deckId}`)
            } catch (submitError) {
              setErrorMessage(getGraphqlErrorMessage(submitError, t('decks.assignLanguages.error')))
            }
          }}
        />
      </View>
    </Screen>
  )
}

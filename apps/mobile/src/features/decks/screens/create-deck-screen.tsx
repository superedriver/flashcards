import { useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, View } from 'react-native'

import { DeckForm } from '@/features/decks/components/deck-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import { DeckLanguageWarningCode, useCreateDeckMutation } from '@/graphql/generated'
import { LoadingState, PageTitle, Screen } from '@/ui/components'

export function CreateDeckScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { activeTargetLanguage, loading: studyLoading, nativeLanguage } = useStudyLanguageContext()
  const [createDeck, { loading }] = useCreateDeckMutation({
    refetchQueries: ['MyDecks', 'DecksPage'],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const defaultValues = useMemo(
    () => ({
      description: '',
      sourceLanguage: nativeLanguage ?? '',
      targetLanguage: activeTargetLanguage ?? '',
      title: '',
    }),
    [activeTargetLanguage, nativeLanguage],
  )

  if (studyLoading || !activeTargetLanguage || !nativeLanguage) {
    return (
      <Screen>
        <PageTitle title={t('decks.createDeck.title')} />
        <LoadingState message={t('common.loading')} />
      </Screen>
    )
  }

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 640, width: '100%' }}>
        <PageTitle title={t('decks.createDeck.title')} />
        <DeckForm
          defaultValues={defaultValues}
          errorMessage={errorMessage}
          isSubmitting={loading}
          submitLabel={t('decks.createDeck.submit')}
          submittingLabel={t('decks.createDeck.submitting')}
          onCancel={() => router.back()}
          onClearError={() => setErrorMessage(null)}
          onSubmit={async (values) => {
            setErrorMessage(null)

            try {
              const result = await createDeck({
                variables: {
                  input: {
                    description: optionalText(values.description),
                    sourceLanguage: values.sourceLanguage,
                    targetLanguage: values.targetLanguage,
                    title: values.title,
                  },
                },
              })

              const payload = result.data?.createDeck
              const deck = payload?.deck

              if (!deck) {
                setErrorMessage(t('decks.createDeck.error'))
                return
              }

              const sameLanguageWarning = payload.warnings.find(
                (warning) => warning.code === DeckLanguageWarningCode.SourceTargetSame,
              )

              if (sameLanguageWarning) {
                Alert.alert(t('decks.deckForm.sameLanguageTitle'), sameLanguageWarning.message)
              }

              router.replace(`/decks/${deck.id}`)
            } catch (error) {
              setErrorMessage(getGraphqlErrorMessage(error, t('decks.createDeck.error')))
            }
          }}
        />
      </View>
    </Screen>
  )
}

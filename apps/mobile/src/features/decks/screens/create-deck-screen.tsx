import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DeckForm } from '@/features/decks/components/deck-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import { useCreateDeckMutation } from '@/graphql/generated'
import { PageTitle, Screen } from '@/ui/components'

export function CreateDeckScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { activeTargetLanguage, nativeLanguage } = useStudyLanguageContext()
  const [createDeck, { loading }] = useCreateDeckMutation({
    refetchQueries: ['MyDecks'],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <Screen>
      <PageTitle title={t('decks.createDeck.title')} />
      <DeckForm
        errorMessage={errorMessage}
        isSubmitting={loading}
        submitLabel={t('decks.createDeck.submit')}
        submittingLabel={t('decks.createDeck.submitting')}
        onCancel={() => router.back()}
        onClearError={() => setErrorMessage(null)}
        onSubmit={async (values) => {
          setErrorMessage(null)

          if (!activeTargetLanguage || !nativeLanguage) {
            setErrorMessage(t('decks.createDeck.error'))
            return
          }

          try {
            const result = await createDeck({
              variables: {
                input: {
                  description: optionalText(values.description),
                  title: values.title,
                  targetLanguage: activeTargetLanguage,
                  sourceLanguage: nativeLanguage,
                },
              },
            })

            const deck = result.data?.createDeck?.deck

            if (!deck) {
              setErrorMessage(t('decks.createDeck.error'))
              return
            }

            router.replace(`/decks/${deck.id}`)
          } catch (error) {
            setErrorMessage(getGraphqlErrorMessage(error, t('decks.createDeck.error')))
          }
        }}
      />
    </Screen>
  )
}

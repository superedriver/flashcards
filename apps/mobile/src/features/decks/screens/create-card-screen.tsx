import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'

import { CardForm } from '@/features/decks/components/card-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { useCreateCardMutation } from '@/graphql/generated'
import { PageTitle, Screen } from '@/ui/components'

export function CreateCardScreen() {
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId: string }>()
  const [createCard, { loading }] = useCreateCardMutation({
    refetchQueries: ['DeckCards'],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <Screen>
      <PageTitle title="Add Card" />
      <CardForm
        errorMessage={errorMessage}
        isSubmitting={loading}
        submitLabel="Create Card"
        submittingLabel="Creating card..."
        onCancel={() => router.back()}
        onClearError={() => setErrorMessage(null)}
        onSubmit={async (values) => {
          if (!deckId) {
            return
          }

          setErrorMessage(null)

          try {
            const result = await createCard({
              variables: {
                input: {
                  back: values.back,
                  deckId,
                  example: optionalText(values.example),
                  front: values.front,
                  notes: optionalText(values.notes),
                },
              },
            })

            if (!result.data?.createCard) {
              setErrorMessage('Could not create card. Please try again.')
              return
            }

            router.replace(`/decks/${deckId}`)
          } catch (error) {
            setErrorMessage(
              getGraphqlErrorMessage(error, 'Could not create card. Please try again.'),
            )
          }
        }}
      />
    </Screen>
  )
}

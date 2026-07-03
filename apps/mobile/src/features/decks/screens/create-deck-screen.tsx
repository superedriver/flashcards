import { useRouter } from 'expo-router'
import { useState } from 'react'

import { DeckForm } from '@/features/decks/components/deck-form'
import { getGraphqlErrorMessage, optionalText } from '@/features/decks/utils/deck-form-utils'
import { useCreateDeckMutation } from '@/graphql/generated'
import { PageTitle, Screen } from '@/ui/components'

export function CreateDeckScreen() {
  const router = useRouter()
  const [createDeck, { loading }] = useCreateDeckMutation({
    refetchQueries: ['MyDecks'],
  })
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <Screen>
      <PageTitle title="Create Deck" />
      <DeckForm
        errorMessage={errorMessage}
        isSubmitting={loading}
        submitLabel="Create Deck"
        onCancel={() => router.back()}
        onSubmit={async (values) => {
          setErrorMessage(null)

          try {
            const result = await createDeck({
              variables: {
                input: {
                  description: optionalText(values.description),
                  title: values.title,
                },
              },
            })

            const deck = result.data?.createDeck

            if (!deck) {
              setErrorMessage('Could not create deck. Please try again.')
              return
            }

            router.replace(`/decks/${deck.id}`)
          } catch (error) {
            setErrorMessage(
              getGraphqlErrorMessage(error, 'Could not create deck. Please try again.'),
            )
          }
        }}
      />
    </Screen>
  )
}

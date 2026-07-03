import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useCopyPublicDeckMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type PublicDeckActionsProps = {
  deckId: string
}

export function PublicDeckActions({ deckId }: PublicDeckActionsProps) {
  const router = useRouter()
  const [copyPublicDeck, { loading }] = useCopyPublicDeckMutation({
    refetchQueries: ['MyDecks'],
  })
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleCopy = () => {
    confirmDestructiveAction(
      'Copy deck',
      'This will add a copy of this public deck to your library.',
      () => {
        void (async () => {
          setErrorMessage(null)
          setFeedback(null)

          try {
            const result = await copyPublicDeck({
              variables: { sourceDeckId: deckId },
            })

            const copiedDeck = result.data?.copyPublicDeck.deck

            if (!copiedDeck) {
              setErrorMessage('Could not copy deck. Please try again.')
              return
            }

            setFeedback('Deck copied to your library.')
            router.replace(`/decks/${copiedDeck.id}`)
          } catch (error) {
            setErrorMessage(getGraphqlErrorMessage(error, 'Could not copy deck. Please try again.'))
          }
        })()
      },
    )
  }

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppButton disabled={loading} onPress={handleCopy}>
        Copy to My Decks
      </AppButton>
      {feedback ? <AppText>{feedback}</AppText> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </View>
  )
}

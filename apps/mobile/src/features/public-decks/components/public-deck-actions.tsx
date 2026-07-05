import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { View } from 'react-native'

import { confirmAction } from '@/features/decks/utils/confirm-destructive'
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
  const isCopyingRef = useRef(false)

  const handleCopy = () => {
    confirmAction('Copy deck', 'A private copy of this deck will be added to your library.', () => {
      if (isCopyingRef.current || loading) {
        return
      }

      isCopyingRef.current = true
      setErrorMessage(null)
      setFeedback(null)

      void (async () => {
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
        } finally {
          isCopyingRef.current = false
        }
      })()
    })
  }

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Copy this deck to study and edit your own private version.
      </AppText>
      <AppButton disabled={loading} onPress={handleCopy}>
        {loading ? 'Copying...' : 'Copy to My Decks'}
      </AppButton>
      {feedback ? <AppText style={{ color: '#2e7d32' }}>{feedback}</AppText> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </View>
  )
}

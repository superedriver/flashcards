import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { ShareDeckForm } from '@/features/groups/components/share-deck-form'
import { useMyDecksQuery, useShareDeckWithGroupMutation } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function ShareDeckWithGroupScreen() {
  const router = useRouter()
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, error, loading } = useMyDecksQuery()
  const [shareDeckWithGroup, { loading: isSubmitting }] = useShareDeckWithGroupMutation()

  const handleShare = async () => {
    if (!groupId || !selectedDeckId) {
      return
    }

    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await shareDeckWithGroup({
        variables: {
          input: {
            deckId: selectedDeckId,
            groupId,
          },
        },
      })

      if (!result.data?.shareDeckWithGroup.share) {
        setErrorMessage('Could not share deck with group.')
        return
      }

      setFeedback('Deck shared with group.')
      router.replace(`/groups/${groupId}`)
    } catch (shareError) {
      setErrorMessage(getGraphqlErrorMessage(shareError, 'Could not share deck with group.'))
    }
  }

  return (
    <Screen>
      <PageTitle title="Share Deck" />

      {loading ? <LoadingState message="Loading decks..." /> : null}
      {error ? <ErrorState message="Could not load decks." /> : null}

      {!loading && !error && data?.myDecks ? (
        <>
          <ShareDeckForm
            decks={data.myDecks}
            errorMessage={errorMessage}
            feedback={feedback}
            isSubmitting={isSubmitting}
            selectedDeckId={selectedDeckId}
            onSelectDeck={setSelectedDeckId}
          />
          <AppButton
            disabled={!selectedDeckId || isSubmitting || data.myDecks.length === 0}
            onPress={() => void handleShare()}
          >
            Share Selected Deck
          </AppButton>
        </>
      ) : null}
    </Screen>
  )
}

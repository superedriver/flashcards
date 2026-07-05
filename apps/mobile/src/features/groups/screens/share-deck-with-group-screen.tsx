import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { ShareDeckForm } from '@/features/groups/components/share-deck-form'
import { useMyDecksQuery, useShareDeckWithGroupMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function ShareDeckWithGroupScreen() {
  const router = useRouter()
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)

  const { data, error, loading, refetch } = useMyDecksQuery()
  const [shareDeckWithGroup, { loading: isSubmitting }] = useShareDeckWithGroupMutation()

  const handleShare = async () => {
    if (!groupId || !selectedDeckId) {
      return
    }

    if (isSubmittingRef.current || isSubmitting) {
      return
    }

    isSubmittingRef.current = true
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
    } finally {
      isSubmittingRef.current = false
    }
  }

  return (
    <Screen scrollable>
      <PageTitle title="Share Deck" />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        Choose one of your decks to share with this group. Members get view-only access.
      </AppText>

      {loading ? <LoadingState message="Loading decks..." /> : null}
      {error ? <ErrorState message="Could not load decks." onRetry={() => void refetch()} /> : null}

      {!loading && !error && data?.myDecks ? (
        <>
          <ShareDeckForm
            decks={data.myDecks}
            errorMessage={errorMessage}
            feedback={feedback}
            onCreateDeck={() => router.push('/decks/new')}
            selectedDeckId={selectedDeckId}
            onSelectDeck={setSelectedDeckId}
          />
          <AppButton
            disabled={!selectedDeckId || isSubmitting || data.myDecks.length === 0}
            onPress={() => void handleShare()}
          >
            {isSubmitting ? 'Sharing...' : 'Share selected deck'}
          </AppButton>
        </>
      ) : null}
    </Screen>
  )
}

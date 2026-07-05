import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { View } from 'react-native'

import { confirmAction, confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { getDeckStatusSummary } from '@/features/decks/utils/format-deck-status'
import type { DeckQuery } from '@/graphql/generated'
import {
  DeckModerationStatus,
  DeckVisibility,
  useDeleteDeckMutation,
  usePublishDeckMutation,
  useUnpublishDeckMutation,
} from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'
import { destructiveButtonA11yProps } from '@/ui/utils/accessibility'

type DeckActionsProps = {
  deck: NonNullable<DeckQuery['deck']>
  isOwner: boolean
}

export function DeckActions({ deck, isOwner }: DeckActionsProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const isPublishingRef = useRef(false)

  const [deleteDeck, { loading: isDeleting }] = useDeleteDeckMutation({
    refetchQueries: ['MyDecks'],
  })
  const [publishDeck, { loading: isPublishing }] = usePublishDeckMutation({
    refetchQueries: ['Deck', 'MyDecks'],
  })
  const [unpublishDeck, { loading: isUnpublishing }] = useUnpublishDeckMutation({
    refetchQueries: ['Deck', 'MyDecks'],
  })

  const isBusy = isDeleting || isPublishing || isUnpublishing

  if (!isOwner) {
    return null
  }

  const handleDelete = () => {
    confirmDestructiveAction(
      'Delete deck',
      'This will permanently delete the deck and its cards.',
      () => {
        void (async () => {
          setActionError(null)
          setFeedback(null)

          try {
            const result = await deleteDeck({
              variables: { deckId: deck.id },
            })

            if (!result.data?.deleteDeck) {
              setActionError('Could not delete deck. Please try again.')
              return
            }

            router.replace('/(tabs)/decks')
          } catch (error) {
            setActionError(
              getGraphqlErrorMessage(error, 'Could not delete deck. Please try again.'),
            )
          }
        })()
      },
    )
  }

  const handlePublish = () => {
    if (isPublishingRef.current || isPublishing) {
      return
    }

    isPublishingRef.current = true
    setActionError(null)
    setFeedback(null)

    void (async () => {
      try {
        const result = await publishDeck({
          variables: { deckId: deck.id },
        })

        if (!result.data?.publishDeck) {
          setActionError('Could not publish deck. Please try again.')
          return
        }

        setFeedback('Deck submitted for moderation. It will appear publicly once approved.')
      } catch (error) {
        setActionError(getGraphqlErrorMessage(error, 'Could not publish deck. Please try again.'))
      } finally {
        isPublishingRef.current = false
      }
    })()
  }

  const handleUnpublish = () => {
    confirmAction(
      'Unpublish deck',
      'Your deck will become private and will no longer appear in public search.',
      () => {
        void (async () => {
          setActionError(null)
          setFeedback(null)

          try {
            const result = await unpublishDeck({
              variables: { deckId: deck.id },
            })

            if (!result.data?.unpublishDeck) {
              setActionError('Could not unpublish deck. Please try again.')
              return
            }

            setFeedback('Deck is now private.')
          } catch (error) {
            setActionError(
              getGraphqlErrorMessage(error, 'Could not unpublish deck. Please try again.'),
            )
          }
        })()
      },
    )
  }

  const isPrivate = deck.visibility === DeckVisibility.Private
  const isPendingPublic =
    deck.visibility === DeckVisibility.Public &&
    deck.moderationStatus === DeckModerationStatus.Pending

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText style={{ color: '#666666' }}>
        Status: {getDeckStatusSummary(deck.visibility, deck.moderationStatus)}
      </AppText>

      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/edit`)}>
        Edit Deck
      </AppButton>
      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/cards/new`)}>
        Add Card
      </AppButton>
      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/import-csv`)}>
        Import CSV
      </AppButton>

      {isPrivate ? (
        <AppButton disabled={isBusy} onPress={handlePublish}>
          {isPublishing ? 'Publishing...' : 'Publish Deck'}
        </AppButton>
      ) : (
        <AppButton disabled={isBusy} onPress={handleUnpublish}>
          {isUnpublishing ? 'Unpublishing...' : 'Unpublish Deck'}
        </AppButton>
      )}

      {isPendingPublic ? (
        <AppText style={{ color: '#ef6c00', fontSize: 14 }}>
          This deck is awaiting moderation before it appears in public search.
        </AppText>
      ) : null}

      <AppButton
        {...destructiveButtonA11yProps('Delete deck')}
        background="#b00020"
        color="white"
        disabled={isBusy}
        onPress={handleDelete}
      >
        {isDeleting ? 'Deleting...' : 'Delete Deck'}
      </AppButton>

      {feedback ? <AppText style={{ color: '#2e7d32' }}>{feedback}</AppText> : null}
      {actionError ? <ErrorState message={actionError} /> : null}
    </View>
  )
}

import { useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import type { DeckQuery } from '@/graphql/generated'
import {
  DeckVisibility,
  useDeleteDeckMutation,
  usePublishDeckMutation,
  useUnpublishDeckMutation,
} from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type DeckActionsProps = {
  deck: NonNullable<DeckQuery['deck']>
  isOwner: boolean
}

export function DeckActions({ deck, isOwner }: DeckActionsProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

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
    confirmDestructiveAction(
      'Publish deck',
      'Your deck will become public after moderation.',
      () => {
        void (async () => {
          setActionError(null)
          setFeedback(null)

          try {
            const result = await publishDeck({
              variables: { deckId: deck.id },
            })

            if (!result.data?.publishDeck) {
              setActionError('Could not publish deck. Please try again.')
              return
            }

            setFeedback('Deck published.')
          } catch (error) {
            setActionError(
              getGraphqlErrorMessage(error, 'Could not publish deck. Please try again.'),
            )
          }
        })()
      },
    )
  }

  const handleUnpublish = () => {
    confirmDestructiveAction('Unpublish deck', 'Your deck will become private again.', () => {
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

          setFeedback('Deck unpublished.')
        } catch (error) {
          setActionError(
            getGraphqlErrorMessage(error, 'Could not unpublish deck. Please try again.'),
          )
        }
      })()
    })
  }

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/edit`)}>
        Edit Deck
      </AppButton>
      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/cards/new`)}>
        Add Card
      </AppButton>

      {deck.visibility === DeckVisibility.Private ? (
        <AppButton disabled={isBusy} onPress={handlePublish}>
          Publish Deck
        </AppButton>
      ) : (
        <AppButton disabled={isBusy} onPress={handleUnpublish}>
          Unpublish Deck
        </AppButton>
      )}

      <AppButton background="#b00020" color="white" disabled={isBusy} onPress={handleDelete}>
        Delete Deck
      </AppButton>

      {feedback ? <AppText>{feedback}</AppText> : null}
      {actionError ? <ErrorState message={actionError} /> : null}
    </View>
  )
}

import { useState } from 'react'

import { confirmAction, confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { ModerationDeckList } from '@/features/admin/components/moderation-deck-list'
import { ModerationStatusFilter } from '@/features/admin/components/moderation-status-filter'
import { getForbiddenMessage, isForbiddenError } from '@/features/admin/utils/is-forbidden-error'
import {
  DeckModerationStatus,
  useApproveDeckMutation,
  useHideDeckMutation,
  useModerationQueueQuery,
  useRejectDeckMutation,
  useSetOfficialDeckMutation,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function ModerationQueueScreen() {
  const [status, setStatus] = useState<DeckModerationStatus | null>(DeckModerationStatus.Pending)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, error, loading, refetch } = useModerationQueueQuery({
    variables: {
      input: status ? { status } : undefined,
    },
  })

  const [approveDeck, { loading: isApproving }] = useApproveDeckMutation()
  const [rejectDeck, { loading: isRejecting }] = useRejectDeckMutation()
  const [hideDeck, { loading: isHiding }] = useHideDeckMutation()
  const [setOfficialDeck, { loading: isSettingOfficial }] = useSetOfficialDeckMutation()

  const isSubmitting = isApproving || isRejecting || isHiding || isSettingOfficial

  const runMutation = async (
    action: () => Promise<void>,
    successMessage: string,
    failureMessage: string,
  ) => {
    setErrorMessage(null)
    setFeedback(null)

    try {
      await action()
      setFeedback(successMessage)
      await refetch()
    } catch (mutationError) {
      setErrorMessage(getGraphqlErrorMessage(mutationError, failureMessage))
    }
  }

  const handleApprove = (deckId: string) => {
    confirmAction(
      'Approve deck',
      'This deck will be approved and visible in public search.',
      () => {
        void runMutation(
          async () => {
            const result = await approveDeck({ variables: { deckId } })

            if (!result.data?.approveDeck) {
              throw new Error('Could not approve deck.')
            }
          },
          'Deck approved.',
          'Could not approve deck.',
        )
      },
    )
  }

  const handleReject = (deckId: string) => {
    confirmDestructiveAction(
      'Reject deck',
      'This deck will be rejected and removed from the public moderation queue.',
      () => {
        void runMutation(
          async () => {
            const result = await rejectDeck({ variables: { deckId } })

            if (!result.data?.rejectDeck) {
              throw new Error('Could not reject deck.')
            }
          },
          'Deck rejected.',
          'Could not reject deck.',
        )
      },
    )
  }

  const handleHide = (deckId: string) => {
    confirmDestructiveAction('Hide deck', 'This deck will be hidden from public view.', () => {
      void runMutation(
        async () => {
          const result = await hideDeck({ variables: { deckId } })

          if (!result.data?.hideDeck) {
            throw new Error('Could not hide deck.')
          }
        },
        'Deck hidden.',
        'Could not hide deck.',
      )
    })
  }

  const handleToggleOfficial = (deckId: string, isOfficial: boolean) => {
    const title = isOfficial ? 'Mark as official deck' : 'Remove official status'
    const message = isOfficial
      ? 'This deck will be highlighted as an official curated deck.'
      : 'This deck will no longer be marked as official.'

    confirmAction(title, message, () => {
      void runMutation(
        async () => {
          const result = await setOfficialDeck({
            variables: { deckId, isOfficial },
          })

          if (!result.data?.setOfficialDeck) {
            throw new Error('Could not update official status.')
          }
        },
        isOfficial ? 'Deck marked as official.' : 'Official status removed.',
        'Could not update official status.',
      )
    })
  }

  const queryErrorMessage = error
    ? isForbiddenError(error)
      ? getForbiddenMessage()
      : 'Could not load moderation queue.'
    : null

  return (
    <Screen scrollable>
      <PageTitle title="Moderation Queue" />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        Review public decks awaiting moderation. Actions are enforced on the server.
      </AppText>
      <ModerationStatusFilter value={status} onChange={setStatus} />

      {loading ? <LoadingState message="Loading moderation queue..." /> : null}
      {queryErrorMessage ? (
        <ErrorState
          message={queryErrorMessage}
          onRetry={isForbiddenError(error) ? undefined : () => void refetch()}
        />
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {feedback ? (
        <AppText style={{ color: '#2e7d32', fontWeight: '600' }}>{feedback}</AppText>
      ) : null}

      {!loading && !error && data?.moderationQueue ? (
        <ModerationDeckList
          decks={data.moderationQueue.items}
          isSubmitting={isSubmitting}
          onApprove={handleApprove}
          onHide={handleHide}
          onReject={handleReject}
          onToggleOfficial={handleToggleOfficial}
        />
      ) : null}
    </Screen>
  )
}

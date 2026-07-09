import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
      t('admin.moderation.approveConfirmTitle'),
      t('admin.moderation.approveConfirmMessage'),
      () => {
        void runMutation(
          async () => {
            const result = await approveDeck({ variables: { deckId } })

            if (!result.data?.approveDeck) {
              throw new Error(t('admin.moderation.approveError'))
            }
          },
          t('admin.moderation.approveSuccess'),
          t('admin.moderation.approveError'),
        )
      },
    )
  }

  const handleReject = (deckId: string) => {
    confirmDestructiveAction(
      t('admin.moderation.rejectConfirmTitle'),
      t('admin.moderation.rejectConfirmMessage'),
      () => {
        void runMutation(
          async () => {
            const result = await rejectDeck({ variables: { deckId } })

            if (!result.data?.rejectDeck) {
              throw new Error(t('admin.moderation.rejectError'))
            }
          },
          t('admin.moderation.rejectSuccess'),
          t('admin.moderation.rejectError'),
        )
      },
    )
  }

  const handleHide = (deckId: string) => {
    confirmDestructiveAction(
      t('admin.moderation.hideConfirmTitle'),
      t('admin.moderation.hideConfirmMessage'),
      () => {
        void runMutation(
          async () => {
            const result = await hideDeck({ variables: { deckId } })

            if (!result.data?.hideDeck) {
              throw new Error(t('admin.moderation.hideError'))
            }
          },
          t('admin.moderation.hideSuccess'),
          t('admin.moderation.hideError'),
        )
      },
    )
  }

  const handleToggleOfficial = (deckId: string, isOfficial: boolean) => {
    const title = isOfficial
      ? t('admin.moderation.markOfficialConfirmTitle')
      : t('admin.moderation.removeOfficialConfirmTitle')
    const message = isOfficial
      ? t('admin.moderation.markOfficialConfirmMessage')
      : t('admin.moderation.removeOfficialConfirmMessage')

    confirmAction(title, message, () => {
      void runMutation(
        async () => {
          const result = await setOfficialDeck({
            variables: { deckId, isOfficial },
          })

          if (!result.data?.setOfficialDeck) {
            throw new Error(t('admin.moderation.officialStatusError'))
          }
        },
        isOfficial
          ? t('admin.moderation.markOfficialSuccess')
          : t('admin.moderation.removeOfficialSuccess'),
        t('admin.moderation.officialStatusError'),
      )
    })
  }

  const queryErrorMessage = error
    ? isForbiddenError(error)
      ? getForbiddenMessage()
      : t('admin.moderation.loadError')
    : null

  return (
    <Screen scrollable>
      <PageTitle title={t('profile.moderationQueue')} />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        {t('admin.moderation.subtitle')}
      </AppText>
      <ModerationStatusFilter value={status} onChange={setStatus} />

      {loading ? <LoadingState message={t('admin.moderation.loading')} /> : null}
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

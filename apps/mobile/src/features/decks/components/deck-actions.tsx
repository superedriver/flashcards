import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      t('decks.actions.deleteDeckTitle'),
      t('decks.actions.deleteDeckMessage'),
      () => {
        void (async () => {
          setActionError(null)
          setFeedback(null)

          try {
            const result = await deleteDeck({
              variables: { deckId: deck.id },
            })

            if (!result.data?.deleteDeck) {
              setActionError(t('decks.actions.deleteDeckError'))
              return
            }

            router.replace('/(tabs)/decks')
          } catch (error) {
            setActionError(getGraphqlErrorMessage(error, t('decks.actions.deleteDeckError')))
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
          setActionError(t('decks.actions.publishError'))
          return
        }

        setFeedback(t('decks.actions.publishSuccess'))
      } catch (error) {
        setActionError(getGraphqlErrorMessage(error, t('decks.actions.publishError')))
      } finally {
        isPublishingRef.current = false
      }
    })()
  }

  const handleUnpublish = () => {
    confirmAction(t('decks.actions.unpublishTitle'), t('decks.actions.unpublishMessage'), () => {
      void (async () => {
        setActionError(null)
        setFeedback(null)

        try {
          const result = await unpublishDeck({
            variables: { deckId: deck.id },
          })

          if (!result.data?.unpublishDeck) {
            setActionError(t('decks.actions.unpublishError'))
            return
          }

          setFeedback(t('decks.actions.unpublishSuccess'))
        } catch (error) {
          setActionError(getGraphqlErrorMessage(error, t('decks.actions.unpublishError')))
        }
      })()
    })
  }

  const isPrivate = deck.visibility === DeckVisibility.Private
  const isPendingPublic =
    deck.visibility === DeckVisibility.Public &&
    deck.moderationStatus === DeckModerationStatus.Pending

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText style={{ color: '#666666' }}>
        {t('decks.actions.status', {
          status: getDeckStatusSummary(deck.visibility, deck.moderationStatus),
        })}
      </AppText>

      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/edit`)}>
        {t('decks.actions.editDeck')}
      </AppButton>
      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/cards/new`)}>
        {t('decks.actions.addCard')}
      </AppButton>
      <AppButton disabled={isBusy} onPress={() => router.push(`/decks/${deck.id}/import-csv`)}>
        {t('decks.actions.importCsv')}
      </AppButton>

      {isPrivate ? (
        <AppButton disabled={isBusy} onPress={handlePublish}>
          {isPublishing ? t('decks.actions.publishing') : t('decks.actions.publish')}
        </AppButton>
      ) : (
        <AppButton disabled={isBusy} onPress={handleUnpublish}>
          {isUnpublishing ? t('decks.actions.unpublishing') : t('decks.actions.unpublish')}
        </AppButton>
      )}

      {isPendingPublic ? (
        <AppText style={{ color: '#ef6c00', fontSize: 14 }}>
          {t('decks.actions.pendingModeration')}
        </AppText>
      ) : null}

      <AppButton
        {...destructiveButtonA11yProps(t('decks.actions.deleteDeckTitle'))}
        background="#b00020"
        color="white"
        disabled={isBusy}
        onPress={handleDelete}
      >
        {isDeleting ? t('decks.actions.deleting') : t('decks.actions.deleteDeck')}
      </AppButton>

      {feedback ? <AppText style={{ color: '#2e7d32' }}>{feedback}</AppText> : null}
      {actionError ? <ErrorState message={actionError} /> : null}
    </View>
  )
}

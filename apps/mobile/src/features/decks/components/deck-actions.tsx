import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import {
  deckNeedsLanguageAssignment,
  promptAssignLanguages,
} from '@/features/decks/utils/deck-language-gate'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { GroupDeckCopyActions } from '@/features/study-languages/components/group-deck-copy-actions'
import type { DeckQuery } from '@/graphql/generated'
import { useDeleteDeckMutation } from '@/graphql/generated'
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
  const [actionError, setActionError] = useState<string | null>(null)

  const [deleteDeck, { loading: isDeleting }] = useDeleteDeckMutation({
    refetchQueries: ['MyDecks', 'DecksPage'],
  })

  const needsLanguages = deckNeedsLanguageAssignment(deck)

  const goAssignLanguages = () => {
    router.push(`/decks/${deck.id}/assign-languages`)
  }

  if (!isOwner) {
    return <GroupDeckCopyActions deck={deck} />
  }

  const handleDelete = () => {
    confirmDestructiveAction(
      t('decks.actions.deleteDeckTitle'),
      t('decks.actions.deleteDeckMessage'),
      () => {
        void (async () => {
          setActionError(null)

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

  return (
    <View style={{ gap: 16, marginBottom: 16 }}>
      {needsLanguages ? (
        <AppButton disabled={isDeleting} onPress={goAssignLanguages}>
          {t('decks.assignLanguages.cta')}
        </AppButton>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <AppButton disabled={isDeleting} onPress={() => router.push(`/decks/${deck.id}/edit`)}>
            {t('decks.actions.editDeck')}
          </AppButton>
        </View>
        <View style={{ flex: 1 }}>
          <AppButton
            disabled={isDeleting}
            onPress={() => {
              if (needsLanguages) {
                promptAssignLanguages(goAssignLanguages)
                return
              }

              router.push(`/decks/${deck.id}/cards/new`)
            }}
          >
            {t('decks.actions.addCard')}
          </AppButton>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <AppText style={{ color: '#666666', fontSize: 14, fontWeight: '600' }}>
          {t('decks.actions.dangerZone')}
        </AppText>
        <AppButton
          {...destructiveButtonA11yProps(t('decks.actions.deleteDeckTitle'))}
          background="#b00020"
          color="white"
          disabled={isDeleting}
          onPress={handleDelete}
        >
          {isDeleting ? t('decks.actions.deleting') : t('decks.actions.deleteDeck')}
        </AppButton>
      </View>

      {actionError ? <ErrorState message={actionError} /> : null}
    </View>
  )
}

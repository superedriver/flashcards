import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { DeckMoreMenu } from '@/features/decks/components/deck-more-menu'
import { confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { deckNeedsLanguageAssignment } from '@/features/decks/utils/deck-language-gate'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { GroupDeckCopyActions } from '@/features/study-languages/components/group-deck-copy-actions'
import type { DeckQuery } from '@/graphql/generated'
import { useDeleteDeckMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'
import { buttonA11yProps, destructiveButtonA11yProps } from '@/ui/utils/accessibility'

type DeckActionsProps = {
  deck: NonNullable<DeckQuery['deck']>
  isOwner: boolean
}

const ICON_BUTTON_STYLE = {
  alignItems: 'center' as const,
  height: 36,
  justifyContent: 'center' as const,
  width: 36,
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
        <Pressable
          {...buttonA11yProps(t('decks.actions.editDeck'))}
          disabled={isDeleting}
          hitSlop={8}
          style={ICON_BUTTON_STYLE}
          onPress={() => router.push(`/decks/${deck.id}/edit`)}
        >
          <Ionicons color="#333333" name="create-outline" size={22} />
        </Pressable>
        <DeckMoreMenu deck={deck} />
      </View>

      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#fdecea',
          borderColor: '#f5c2c7',
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <AppText
          style={{ color: '#b00020', flex: 1, fontSize: 14, fontWeight: '600', paddingRight: 8 }}
        >
          {t('decks.actions.dangerZone')}
        </AppText>
        <Pressable
          {...destructiveButtonA11yProps(t('decks.actions.deleteDeckTitle'))}
          disabled={isDeleting}
          style={{
            alignItems: 'center',
            backgroundColor: '#b00020',
            borderRadius: 8,
            flexDirection: 'row',
            gap: 6,
            opacity: isDeleting ? 0.6 : 1,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          onPress={handleDelete}
        >
          <Ionicons color="#ffffff" name="trash-outline" size={18} />
          <AppText style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>
            {isDeleting ? t('decks.actions.deleting') : t('decks.actions.deleteDeck')}
          </AppText>
        </Pressable>
      </View>

      {actionError ? <ErrorState message={actionError} /> : null}
    </View>
  )
}

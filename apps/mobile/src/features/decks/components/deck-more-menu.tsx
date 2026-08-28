import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Modal, Platform, Pressable, View } from 'react-native'

import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import {
  deckNeedsLanguageAssignment,
  promptAssignLanguages,
} from '@/features/decks/utils/deck-language-gate'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { isPreviewSessionActiveError } from '@/features/study-languages/utils/deck-preview-utils'
import type { DeckQuery } from '@/graphql/generated'
import {
  DeckVisibility,
  usePublishDeckMutation,
  useStartDeckRegeneratePreviewMutation,
  useUnpublishDeckMutation,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type DeckMoreMenuProps = {
  deck: NonNullable<DeckQuery['deck']>
}

type MenuItem = {
  disabled?: boolean
  label: string
  onPress: () => void
}

const MORE_ACTIONS_ENABLED = false

function notify(message: string): void {
  if (Platform.OS === 'web') {
    globalThis.alert(message)
    return
  }

  Alert.alert(message)
}

export function DeckMoreMenu({ deck }: DeckMoreMenuProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const isPublishingRef = useRef(false)

  const [publishDeck, { loading: isPublishing }] = usePublishDeckMutation({
    refetchQueries: ['Deck', 'MyDecks', 'DecksPage'],
  })
  const [unpublishDeck, { loading: isUnpublishing }] = useUnpublishDeckMutation({
    refetchQueries: ['Deck', 'MyDecks', 'DecksPage'],
  })
  const [startRegenerate, { loading: isRegenerating }] = useStartDeckRegeneratePreviewMutation({
    refetchQueries: ['ActiveDeckPreview'],
  })

  const isBusy = isPublishing || isUnpublishing || isRegenerating
  const needsLanguages = deckNeedsLanguageAssignment(deck)
  const isPrivate = deck.visibility === DeckVisibility.Private

  const goAssignLanguages = () => {
    setOpen(false)
    router.push(`/decks/${deck.id}/assign-languages`)
  }

  async function runRegenerate(discardActive = false) {
    if (!deck.sourceLanguage) {
      return
    }

    try {
      const result = await startRegenerate({
        variables: {
          input: {
            sourceDeckId: deck.id,
            chosenSourceLanguage: deck.sourceLanguage,
            discardActive,
          },
        },
      })

      const session = result.data?.startDeckRegeneratePreview

      if (!session) {
        notify(t('studyLanguages.preview.startError'))
        return
      }

      router.push(`/preview/${session.id}`)
    } catch (error) {
      if (isPreviewSessionActiveError(error)) {
        confirmAction(
          t('studyLanguages.preview.activeConflictTitle'),
          t('studyLanguages.preview.activeConflictMessage'),
          () => {
            void runRegenerate(true)
          },
        )
        return
      }

      notify(getGraphqlErrorMessage(error, t('studyLanguages.preview.startError')))
    }
  }

  const handlePublish = () => {
    if (needsLanguages) {
      promptAssignLanguages(goAssignLanguages)
      return
    }

    if (isPublishingRef.current || isPublishing) {
      return
    }

    isPublishingRef.current = true

    void (async () => {
      try {
        const result = await publishDeck({
          variables: { deckId: deck.id },
        })

        if (!result.data?.publishDeck) {
          notify(t('decks.actions.publishError'))
          return
        }

        notify(t('decks.actions.publishSuccess'))
      } catch (error) {
        notify(getGraphqlErrorMessage(error, t('decks.actions.publishError')))
      } finally {
        isPublishingRef.current = false
      }
    })()
  }

  const handleUnpublish = () => {
    confirmAction(t('decks.actions.unpublishTitle'), t('decks.actions.unpublishMessage'), () => {
      void (async () => {
        try {
          const result = await unpublishDeck({
            variables: { deckId: deck.id },
          })

          if (!result.data?.unpublishDeck) {
            notify(t('decks.actions.unpublishError'))
            return
          }

          notify(t('decks.actions.unpublishSuccess'))
        } catch (error) {
          notify(getGraphqlErrorMessage(error, t('decks.actions.unpublishError')))
        }
      })()
    })
  }

  const items: MenuItem[] = [
    {
      disabled: !MORE_ACTIONS_ENABLED || isBusy,
      label: t('decks.actions.importCsv'),
      onPress: () => {
        if (needsLanguages) {
          promptAssignLanguages(goAssignLanguages)
          return
        }

        router.push(`/decks/${deck.id}/import-csv`)
      },
    },
  ]

  if (!needsLanguages && deck.sourceLanguage) {
    items.push({
      disabled: !MORE_ACTIONS_ENABLED || isBusy,
      label: isRegenerating
        ? t('studyLanguages.preview.regenerating')
        : t('studyLanguages.preview.regenerate'),
      onPress: () => {
        confirmAction(
          t('studyLanguages.preview.regenerateConfirmTitle'),
          t('studyLanguages.preview.regenerateConfirmMessage'),
          () => {
            void runRegenerate()
          },
        )
      },
    })
  }

  items.push({
    disabled: !MORE_ACTIONS_ENABLED || isBusy,
    label: isPrivate
      ? isPublishing
        ? t('decks.actions.publishing')
        : t('decks.actions.publish')
      : isUnpublishing
        ? t('decks.actions.unpublishing')
        : t('decks.actions.unpublish'),
    onPress: isPrivate ? handlePublish : handleUnpublish,
  })

  return (
    <View>
      <Pressable
        accessibilityLabel={t('decks.actions.moreA11y')}
        accessibilityRole="button"
        hitSlop={8}
        style={{
          alignItems: 'center',
          height: 36,
          justifyContent: 'center',
          width: 36,
        }}
        onPress={() => setOpen(true)}
      >
        <Ionicons color="#333333" name="ellipsis-horizontal" size={22} />
      </Pressable>

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityRole="button"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            flex: 1,
            justifyContent: 'flex-end',
            padding: 16,
          }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              overflow: 'hidden',
              paddingVertical: 8,
            }}
            onPress={(event) => event.stopPropagation()}
          >
            {items.map((item) => (
              <Pressable
                accessibilityRole="button"
                disabled={item.disabled}
                key={item.label}
                style={{ paddingHorizontal: 16, paddingVertical: 14 }}
                onPress={() => {
                  if (item.disabled) {
                    return
                  }

                  setOpen(false)
                  item.onPress()
                }}
              >
                <AppText style={{ color: item.disabled ? '#999999' : '#111111', fontSize: 16 }}>
                  {item.label}
                </AppText>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="button"
              style={{ paddingHorizontal: 16, paddingVertical: 14 }}
              onPress={() => setOpen(false)}
            >
              <AppText style={{ color: '#666666', fontSize: 16 }}>{t('common.cancel')}</AppText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

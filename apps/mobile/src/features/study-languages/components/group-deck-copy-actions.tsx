import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Platform, View } from 'react-native'

import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import { isPreviewSessionActiveError } from '@/features/study-languages/utils/deck-preview-utils'
import type { DeckQuery } from '@/graphql/generated'
import { useCopyGroupDeckMutation, useStartGroupDeckCopyPreviewMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type GroupDeckCopyActionsProps = {
  deck: NonNullable<DeckQuery['deck']>
}

export function GroupDeckCopyActions({ deck }: GroupDeckCopyActionsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { nativeLanguage } = useStudyLanguageContext()
  const [copyGroupDeck, { loading: copying }] = useCopyGroupDeckMutation({
    refetchQueries: ['MyDecks', 'DecksPage'],
  })
  const [startPreview, { loading: startingPreview }] = useStartGroupDeckCopyPreviewMutation({
    refetchQueries: ['ActiveDeckPreview'],
  })
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isCopyingRef = useRef(false)
  const busy = copying || startingPreview

  async function runCopyOneToOne() {
    if (isCopyingRef.current || busy) {
      return
    }

    isCopyingRef.current = true
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await copyGroupDeck({
        variables: { sourceDeckId: deck.id },
      })
      const copiedDeck = result.data?.copyGroupDeck.deck

      if (!copiedDeck) {
        setErrorMessage(t('studyLanguages.groupCopy.copyError'))
        return
      }

      setFeedback(t('studyLanguages.groupCopy.copySuccess'))
      router.replace(`/decks/${copiedDeck.id}`)
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('studyLanguages.groupCopy.copyError')))
    } finally {
      isCopyingRef.current = false
    }
  }

  async function runPreview(chosenSourceLanguage: string, discardActive = false) {
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await startPreview({
        variables: {
          input: {
            sourceDeckId: deck.id,
            chosenSourceLanguage,
            discardActive,
          },
        },
      })
      const session = result.data?.startGroupDeckCopyPreview

      if (!session) {
        setErrorMessage(t('studyLanguages.preview.startError'))
        return
      }

      router.push(`/preview/${session.id}`)
    } catch (error) {
      if (isPreviewSessionActiveError(error)) {
        confirmAction(
          t('studyLanguages.preview.activeConflictTitle'),
          t('studyLanguages.preview.activeConflictMessage'),
          () => {
            void runPreview(chosenSourceLanguage, true)
          },
        )
        return
      }

      setErrorMessage(getGraphqlErrorMessage(error, t('studyLanguages.preview.startError')))
    }
  }

  const handleCopyWithChoice = () => {
    const originalSource = deck.sourceLanguage
    const canChooseNative =
      Boolean(nativeLanguage) && Boolean(originalSource) && nativeLanguage !== originalSource

    if (!canChooseNative || !nativeLanguage || !originalSource) {
      confirmAction(
        t('studyLanguages.groupCopy.copyTitle'),
        t('studyLanguages.groupCopy.copyMessage'),
        () => {
          void runCopyOneToOne()
        },
      )
      return
    }

    if (Platform.OS === 'web') {
      const keep = globalThis.confirm(
        `${t('studyLanguages.preview.copySourceTitle')}\n\n${t(
          'studyLanguages.preview.copySourceKeepMessage',
        )}`,
      )

      if (keep) {
        void runCopyOneToOne()
        return
      }

      if (globalThis.confirm(t('studyLanguages.preview.copySourceNativeMessage'))) {
        void runPreview(nativeLanguage)
      }

      return
    }

    Alert.alert(
      t('studyLanguages.preview.copySourceTitle'),
      t('studyLanguages.preview.copySourceBody'),
      [
        { style: 'cancel', text: t('common.cancel') },
        {
          text: t('studyLanguages.preview.keepOriginalSource'),
          onPress: () => {
            void runCopyOneToOne()
          },
        },
        {
          text: t('studyLanguages.preview.useNativeSource'),
          onPress: () => {
            void runPreview(nativeLanguage)
          },
        },
      ],
    )
  }

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        {t('studyLanguages.groupCopy.description')}
      </AppText>
      <AppButton disabled={busy} onPress={handleCopyWithChoice}>
        {busy ? t('studyLanguages.groupCopy.copying') : t('studyLanguages.groupCopy.copy')}
      </AppButton>
      {feedback ? <AppText style={{ color: '#2e7d32' }}>{feedback}</AppText> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </View>
  )
}

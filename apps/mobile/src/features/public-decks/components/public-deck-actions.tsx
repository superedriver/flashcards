import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useCopyPublicDeckMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type PublicDeckActionsProps = {
  deckId: string
}

export function PublicDeckActions({ deckId }: PublicDeckActionsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [copyPublicDeck, { loading }] = useCopyPublicDeckMutation({
    refetchQueries: ['MyDecks'],
  })
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isCopyingRef = useRef(false)

  const handleCopy = () => {
    confirmAction(t('publicDecks.actions.copyTitle'), t('publicDecks.actions.copyMessage'), () => {
      if (isCopyingRef.current || loading) {
        return
      }

      isCopyingRef.current = true
      setErrorMessage(null)
      setFeedback(null)

      void (async () => {
        try {
          const result = await copyPublicDeck({
            variables: { sourceDeckId: deckId },
          })

          const copiedDeck = result.data?.copyPublicDeck.deck

          if (!copiedDeck) {
            setErrorMessage(t('publicDecks.actions.copyError'))
            return
          }

          setFeedback(t('publicDecks.actions.copySuccess'))
          router.replace(`/decks/${copiedDeck.id}`)
        } catch (error) {
          setErrorMessage(getGraphqlErrorMessage(error, t('publicDecks.actions.copyError')))
        } finally {
          isCopyingRef.current = false
        }
      })()
    })
  }

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        {t('publicDecks.actions.description')}
      </AppText>
      <AppButton disabled={loading} onPress={handleCopy}>
        {loading ? t('publicDecks.actions.copying') : t('publicDecks.actions.copy')}
      </AppButton>
      {feedback ? <AppText style={{ color: '#2e7d32' }}>{feedback}</AppText> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </View>
  )
}

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { ShareDeckForm } from '@/features/groups/components/share-deck-form'
import { useMyDecksQuery, useShareDeckWithGroupMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function ShareDeckWithGroupScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { groupId } = useLocalSearchParams<{ groupId: string }>()
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)

  const { data, error, loading, refetch } = useMyDecksQuery()
  const [shareDeckWithGroup, { loading: isSubmitting }] = useShareDeckWithGroupMutation()

  const handleShare = async () => {
    if (!groupId || !selectedDeckId) {
      return
    }

    if (isSubmittingRef.current || isSubmitting) {
      return
    }

    isSubmittingRef.current = true
    setErrorMessage(null)
    setFeedback(null)

    try {
      const result = await shareDeckWithGroup({
        variables: {
          input: {
            deckId: selectedDeckId,
            groupId,
          },
        },
      })

      if (!result.data?.shareDeckWithGroup.share) {
        setErrorMessage(t('groups.shareDeck.error'))
        return
      }

      setFeedback(t('groups.shareDeck.success'))
      router.replace(`/groups/${groupId}`)
    } catch (shareError) {
      setErrorMessage(getGraphqlErrorMessage(shareError, t('groups.shareDeck.error')))
    } finally {
      isSubmittingRef.current = false
    }
  }

  return (
    <Screen scrollable>
      <PageTitle title={t('groups.shareDeck.title')} />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        {t('groups.shareDeck.subtitle')}
      </AppText>

      {loading ? <LoadingState message={t('groups.shareDeck.loading')} /> : null}
      {error ? (
        <ErrorState message={t('groups.shareDeck.loadError')} onRetry={() => void refetch()} />
      ) : null}

      {!loading && !error && data?.myDecks ? (
        <>
          <ShareDeckForm
            decks={data.myDecks}
            errorMessage={errorMessage}
            feedback={feedback}
            onCreateDeck={() => router.push('/decks/new')}
            selectedDeckId={selectedDeckId}
            onSelectDeck={setSelectedDeckId}
          />
          <AppButton
            disabled={!selectedDeckId || isSubmitting || data.myDecks.length === 0}
            onPress={() => void handleShare()}
          >
            {isSubmitting ? t('groups.shareDeck.sharing') : t('groups.shareDeck.submit')}
          </AppButton>
        </>
      ) : null}
    </Screen>
  )
}

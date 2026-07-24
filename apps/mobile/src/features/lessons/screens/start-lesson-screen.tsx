import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { deckNeedsLanguageAssignment } from '@/features/decks/utils/deck-language-gate'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import type { LessonCard } from '@/features/lessons/types/active-lesson'
import { useDeckQuery, useStartLessonMutation } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { EmptyState, ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

type StartLessonScreenProps = {
  deckId?: string
}

export function StartLessonScreen({ deckId }: StartLessonScreenProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { setActiveLesson } = useActiveLesson()
  const [startLesson] = useStartLessonMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isEmptyLesson, setIsEmptyLesson] = useState(false)
  const [isStarting, setIsStarting] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const hasStartedRef = useRef(false)

  const deckQuery = useDeckQuery({
    skip: !deckId,
    variables: { id: deckId ?? '' },
  })

  useEffect(() => {
    if (!deckId || hasStartedRef.current || deckQuery.loading) {
      return
    }

    const deck = deckQuery.data?.deck

    if (!deck) {
      if (deckQuery.error) {
        setErrorMessage(getGraphqlErrorMessage(deckQuery.error, t('lessons.start.startError')))
        setIsStarting(false)
      }
      return
    }

    if (deckNeedsLanguageAssignment(deck)) {
      hasStartedRef.current = true
      setIsStarting(false)
      router.replace(`/decks/${deckId}/assign-languages`)
      return
    }

    hasStartedRef.current = true

    void startLesson({
      variables: {
        input: { deckId },
      },
    })
      .then((result) => {
        const payload = result.data?.startLesson

        if (!payload) {
          setErrorMessage(t('lessons.start.startError'))
          return
        }

        if (!payload.sessionId || payload.cards.length === 0) {
          setIsEmptyLesson(true)
          return
        }

        const cards: LessonCard[] = payload.cards.map((card) => ({
          back: card.back,
          cardId: card.cardId,
          deckId: card.deckId,
          example: card.example,
          front: card.front,
          learningGroup: card.learningGroup,
          learningStep: card.learningStep,
          notes: card.notes,
          position: card.position,
          promptDirection: card.promptDirection,
        }))

        setActiveLesson({
          cards,
          currentIndex: 0,
          deckId: payload.deckId ?? null,
          reviewedCardIds: [],
          scope: payload.scope,
          sessionId: payload.sessionId,
        })

        router.replace(
          `/lessons/${payload.sessionId}${payload.deckId ? `?deckId=${payload.deckId}` : ''}`,
        )
      })
      .catch((error) => {
        setErrorMessage(getGraphqlErrorMessage(error, t('lessons.start.startError')))
      })
      .finally(() => {
        setIsStarting(false)
      })
  }, [
    deckId,
    deckQuery.data?.deck,
    deckQuery.error,
    deckQuery.loading,
    retryCount,
    router,
    setActiveLesson,
    startLesson,
    t,
  ])

  const handleRetry = () => {
    setErrorMessage(null)
    setIsEmptyLesson(false)
    setIsStarting(true)
    hasStartedRef.current = false
    setRetryCount((current) => current + 1)
  }

  if (!deckId) {
    return (
      <Screen>
        <PageTitle title={t('lessons.start.title')} />
        <ErrorState message={t('lessons.start.deckIdMissing')} />
        <View style={{ gap: 12, marginTop: 16 }}>
          <AppButton onPress={() => router.replace('/(tabs)/decks')}>
            {t('lessons.start.backToDecks')}
          </AppButton>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <PageTitle title={t('lessons.start.title')} />
      {isStarting || deckQuery.loading ? (
        <LoadingState message={t('lessons.start.preparing')} />
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} onRetry={handleRetry} /> : null}
      {isEmptyLesson ? (
        <View style={{ gap: 12 }}>
          <EmptyState message={t('lessons.start.empty')} />
          <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>
            {t('lessons.start.backToDeck')}
          </AppButton>
          <AppButton onPress={() => router.replace('/(tabs)/decks')}>
            {t('lessons.start.backToDecks')}
          </AppButton>
        </View>
      ) : null}
    </Screen>
  )
}

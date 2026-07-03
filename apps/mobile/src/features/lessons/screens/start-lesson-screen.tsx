import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'

import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import type { LessonCard } from '@/features/lessons/types/active-lesson'
import { useStartLessonMutation } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { EmptyState, ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

type StartLessonScreenProps = {
  deckId?: string
}

export function StartLessonScreen({ deckId }: StartLessonScreenProps) {
  const router = useRouter()
  const { setActiveLesson } = useActiveLesson()
  const [startLesson] = useStartLessonMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isEmptyLesson, setIsEmptyLesson] = useState(false)
  const [isStarting, setIsStarting] = useState(true)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    if (!deckId || hasStartedRef.current) {
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
          setErrorMessage('Could not start lesson. Please try again.')
          return
        }

        if (!payload.sessionId || payload.cards.length === 0) {
          setIsEmptyLesson(true)
          return
        }

        const cards: LessonCard[] = payload.cards.map((card) => ({
          back: card.back,
          cardId: card.cardId,
          example: card.example,
          front: card.front,
          notes: card.notes,
          position: card.position,
        }))

        setActiveLesson({
          cards,
          currentIndex: 0,
          deckId: payload.deckId,
          reviewedCardIds: [],
          sessionId: payload.sessionId,
        })

        router.replace(`/lessons/${payload.sessionId}?deckId=${payload.deckId}`)
      })
      .catch(() => {
        setErrorMessage('Could not start lesson. Please try again.')
      })
      .finally(() => {
        setIsStarting(false)
      })
  }, [deckId, router, setActiveLesson, startLesson])

  if (!deckId) {
    return (
      <Screen>
        <PageTitle title="Start Lesson" />
        <ErrorState message="Deck id is missing." />
      </Screen>
    )
  }

  return (
    <Screen>
      <PageTitle title="Start Lesson" />
      {isStarting ? <LoadingState message="Starting lesson..." /> : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {isEmptyLesson ? (
        <View style={{ gap: 12 }}>
          <EmptyState message="No cards are ready for review right now." />
          <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>Back to deck</AppButton>
        </View>
      ) : null}
    </Screen>
  )
}

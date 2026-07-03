import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import { LessonProgress } from '@/features/lessons/components/lesson-progress'
import { ReviewAnswerActions } from '@/features/lessons/components/review-answer-actions'
import { ReviewFlashcard } from '@/features/lessons/components/review-flashcard'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import {
  ReviewAnswer,
  useCompleteLessonMutation,
  useSubmitReviewMutation,
} from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function LessonReviewScreen() {
  const router = useRouter()
  const { deckId, sessionId } = useLocalSearchParams<{ deckId?: string; sessionId?: string }>()
  const {
    clearActiveLesson,
    currentCard,
    currentNumber,
    goToNextCard,
    lesson,
    markCardReviewed,
    reviewedCount,
    setCompletion,
    totalCards,
  } = useActiveLesson(sessionId)
  const [submitReview] = useSubmitReviewMutation()
  const [completeLesson] = useCompleteLessonMutation()
  const [isRevealed, setIsRevealed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!sessionId) {
    return (
      <Screen>
        <PageTitle title="Lesson" />
        <ErrorState message="Lesson session is missing." />
      </Screen>
    )
  }

  if (!lesson || !currentCard) {
    return (
      <Screen>
        <PageTitle title="Lesson" />
        <ErrorState message="Lesson state was lost. Please start the lesson again." />
        <View style={{ gap: 12, marginTop: 16 }}>
          {deckId ? (
            <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>Back to deck</AppButton>
          ) : null}
          <AppButton onPress={() => router.replace('/(tabs)/decks')}>Back to decks</AppButton>
        </View>
      </Screen>
    )
  }

  const handleAnswer = async (answer: ReviewAnswer) => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const result = await submitReview({
        variables: {
          input: {
            answer,
            cardId: currentCard.cardId,
            sessionId: lesson.sessionId,
          },
        },
      })

      if (!result.data?.submitReview) {
        setErrorMessage('Could not submit review. Please try again.')
        return
      }

      markCardReviewed(currentCard.cardId)
      setIsRevealed(false)

      const isLastCard = lesson.currentIndex >= lesson.cards.length - 1

      if (isLastCard) {
        const completeResult = await completeLesson({
          variables: {
            input: { sessionId: lesson.sessionId },
          },
        })

        const summary = completeResult.data?.completeLesson

        if (!summary) {
          setErrorMessage('Could not complete lesson. Please try again.')
          return
        }

        setCompletion({
          completedAt: summary.completedAt,
          deckId: summary.deckId,
          dontKnowCount: summary.dontKnowCount,
          knownCount: summary.knownCount,
          reviewedCards: summary.reviewedCards,
          sessionId: summary.sessionId,
          totalCards: summary.totalCards,
        })
        clearActiveLesson()
        router.replace(`/lessons/${sessionId}/summary?deckId=${summary.deckId}`)
        return
      }

      goToNextCard()
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, 'Could not submit review. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen>
      <PageTitle title="Lesson Review" />
      <LessonProgress
        currentNumber={currentNumber}
        reviewedCount={reviewedCount}
        totalCards={totalCards}
      />
      <ReviewFlashcard
        back={currentCard.back}
        example={currentCard.example}
        front={currentCard.front}
        isRevealed={isRevealed}
        notes={currentCard.notes}
        onReveal={() => setIsRevealed(true)}
      />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      {isRevealed ? (
        <ReviewAnswerActions
          disabled={isSubmitting}
          onAnswer={(answer) => void handleAnswer(answer)}
        />
      ) : null}
    </Screen>
  )
}

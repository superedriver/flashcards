import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LessonProgress } from '@/features/lessons/components/lesson-progress'
import { ReviewAnswerActions } from '@/features/lessons/components/review-answer-actions'
import { ReviewFlashcard } from '@/features/lessons/components/review-flashcard'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { mapGraphQlLessonCard } from '@/features/lessons/utils/map-lesson-card'
import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import {
  ReviewAnswer,
  useCompleteLessonMutation,
  useSubmitReviewMutation,
} from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function LessonReviewScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId, sessionId } = useLocalSearchParams<{ deckId?: string; sessionId?: string }>()
  const {
    clearActiveLesson,
    currentCard,
    currentNumber,
    enqueueNextCard,
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
  const isSubmittingRef = useRef(false)

  useEffect(() => {
    setIsRevealed(false)
    setErrorMessage(null)
  }, [currentCard?.cardId, currentCard?.promptDirection])

  if (!sessionId) {
    return (
      <Screen>
        <PageTitle title={t('lessons.review.title')} />
        <ErrorState message={t('lessons.review.sessionMissing')} />
      </Screen>
    )
  }

  if (!lesson || !currentCard) {
    return (
      <Screen>
        <PageTitle title={t('lessons.review.title')} />
        <ErrorState message={t('lessons.review.stateLost')} />
        <View style={{ gap: 12, marginTop: 16 }}>
          {deckId ? (
            <AppButton onPress={() => router.replace(`/lessons/start?deckId=${deckId}`)}>
              {t('lessons.review.startAgain')}
            </AppButton>
          ) : null}
          {deckId ? (
            <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>
              {t('lessons.review.backToDeck')}
            </AppButton>
          ) : null}
          <AppButton onPress={() => router.replace(deckId ? '/(tabs)/decks' : '/(tabs)')}>
            {t('lessons.review.backToDecks')}
          </AppButton>
        </View>
      </Screen>
    )
  }

  const handleLeaveLesson = () => {
    const targetDeckId = deckId ?? lesson.deckId

    confirmAction(t('lessons.review.leaveTitle'), t('lessons.review.leaveMessage'), () => {
      clearActiveLesson()
      router.replace(targetDeckId ? `/decks/${targetDeckId}` : '/(tabs)')
    })
  }

  const finishLesson = async () => {
    const completeResult = await completeLesson({
      variables: {
        input: { sessionId: lesson.sessionId },
      },
    })

    const summary = completeResult.data?.completeLesson

    if (!summary) {
      setErrorMessage(t('lessons.review.completeError'))
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
    router.replace(
      `/lessons/${sessionId}/summary${summary.deckId ? `?deckId=${summary.deckId}` : ''}`,
    )
  }

  const handleAnswer = async (answer: ReviewAnswer) => {
    if (isSubmittingRef.current || isSubmitting || !isRevealed) {
      return
    }

    isSubmittingRef.current = true
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

      const payload = result.data?.submitReview

      if (!payload) {
        setErrorMessage(t('lessons.review.submitError'))
        return
      }

      markCardReviewed(currentCard.cardId)
      setIsRevealed(false)

      if (payload.nextCard) {
        enqueueNextCard(mapGraphQlLessonCard(payload.nextCard))
        goToNextCard()
        return
      }

      await finishLesson()
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('lessons.review.submitError')))
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <Screen scrollable>
      <PageTitle title={t('lessons.review.pageTitle')} />
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
        promptDirection={currentCard.promptDirection}
        onReveal={() => setIsRevealed(true)}
      />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      <ReviewAnswerActions
        disabled={isSubmitting}
        isRevealed={isRevealed}
        isSubmitting={isSubmitting}
        onAnswer={(answer) => void handleAnswer(answer)}
      />
      <View style={{ marginTop: 16 }}>
        <AppButton disabled={isSubmitting} onPress={handleLeaveLesson}>
          {t('lessons.review.leaveLesson')}
        </AppButton>
      </View>
    </Screen>
  )
}

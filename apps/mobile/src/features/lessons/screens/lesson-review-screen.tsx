import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { ReviewAnswerActions } from '@/features/lessons/components/review-answer-actions'
import {
  ReviewFlashcard,
  type ReviewFlashcardHandle,
} from '@/features/lessons/components/review-flashcard'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { mapGraphQlLessonCard } from '@/features/lessons/utils/map-lesson-card'
import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import {
  ReviewAnswer,
  useAbandonLessonMutation,
  useCompleteLessonMutation,
  useSubmitReviewMutation,
} from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

export function LessonReviewScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId, sessionId } = useLocalSearchParams<{ deckId?: string; sessionId?: string }>()
  const {
    clearActiveLesson,
    currentCard,
    enqueueNextCard,
    goToNextCard,
    lesson,
    markCardReviewed,
    setCompletion,
  } = useActiveLesson(sessionId)
  const [submitReview] = useSubmitReviewMutation()
  const [completeLesson] = useCompleteLessonMutation()
  const [abandonLesson] = useAbandonLessonMutation()
  const [isRevealed, setIsRevealed] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const flashcardRef = useRef<ReviewFlashcardHandle>(null)

  useEffect(() => {
    setIsRevealed(false)
    setIsExiting(false)
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
    const activeSessionId = lesson.sessionId

    confirmAction(t('lessons.review.leaveTitle'), t('lessons.review.leaveMessage'), () => {
      void (async () => {
        try {
          await abandonLesson({
            variables: {
              input: { sessionId: activeSessionId },
            },
          })
        } catch {
          // Local lesson still ends if the backend abandon fails.
        } finally {
          clearActiveLesson()
          router.replace(targetDeckId ? `/decks/${targetDeckId}` : '/(tabs)')
        }
      })()
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
      setIsExiting(false)
      return
    }

    setCompletion({
      completedAt: summary.completedAt,
      deckId: summary.deckId,
      sessionId: summary.sessionId,
      uniqueCardCount: lesson.reviewedCardIds.length,
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
        setIsExiting(false)
        return
      }

      markCardReviewed(currentCard.cardId)
      setIsRevealed(false)
      setIsExiting(false)

      if (payload.nextCard) {
        enqueueNextCard(mapGraphQlLessonCard(payload.nextCard))
        goToNextCard()
        return
      }

      await finishLesson()
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('lessons.review.submitError')))
      setIsExiting(false)
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <Screen>
      <PageTitle
        title={t('lessons.review.pageTitle')}
        trailing={
          <Pressable
            {...buttonA11yProps(t('lessons.review.leaveLesson'))}
            disabled={isSubmitting}
            onPress={handleLeaveLesson}
            style={{ opacity: isSubmitting ? 0.4 : 1, paddingVertical: 4 }}
          >
            <AppText style={{ color: '#667085', fontSize: 14, fontWeight: '600' }}>
              {t('lessons.review.leaveLesson')}
            </AppText>
          </Pressable>
        }
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ReviewFlashcard
          ref={flashcardRef}
          back={currentCard.back}
          cardId={currentCard.cardId}
          example={currentCard.example}
          front={currentCard.front}
          isExiting={isExiting}
          isRevealed={isRevealed}
          key={`${currentCard.cardId}-${currentCard.promptDirection}`}
          notes={currentCard.notes}
          promptDirection={currentCard.promptDirection}
          onAnswer={(answer) => void handleAnswer(answer)}
          onExitStart={() => setIsExiting(true)}
          onReveal={() => setIsRevealed(true)}
        />
      </View>
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      <View style={{ marginTop: 16 }}>
        <ReviewAnswerActions
          disabled={isSubmitting || isExiting}
          isRevealed={isRevealed}
          isSubmitting={isSubmitting}
          onAnswer={(answer) => flashcardRef.current?.playExit(answer)}
        />
      </View>
    </Screen>
  )
}

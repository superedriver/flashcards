import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { useUnsavedChangesGuard } from '@/features/decks/hooks/use-unsaved-changes-guard'
import {
  evictCardCountCache,
  LEARNING_STATS_REFETCH_QUERIES,
} from '@/features/decks/utils/card-mutation-cache'
import { confirmAction } from '@/features/decks/utils/confirm-destructive'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { ReviewAnswerActions } from '@/features/lessons/components/review-answer-actions'
import {
  ReviewFlashcard,
  type ReviewFlashcardHandle,
} from '@/features/lessons/components/review-flashcard'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { isReviewSpeechActive, useReviewSpeech } from '@/features/lessons/hooks/use-review-speech'
import { useReviewSwipeHint } from '@/features/lessons/hooks/use-review-swipe-hint'
import { getReviewSides } from '@/features/lessons/utils/get-review-sides'
import { mapGraphQlLessonCard } from '@/features/lessons/utils/map-lesson-card'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import {
  ReviewAnswer,
  useAbandonLessonMutation,
  useCompleteLessonMutation,
  useDeckQuery,
  useDisableAudioOnlyMutation,
  useSubmitReviewMutation,
} from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

const OUTCOME_MAX_WIDTH = 480

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
    setActiveLesson,
    setCompletion,
  } = useActiveLesson(sessionId)
  const [submitReview] = useSubmitReviewMutation()
  const [disableAudioOnly] = useDisableAudioOnlyMutation()
  const [completeLesson] = useCompleteLessonMutation({
    awaitRefetchQueries: true,
    refetchQueries: [...LEARNING_STATS_REFETCH_QUERIES],
    update: evictCardCountCache,
  })
  const [abandonLesson] = useAbandonLessonMutation({
    awaitRefetchQueries: true,
    refetchQueries: [...LEARNING_STATS_REFETCH_QUERIES],
    update: evictCardCountCache,
  })
  const [isRevealed, setIsRevealed] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const isSubmittingRef = useRef(false)
  const flashcardRef = useRef<ReviewFlashcardHandle>(null)
  const { recordAnswer, showSwipeHint } = useReviewSwipeHint()
  const { activeTargetLanguage } = useStudyLanguageContext()
  const reviewDeckId = deckId ?? lesson?.deckId ?? currentCard?.deckId
  const { data: deckData } = useDeckQuery({
    skip: !reviewDeckId,
    variables: { id: reviewDeckId ?? '' },
  })
  const targetLanguage = deckData?.deck?.targetLanguage ?? activeTargetLanguage
  const showSpeakButton = isReviewSpeechActive({
    isRevealed,
    languageCode: targetLanguage,
    presentationMode: currentCard?.presentationMode,
  })
  const { speak } = useReviewSpeech({
    enabled: showSpeakButton && !isExiting,
    languageCode: targetLanguage,
    text: currentCard?.front ?? '',
    utteranceKey: currentCard
      ? `${currentCard.cardId}-${currentCard.presentationMode}-${isRevealed}`
      : '',
  })
  const { allowLeave } = useUnsavedChangesGuard(
    Boolean(sessionId && lesson && currentCard),
    t('lessons.review.leaveTitle'),
    t('lessons.review.leaveMessage'),
    () => {
      const activeSessionId = lesson?.sessionId

      if (activeSessionId) {
        void abandonLesson({
          variables: { input: { sessionId: activeSessionId } },
        }).catch(() => {
          // Next Start still abandons leftover ACTIVE sessions.
        })
      }

      clearActiveLesson()
    },
  )

  useEffect(() => {
    setIsRevealed(false)
    setIsExiting(false)
    setErrorMessage(null)
  }, [currentCard?.cardId, currentCard?.presentationMode])

  if (!sessionId) {
    return (
      <ReviewUnavailableScreen
        body={t('lessons.review.sessionMissing')}
        deckId={deckId}
        title={t('lessons.review.lostTitle')}
      />
    )
  }

  if (!lesson || !currentCard) {
    return (
      <ReviewUnavailableScreen
        body={t('lessons.review.stateLost')}
        deckId={deckId}
        title={t('lessons.review.lostTitle')}
      />
    )
  }

  const handleLeaveLesson = () => {
    const targetDeckId = deckId ?? lesson.deckId
    const activeSessionId = lesson.sessionId

    confirmAction(t('lessons.review.leaveTitle'), t('lessons.review.leaveMessage'), () => {
      allowLeave()
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
      deckId: summary.deckId ?? lesson.deckId,
      scope: lesson.scope ?? 'DECK',
      sessionId: summary.sessionId,
    })
    allowLeave()
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
      recordAnswer()
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

  const handleCantListen = async () => {
    if (
      isSubmittingRef.current ||
      isSubmitting ||
      isRevealed ||
      currentCard.presentationMode !== 'TARGET_AUDIO_ONLY'
    ) {
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const result = await disableAudioOnly({
        variables: {
          input: {
            cardId: currentCard.cardId,
            sessionId: lesson.sessionId,
          },
        },
      })

      const nextCard = result.data?.disableAudioOnly

      if (!nextCard) {
        setErrorMessage(t('lessons.review.cantListenError'))
        return
      }

      setActiveLesson({
        ...lesson,
        cards: lesson.cards.map((card, index) =>
          index === lesson.currentIndex ? mapGraphQlLessonCard(nextCard) : card,
        ),
      })
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('lessons.review.cantListenError')))
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  const reviewSides = getReviewSides(currentCard)
  const showCantListen =
    currentCard.presentationMode === 'TARGET_AUDIO_ONLY' && !isRevealed && !isExiting

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
      <View style={{ gap: 12, marginTop: 4 }}>
        <ReviewFlashcard
          ref={flashcardRef}
          answer={reviewSides.answer}
          cardId={currentCard.cardId}
          example={currentCard.example}
          isExiting={isExiting}
          isRevealed={isRevealed}
          key={`${currentCard.cardId}-${currentCard.presentationMode}`}
          notes={currentCard.notes}
          prompt={reviewSides.prompt}
          showAudioOnlyPrompt={currentCard.presentationMode === 'TARGET_AUDIO_ONLY'}
          showSpeakButton={showSpeakButton}
          onAnswer={(answer) => void handleAnswer(answer)}
          onExitStart={() => setIsExiting(true)}
          onReveal={() => setIsRevealed(true)}
          onSpeak={speak}
        />
        {showCantListen ? (
          <Pressable
            {...buttonA11yProps(t('lessons.review.cantListen'), t('lessons.review.cantListenHint'))}
            disabled={isSubmitting}
            onPress={() => void handleCantListen()}
            style={{ opacity: isSubmitting ? 0.4 : 1, paddingVertical: 4 }}
          >
            <AppText style={{ color: '#667085', fontSize: 14, textAlign: 'center' }}>
              {t('lessons.review.cantListen')}
            </AppText>
          </Pressable>
        ) : null}
        {errorMessage ? <ErrorState message={errorMessage} /> : null}
        <ReviewAnswerActions
          disabled={isSubmitting || isExiting}
          isRevealed={isRevealed}
          isSubmitting={isSubmitting}
          showSwipeHint={showSwipeHint}
          onAnswer={(answer) => flashcardRef.current?.playExit(answer)}
        />
      </View>
    </Screen>
  )
}

function ReviewUnavailableScreen({
  body,
  deckId,
  title,
}: {
  body: string
  deckId?: string
  title: string
}) {
  const { t } = useTranslation()
  const router = useRouter()
  const isDeckReview = Boolean(deckId)

  return (
    <Screen>
      <View style={{ alignSelf: 'center', maxWidth: OUTCOME_MAX_WIDTH, width: '100%' }}>
        <View style={{ alignItems: 'center', marginBottom: 36, marginTop: 28 }}>
          <Ionicons color="#b42318" name="alert-circle" size={40} />
          <AppText
            accessibilityRole="header"
            style={{
              fontSize: 24,
              fontWeight: '700',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {title}
          </AppText>
          <AppText
            style={{
              color: '#667085',
              fontSize: 15,
              marginTop: 6,
              textAlign: 'center',
            }}
          >
            {body}
          </AppText>
        </View>
        <View style={{ gap: 4 }}>
          {isDeckReview ? (
            <Pressable
              {...buttonA11yProps(t('lessons.review.startAgain'))}
              onPress={() => router.replace(`/lessons/start?deckId=${deckId}`)}
              style={{
                alignItems: 'center',
                backgroundColor: '#1a56db',
                borderRadius: 10,
                paddingVertical: 12,
              }}
            >
              <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                {t('lessons.review.startAgain')}
              </AppText>
            </Pressable>
          ) : (
            <Pressable
              {...buttonA11yProps(t('common.tabs.home'))}
              onPress={() => router.replace('/(tabs)')}
              style={{
                alignItems: 'center',
                backgroundColor: '#1a56db',
                borderRadius: 10,
                paddingVertical: 12,
              }}
            >
              <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
                {t('common.tabs.home')}
              </AppText>
            </Pressable>
          )}
          {isDeckReview ? (
            <Pressable
              {...buttonA11yProps(t('lessons.review.backToDeck'))}
              onPress={() => router.replace(`/decks/${deckId}`)}
              style={{ alignItems: 'center', paddingVertical: 10 }}
            >
              <AppText style={{ color: '#344054', fontSize: 15, fontWeight: '600' }}>
                {t('lessons.review.backToDeck')}
              </AppText>
            </Pressable>
          ) : null}
          <Pressable
            {...buttonA11yProps(t('lessons.start.allDecks'))}
            onPress={() => router.replace('/(tabs)/decks')}
            style={{ alignItems: 'center', paddingVertical: 6 }}
          >
            <AppText style={{ color: '#667085', fontSize: 14 }}>
              {t('lessons.start.allDecks')}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  )
}

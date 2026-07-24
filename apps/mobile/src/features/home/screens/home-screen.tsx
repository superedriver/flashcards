import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { HomeLearningCounters } from '@/features/home/components/home-learning-counters'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import type { LessonCard } from '@/features/lessons/types/active-lesson'
import { useHomeLearningProgressQuery, useStartHomeLessonMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { EmptyState, ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function HomeScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setActiveLesson } = useActiveLesson()
  const [startHomeLesson] = useStartHomeLessonMutation()
  const [isStarting, setIsStarting] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  const { data, error, loading, refetch } = useHomeLearningProgressQuery({
    fetchPolicy: 'cache-and-network',
  })

  const progress = data?.homeLearningProgress

  const handleStart = async () => {
    if (isStarting) {
      return
    }

    setIsStarting(true)
    setStartError(null)

    try {
      const result = await startHomeLesson({
        variables: { input: {} },
      })

      const payload = result.data?.startHomeLesson

      if (!payload) {
        setStartError(t('home.startError'))
        return
      }

      if (!payload.sessionId || payload.cards.length === 0) {
        setStartError(t('home.emptyLesson'))
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

      router.push(`/lessons/${payload.sessionId}`)
    } catch (err) {
      setStartError(getGraphqlErrorMessage(err, t('home.startError')))
    } finally {
      setIsStarting(false)
    }
  }

  if (loading && !progress) {
    return (
      <Screen>
        <PageTitle title={t('home.title')} />
        <LoadingState message={t('home.loading')} />
      </Screen>
    )
  }

  if (error || !progress) {
    return (
      <Screen>
        <PageTitle title={t('home.title')} />
        <ErrorState message={t('home.loadError')} onRetry={() => void refetch()} />
      </Screen>
    )
  }

  const hasCards = progress.totalCardCount > 0
  const hasDue = progress.dueCount > 0
  const canStart = Boolean(progress.activeTargetLanguage) && hasDue

  return (
    <Screen scrollable>
      <PageTitle title={t('home.title')} />

      <View style={{ gap: 16 }}>
        {progress.activeTargetLanguage ? (
          <AppText style={{ color: '#666666' }}>
            {t('home.activeTarget', { language: progress.activeTargetLanguage })}
          </AppText>
        ) : (
          <EmptyState
            actionLabel={t('home.setLanguages')}
            message={t('home.noActiveTarget')}
            onAction={() => router.push('/(tabs)/profile')}
          />
        )}

        {progress.activeTargetLanguage ? (
          <>
            <HomeLearningCounters
              learnedCount={progress.learnedCount}
              practicedCount={progress.practicedCount}
              toLearnCount={progress.toLearnCount}
            />

            <AppText style={{ fontWeight: hasDue ? '600' : '400' }}>
              {t('home.counters.due', { count: progress.dueCount })}
            </AppText>

            {!hasCards ? (
              <EmptyState
                actionLabel={t('home.addCards.action')}
                message={t('home.addCards.message')}
                onAction={() => router.push('/(tabs)/decks')}
              />
            ) : null}

            {hasCards && !hasDue ? (
              <EmptyState
                actionLabel={t('home.noReviewNow.action')}
                message={t('home.noReviewNow.message')}
                onAction={() => router.push('/(tabs)/decks')}
              />
            ) : null}

            {canStart ? (
              <AppButton disabled={isStarting} onPress={() => void handleStart()}>
                {isStarting ? t('home.starting') : t('home.start')}
              </AppButton>
            ) : null}

            {startError ? <ErrorState message={startError} /> : null}
          </>
        ) : null}
      </View>
    </Screen>
  )
}

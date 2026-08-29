import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { HomeLearningCounters } from '@/features/home/components/home-learning-counters'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { mapGraphQlLessonCard } from '@/features/lessons/utils/map-lesson-card'
import { StudyLanguageSelector } from '@/features/study-languages/components/study-language-selector'
import { useHomeLearningProgressQuery, useStartHomeLessonMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { EmptyState, ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

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

      const cards = payload.cards.map(mapGraphQlLessonCard)

      setActiveLesson({
        cards,
        currentIndex: 0,
        deckId: payload.deckId ?? null,
        lessonSize: payload.lessonSize,
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

  const pageTitle = <PageTitle title={t('home.title')} trailing={<StudyLanguageSelector />} />

  if (loading && !progress) {
    return (
      <Screen>
        {pageTitle}
        <LoadingState message={t('home.loading')} />
      </Screen>
    )
  }

  if (error || !progress) {
    return (
      <Screen>
        {pageTitle}
        <ErrorState message={t('home.loadError')} onRetry={() => void refetch()} />
      </Screen>
    )
  }

  const hasCards = progress.totalCardCount > 0
  const hasDue = progress.dueCount > 0
  const canStart = Boolean(progress.activeTargetLanguage) && hasDue

  return (
    <Screen scrollable>
      {pageTitle}

      <View style={{ gap: 16 }}>
        {!progress.activeTargetLanguage ? (
          <EmptyState
            actionLabel={t('home.setLanguages')}
            message={t('home.noActiveTarget')}
            onAction={() => router.push('/(tabs)/profile')}
          />
        ) : (
          <>
            <HomeLearningCounters
              dueCount={progress.dueCount}
              learnedCount={progress.learnedCount}
              practicedCount={progress.practicedCount}
              toLearnCount={progress.toLearnCount}
            />

            {canStart ? (
              <Pressable
                {...buttonA11yProps(t('home.start'))}
                disabled={isStarting}
                style={{
                  alignItems: 'center',
                  backgroundColor: '#1a56db',
                  borderRadius: 8,
                  flexDirection: 'row',
                  gap: 6,
                  justifyContent: 'center',
                  opacity: isStarting ? 0.7 : 1,
                  paddingVertical: 12,
                  width: '100%',
                }}
                onPress={() => void handleStart()}
              >
                <AppText style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
                  {isStarting ? t('home.starting') : t('home.start')}
                </AppText>
                {isStarting ? null : <Ionicons color="#ffffff" name="chevron-forward" size={18} />}
              </Pressable>
            ) : null}

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

            {startError ? <ErrorState message={startError} /> : null}
          </>
        )}
      </View>
    </Screen>
  )
}

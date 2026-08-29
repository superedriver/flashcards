import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { mapGraphQlLessonCard } from '@/features/lessons/utils/map-lesson-card'
import { useStartHomeLessonMutation } from '@/graphql/generated'
import { formatDateTimeCompact } from '@/i18n/formatters'
import { AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

const SUMMARY_MAX_WIDTH = 480

export function LessonSummaryScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId?: string }>()
  const { clearCompletion, completion, setActiveLesson } = useActiveLesson()
  const [startHomeLesson] = useStartHomeLessonMutation()
  const [isStartingAnother, setIsStartingAnother] = useState(false)
  const [startError, setStartError] = useState<string | null>(null)

  const targetDeckId = deckId ?? completion?.deckId ?? null
  const isDeckReview = completion
    ? completion.scope === 'DECK' && Boolean(targetDeckId)
    : Boolean(targetDeckId)

  const goHome = () => {
    clearCompletion()
    router.replace('/(tabs)')
  }

  const goToDeck = () => {
    if (!targetDeckId) {
      goHome()
      return
    }

    clearCompletion()
    router.replace(`/decks/${targetDeckId}`)
  }

  const goToAllDecks = () => {
    clearCompletion()
    router.replace('/(tabs)/decks')
  }

  const handleStartAnother = async () => {
    if (isStartingAnother) {
      return
    }

    if (isDeckReview && targetDeckId) {
      clearCompletion()
      router.replace(`/lessons/start?deckId=${targetDeckId}`)
      return
    }

    setIsStartingAnother(true)
    setStartError(null)

    try {
      const result = await startHomeLesson({
        variables: { input: {} },
      })
      const payload = result.data?.startHomeLesson

      if (!payload?.sessionId || payload.cards.length === 0) {
        goHome()
        return
      }

      setActiveLesson({
        cards: payload.cards.map(mapGraphQlLessonCard),
        currentIndex: 0,
        deckId: payload.deckId ?? null,
        lessonSize: payload.lessonSize,
        reviewedCardIds: [],
        scope: payload.scope,
        sessionId: payload.sessionId,
      })
      clearCompletion()
      router.replace(`/lessons/${payload.sessionId}`)
    } catch (error) {
      setStartError(getGraphqlErrorMessage(error, t('lessons.start.startError')))
      setIsStartingAnother(false)
    }
  }

  const actions = (
    <View style={{ gap: 4 }}>
      <Pressable
        {...buttonA11yProps(t('lessons.summary.startAnother'))}
        disabled={isStartingAnother}
        onPress={() => void handleStartAnother()}
        style={{
          alignItems: 'center',
          backgroundColor: '#1a56db',
          borderRadius: 10,
          opacity: isStartingAnother ? 0.45 : 1,
          paddingVertical: 12,
        }}
      >
        <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
          {isStartingAnother ? t('common.loading') : t('lessons.summary.startAnother')}
        </AppText>
      </Pressable>
      <Pressable
        {...buttonA11yProps(isDeckReview ? t('lessons.summary.backToDeck') : t('common.tabs.home'))}
        disabled={isStartingAnother}
        onPress={isDeckReview ? goToDeck : goHome}
        style={{ alignItems: 'center', paddingVertical: 10 }}
      >
        <AppText style={{ color: '#344054', fontSize: 15, fontWeight: '600' }}>
          {isDeckReview ? t('lessons.summary.backToDeck') : t('common.tabs.home')}
        </AppText>
      </Pressable>
      <Pressable
        {...buttonA11yProps(t('lessons.summary.allDecks'))}
        disabled={isStartingAnother}
        onPress={goToAllDecks}
        style={{ alignItems: 'center', paddingVertical: 6 }}
      >
        <AppText style={{ color: '#667085', fontSize: 14 }}>
          {t('lessons.summary.allDecks')}
        </AppText>
      </Pressable>
    </View>
  )

  if (!completion) {
    return (
      <Screen>
        <PageTitle title={t('lessons.summary.title')} />
        <View style={{ alignSelf: 'center', maxWidth: SUMMARY_MAX_WIDTH, width: '100%' }}>
          <ErrorState message={t('lessons.summary.unavailable')} />
          <View style={{ marginTop: 20 }}>{actions}</View>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <PageTitle title={t('lessons.summary.completeTitle')} />
      <View style={{ alignSelf: 'center', maxWidth: SUMMARY_MAX_WIDTH, width: '100%' }}>
        <View style={{ alignItems: 'center', marginBottom: 36, marginTop: 28 }}>
          <Ionicons color="#166534" name="checkmark-circle" size={40} />
          <AppText
            style={{
              fontSize: 24,
              fontWeight: '700',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            {t('lessons.summary.niceWork')}
          </AppText>
          <AppText
            style={{
              color: '#667085',
              fontSize: 15,
              marginTop: 6,
              textAlign: 'center',
            }}
          >
            {t('lessons.summary.finishedSuccessfully')}
          </AppText>
          <AppText
            style={{
              color: '#98a2b3',
              fontSize: 13,
              marginTop: 14,
              textAlign: 'center',
            }}
          >
            {formatDateTimeCompact(completion.completedAt)}
          </AppText>
        </View>
        {startError ? (
          <View style={{ marginBottom: 12 }}>
            <ErrorState message={startError} />
          </View>
        ) : null}
        {actions}
      </View>
    </Screen>
  )
}

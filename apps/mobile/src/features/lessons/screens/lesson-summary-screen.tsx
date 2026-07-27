import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { formatDateTime } from '@/i18n/formatters'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

export function LessonSummaryScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId?: string }>()
  const { clearCompletion, completion } = useActiveLesson()

  if (!completion) {
    return (
      <Screen>
        <PageTitle title={t('lessons.summary.title')} />
        <ErrorState message={t('lessons.summary.unavailable')} />
        <View style={{ gap: 12, marginTop: 16 }}>
          {deckId ? (
            <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>
              {t('lessons.summary.backToDeck')}
            </AppButton>
          ) : null}
          <AppButton onPress={() => router.replace('/(tabs)/decks')}>
            {t('lessons.summary.backToDecks')}
          </AppButton>
        </View>
      </Screen>
    )
  }

  const targetDeckId = deckId ?? completion.deckId
  const knownPercent =
    completion.reviewedCards === 0
      ? t('lessons.progress.percent', { percent: 0 })
      : t('lessons.progress.percent', {
          percent: Math.round((completion.knownCount / completion.reviewedCards) * 100),
        })

  return (
    <Screen scrollable>
      <PageTitle title={t('lessons.summary.completeTitle')} />
      <AppCard style={{ gap: 12, marginBottom: 16, padding: 16 }}>
        <AppText style={{ fontSize: 20, fontWeight: '700' }}>
          {t('lessons.summary.niceWork')}
        </AppText>
        <AppText style={{ color: '#666666' }}>
          {t('lessons.summary.completedAt', { date: formatDateTime(completion.completedAt) })}
        </AppText>
        <View style={{ gap: 6, marginTop: 8 }}>
          <AppText>{t('lessons.summary.cardsInLesson', { count: completion.totalCards })}</AppText>
          <AppText>{t('lessons.summary.reviewed', { count: completion.reviewedCards })}</AppText>
          <AppText style={{ color: '#2e7d32' }}>
            {t('lessons.summary.know', { count: completion.knownCount })}
          </AppText>
          <AppText style={{ color: '#c62828' }}>
            {t('lessons.summary.dontKnow', { count: completion.dontKnowCount })}
          </AppText>
          <AppText style={{ fontWeight: '600' }}>
            {t('lessons.summary.knownPercent', { percent: knownPercent })}
          </AppText>
        </View>
      </AppCard>
      <View style={{ gap: 12 }}>
        {targetDeckId ? (
          <>
            <AppButton
              onPress={() => {
                clearCompletion()
                router.replace(`/lessons/start?deckId=${targetDeckId}`)
              }}
            >
              {t('lessons.summary.startAnother')}
            </AppButton>
            <AppButton
              onPress={() => {
                clearCompletion()
                router.replace(`/decks/${targetDeckId}`)
              }}
            >
              {t('lessons.summary.backToDeck')}
            </AppButton>
          </>
        ) : (
          <AppButton
            onPress={() => {
              clearCompletion()
              router.replace('/(tabs)')
            }}
          >
            {t('lessons.summary.startAnother')}
          </AppButton>
        )}
        <AppButton
          onPress={() => {
            clearCompletion()
            router.replace(targetDeckId ? `/(tabs)/decks` : '/(tabs)')
          }}
        >
          {t(targetDeckId ? 'lessons.summary.backToDecks' : 'common.tabs.home')}
        </AppButton>
      </View>
    </Screen>
  )
}

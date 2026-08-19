import { useTranslation } from 'react-i18next'

import { useDeckLearningStatsQuery } from '@/graphql/generated'
import { formatDateTime } from '@/i18n/formatters'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

type DeckLearningStatsCardProps = {
  deckId: string
  isOwner?: boolean
  onStartLesson?: () => void
}

export function DeckLearningStatsCard({
  deckId,
  isOwner = false,
  onStartLesson,
}: DeckLearningStatsCardProps) {
  const { t } = useTranslation()
  const { data, error, loading, refetch } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  const formatNextReview = (value?: string | null): string => {
    if (!value) {
      return t('lessons.stats.noScheduled')
    }

    return formatDateTime(value)
  }

  if (loading) {
    return <LoadingState message={t('lessons.stats.loading')} />
  }

  if (error || !data?.deckLearningStats) {
    return <ErrorState message={t('lessons.stats.loadError')} onRetry={() => void refetch()} />
  }

  const stats = data.deckLearningStats
  const canStart = isOwner && stats.dueCount > 0 && onStartLesson

  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>{t('lessons.stats.title')}</AppText>
      <AppText>{t('lessons.stats.totalCards', { count: stats.totalCards })}</AppText>
      <AppText>{t('lessons.stats.toLearn', { count: stats.toLearnCount })}</AppText>
      <AppText>{t('lessons.stats.practiced', { count: stats.practicedCount })}</AppText>
      <AppText>{t('lessons.stats.learned', { count: stats.learnedCount })}</AppText>
      <AppText style={{ fontWeight: stats.dueCount > 0 ? '600' : '400' }}>
        {t('lessons.stats.dueNow', { count: stats.dueCount })}
      </AppText>
      <AppText style={{ color: '#666666' }}>
        {t('lessons.stats.nextReview', { value: formatNextReview(stats.nextDueAt) })}
      </AppText>
      {stats.dueCount === 0 && stats.totalCards > 0 ? (
        <AppText style={{ color: '#666666', fontSize: 14 }}>{t('lessons.stats.noneDue')}</AppText>
      ) : null}
      {canStart ? (
        <AppButton onPress={onStartLesson}>{t('decks.deckDetail.startLesson')}</AppButton>
      ) : null}
    </AppCard>
  )
}

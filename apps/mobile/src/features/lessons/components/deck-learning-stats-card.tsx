import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LearningGroup, useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

type DeckLearningStatsCardProps = {
  deckId: string
  isOwner?: boolean
  onStartLesson?: () => void
}

type HeadlineStatProps = {
  accessibilityLabel: string
  count: number
  emoji: string
  emphasize?: boolean
  label: string
}

type GroupStatProps = {
  accessibilityLabel: string
  count: number
  emoji: string
  label: string
}

function HeadlineStat({
  accessibilityLabel,
  count,
  emoji,
  emphasize = false,
  label,
}: HeadlineStatProps) {
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}
    >
      <AppText>{emoji}</AppText>
      <AppText style={{ fontSize: 20, fontWeight: emphasize ? '700' : '600' }}>{count}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>{label}</AppText>
    </View>
  )
}

function GroupStat({ accessibilityLabel, count, emoji, label }: GroupStatProps) {
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={{ alignItems: 'center', flex: 1, gap: 2 }}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
        <AppText>{emoji}</AppText>
        <AppText style={{ fontSize: 20, fontWeight: '700' }}>{count}</AppText>
      </View>
      <AppText style={{ color: '#666666', fontSize: 12, textAlign: 'center' }}>{label}</AppText>
    </View>
  )
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

  if (loading) {
    return <LoadingState message={t('lessons.stats.loading')} />
  }

  if (error || !data?.deckLearningStats) {
    return <ErrorState message={t('lessons.stats.loadError')} onRetry={() => void refetch()} />
  }

  const stats = data.deckLearningStats
  const canStart = isOwner && stats.dueCount > 0 && onStartLesson

  return (
    <>
      <AppCard style={{ gap: 12, marginBottom: 16, padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <HeadlineStat
            accessibilityLabel={t('lessons.stats.totalCards', { count: stats.totalCards })}
            count={stats.totalCards}
            emoji="📚"
            label={t('lessons.stats.totalLabel')}
          />
          <HeadlineStat
            accessibilityLabel={t('lessons.stats.dueNow', { count: stats.dueCount })}
            count={stats.dueCount}
            emoji="⏰"
            emphasize={stats.dueCount > 0}
            label={t('lessons.stats.dueNowLabel')}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <GroupStat
            accessibilityLabel={t('lessons.stats.toLearn', { count: stats.toLearnCount })}
            count={stats.toLearnCount}
            emoji="🌱"
            label={t(`decks.learningGroup.${LearningGroup.ToLearn}`)}
          />
          <GroupStat
            accessibilityLabel={t('lessons.stats.practiced', { count: stats.practicedCount })}
            count={stats.practicedCount}
            emoji="🔁"
            label={t(`decks.learningGroup.${LearningGroup.Practiced}`)}
          />
          <GroupStat
            accessibilityLabel={t('lessons.stats.learned', { count: stats.learnedCount })}
            count={stats.learnedCount}
            emoji="✅"
            label={t(`decks.learningGroup.${LearningGroup.Learned}`)}
          />
        </View>
        {stats.dueCount === 0 && stats.totalCards > 0 ? (
          <AppText style={{ color: '#666666', fontSize: 14 }}>{t('lessons.stats.noneDue')}</AppText>
        ) : null}
      </AppCard>
      {canStart ? (
        <AppButton onPress={onStartLesson} style={{ marginBottom: 16 }}>
          {t('decks.deckDetail.startLesson')}
        </AppButton>
      ) : null}
    </>
  )
}

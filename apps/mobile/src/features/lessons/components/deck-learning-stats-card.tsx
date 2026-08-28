import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LearningGroupBadge } from '@/features/decks/components/learning-group-badge'
import { LEARNING_GROUP_STYLE } from '@/features/decks/utils/learning-group-style'
import { LearningGroup, useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

type DeckLearningStatsCardProps = {
  deckId: string
}

type StatCellProps = {
  accessibilityLabel: string
  count: number
  emoji: string
  label: ReactNode
  tile?: {
    background: string
    color: string
  }
}

const STAT_CARD = {
  backgroundColor: '#ffffff',
  borderColor: '#d0d5dd',
  borderRadius: 12,
  borderWidth: 1,
  marginBottom: 12,
  padding: 12,
}

const STAT_DIVIDER = {
  backgroundColor: '#e4e7ec',
  marginVertical: 4,
  width: 1,
}

function StatCell({ accessibilityLabel, count, emoji, label, tile }: StatCellProps) {
  const labelNode =
    typeof label === 'string' ? (
      <AppText style={{ color: '#667085', fontSize: 12 }}>{label}</AppText>
    ) : (
      label
    )

  if (tile) {
    return (
      <View
        accessible
        accessibilityLabel={accessibilityLabel}
        style={{ alignItems: 'center', flex: 1, gap: 8, justifyContent: 'center', minWidth: 0 }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: tile.background,
            borderRadius: 8,
            flexDirection: 'row',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <AppText>{emoji}</AppText>
          <AppText style={{ color: tile.color, fontSize: 24, fontWeight: '700' }}>{count}</AppText>
        </View>
        {labelNode}
      </View>
    )
  }

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={{ alignItems: 'center', flex: 1, justifyContent: 'center', minWidth: 0 }}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f2f4f7',
            borderRadius: 8,
            height: 36,
            justifyContent: 'center',
            width: 36,
          }}
        >
          <AppText>{emoji}</AppText>
        </View>
        <View style={{ gap: 2 }}>
          <AppText style={{ fontSize: 24, fontWeight: '700' }}>{count}</AppText>
          {labelNode}
        </View>
      </View>
    </View>
  )
}

export function DeckLearningStatsCard({ deckId }: DeckLearningStatsCardProps) {
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
  const toLearn = LEARNING_GROUP_STYLE[LearningGroup.ToLearn]
  const practiced = LEARNING_GROUP_STYLE[LearningGroup.Practiced]
  const learned = LEARNING_GROUP_STYLE[LearningGroup.Learned]

  return (
    <>
      <View style={STAT_CARD}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCell
            accessibilityLabel={t('lessons.stats.totalCards', { count: stats.totalCards })}
            count={stats.totalCards}
            emoji="📚"
            label={t('lessons.stats.totalCardsLabel')}
          />
          <View style={STAT_DIVIDER} />
          <StatCell
            accessibilityLabel={t('lessons.stats.dueNow', { count: stats.dueCount })}
            count={stats.dueCount}
            emoji="⏰"
            label={t('lessons.stats.dueNowLabel')}
          />
        </View>
      </View>
      <View style={STAT_CARD}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCell
            accessibilityLabel={t('lessons.stats.toLearn', { count: stats.toLearnCount })}
            count={stats.toLearnCount}
            emoji={toLearn.emoji}
            label={<LearningGroupBadge learningGroup={LearningGroup.ToLearn} showEmoji={false} />}
            tile={{ background: toLearn.background, color: toLearn.color }}
          />
          <View style={STAT_DIVIDER} />
          <StatCell
            accessibilityLabel={t('lessons.stats.practiced', { count: stats.practicedCount })}
            count={stats.practicedCount}
            emoji={practiced.emoji}
            label={<LearningGroupBadge learningGroup={LearningGroup.Practiced} showEmoji={false} />}
            tile={{ background: practiced.background, color: practiced.color }}
          />
          <View style={STAT_DIVIDER} />
          <StatCell
            accessibilityLabel={t('lessons.stats.learned', { count: stats.learnedCount })}
            count={stats.learnedCount}
            emoji={learned.emoji}
            label={<LearningGroupBadge learningGroup={LearningGroup.Learned} showEmoji={false} />}
            tile={{ background: learned.background, color: learned.color }}
          />
        </View>
      </View>
      {stats.dueCount === 0 && stats.totalCards > 0 ? (
        <AppText style={{ color: '#666666', fontSize: 14, marginBottom: 16 }}>
          {t('lessons.stats.noneDue')}
        </AppText>
      ) : null}
    </>
  )
}

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LEARNING_GROUP_STYLE } from '@/features/decks/utils/learning-group-style'
import { LearningGroup, useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type DeckLearningStatsCompactProps = {
  deckId: string
}

const STAT_DIVIDER = {
  backgroundColor: '#e4e7ec',
  marginVertical: 2,
  width: 1,
}

function GroupColumn({ count, group }: { count: number; group: LearningGroup }) {
  const { t } = useTranslation()
  const style = LEARNING_GROUP_STYLE[group]

  return (
    <View
      accessible
      accessibilityLabel={t(`decks.learningCounters.${counterKey(group)}`, { count })}
      style={{ alignItems: 'center', flex: 1, gap: 2, minWidth: 0 }}
    >
      <AppText style={{ fontSize: 16 }}>{style.emoji}</AppText>
      <AppText style={{ color: style.color, fontSize: 18, fontWeight: '700' }}>{count}</AppText>
      <AppText numberOfLines={1} style={{ color: style.color, fontSize: 10, fontWeight: '600' }}>
        {t(`decks.learningGroup.${group}`)}
      </AppText>
    </View>
  )
}

function counterKey(group: LearningGroup): 'toLearn' | 'practiced' | 'learned' {
  if (group === LearningGroup.ToLearn) {
    return 'toLearn'
  }

  if (group === LearningGroup.Practiced) {
    return 'practiced'
  }

  return 'learned'
}

export function DeckLearningStatsCompact({ deckId }: DeckLearningStatsCompactProps) {
  const { t } = useTranslation()
  const { data, error, loading } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  if (loading && !data?.deckLearningStats) {
    return <View style={{ height: 72 }} />
  }

  if (error || !data?.deckLearningStats) {
    return (
      <AppText style={{ color: '#b42318', fontSize: 12 }}>{t('lessons.stats.loadError')}</AppText>
    )
  }

  const stats = data.deckLearningStats

  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      <GroupColumn count={stats.toLearnCount} group={LearningGroup.ToLearn} />
      <View style={STAT_DIVIDER} />
      <GroupColumn count={stats.practicedCount} group={LearningGroup.Practiced} />
      <View style={STAT_DIVIDER} />
      <GroupColumn count={stats.learnedCount} group={LearningGroup.Learned} />
    </View>
  )
}

export function useDeckDueCount(deckId: string): number {
  const { data } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  return data?.deckLearningStats?.dueCount ?? 0
}

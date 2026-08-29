import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LEARNING_GROUP_STYLE } from '@/features/decks/utils/learning-group-style'
import { LearningGroup, useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type DeckLearningStatsCompactProps = {
  deckId: string
}

const CARD_STAT_EMOJI: Record<LearningGroup, string> = {
  [LearningGroup.ToLearn]: '📖',
  [LearningGroup.Practiced]: '✏️',
  [LearningGroup.Learned]: '🎓',
}

const CARD_STAT_LABEL: Record<LearningGroup, 'learn' | 'practiced' | 'learned'> = {
  [LearningGroup.ToLearn]: 'learn',
  [LearningGroup.Practiced]: 'practiced',
  [LearningGroup.Learned]: 'learned',
}

function GroupTile({ count, group }: { count: number; group: LearningGroup }) {
  const { t } = useTranslation()
  const style = LEARNING_GROUP_STYLE[group]
  const labelKey = CARD_STAT_LABEL[group]

  return (
    <View
      accessible
      accessibilityLabel={t(`decks.learningCounters.${counterKey(group)}`, { count })}
      style={{
        alignItems: 'center',
        backgroundColor: style.background,
        borderRadius: 8,
        flex: 1,
        minWidth: 0,
        paddingHorizontal: 6,
        paddingVertical: 6,
      }}
    >
      <View
        style={{ alignItems: 'center', flexDirection: 'row', gap: 4, justifyContent: 'center' }}
      >
        <AppText style={{ fontSize: 16 }}>{CARD_STAT_EMOJI[group]}</AppText>
        <AppText style={{ color: style.color, fontSize: 18, fontWeight: '700' }}>{count}</AppText>
      </View>
      <AppText
        numberOfLines={1}
        style={{ color: style.color, fontSize: 10, fontWeight: '600', marginTop: 2 }}
      >
        {t(`decks.cardStats.${labelKey}`)}
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
    return <View style={{ height: 52 }} />
  }

  if (error || !data?.deckLearningStats) {
    return (
      <AppText style={{ color: '#b42318', fontSize: 12 }}>{t('lessons.stats.loadError')}</AppText>
    )
  }

  const stats = data.deckLearningStats

  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      <GroupTile count={stats.toLearnCount} group={LearningGroup.ToLearn} />
      <GroupTile count={stats.practicedCount} group={LearningGroup.Practiced} />
      <GroupTile count={stats.learnedCount} group={LearningGroup.Learned} />
    </View>
  )
}

export function useDeckDueCount(deckId: string): number {
  const { data } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  return data?.deckLearningStats?.dueCount ?? 0
}

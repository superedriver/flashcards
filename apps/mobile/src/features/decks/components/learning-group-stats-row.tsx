import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LEARNING_GROUP_STYLE } from '@/features/decks/utils/learning-group-style'
import { LearningGroup } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type LearningGroupStatsRowProps = {
  learnedCount: number
  practicedCount: number
  toLearnCount: number
}

const STAT_EMOJI: Record<LearningGroup, string> = {
  [LearningGroup.ToLearn]: '📖',
  [LearningGroup.Practiced]: '✏️',
  [LearningGroup.Learned]: '✅',
}

const STAT_LABEL: Record<LearningGroup, 'learn' | 'practiced' | 'learned'> = {
  [LearningGroup.ToLearn]: 'learn',
  [LearningGroup.Practiced]: 'practiced',
  [LearningGroup.Learned]: 'learned',
}

const STAT_DIVIDER = {
  backgroundColor: '#e4e7ec',
  marginVertical: 6,
  width: 1,
}

function GroupColumn({ count, group }: { count: number; group: LearningGroup }) {
  const { t } = useTranslation()
  const style = LEARNING_GROUP_STYLE[group]
  const labelKey = STAT_LABEL[group]

  return (
    <View
      accessible
      accessibilityLabel={t(`decks.learningCounters.${counterKey(group)}`, { count })}
      style={{ alignItems: 'center', flex: 1, gap: 1, minWidth: 0, paddingVertical: 6 }}
    >
      <AppText style={{ fontSize: 13 }}>{STAT_EMOJI[group]}</AppText>
      <AppText style={{ color: style.color, fontSize: 24, fontWeight: '700', lineHeight: 28 }}>
        {count}
      </AppText>
      <AppText numberOfLines={1} style={{ color: '#667085', fontSize: 10, fontWeight: '500' }}>
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

export function LearningGroupStatsRow({
  learnedCount,
  practicedCount,
  toLearnCount,
}: LearningGroupStatsRowProps) {
  return (
    <View
      style={{
        backgroundColor: '#f9fafb',
        borderColor: '#e4e7ec',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <GroupColumn count={toLearnCount} group={LearningGroup.ToLearn} />
      <View style={STAT_DIVIDER} />
      <GroupColumn count={practicedCount} group={LearningGroup.Practiced} />
      <View style={STAT_DIVIDER} />
      <GroupColumn count={learnedCount} group={LearningGroup.Learned} />
    </View>
  )
}

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LEARNING_GROUP_STYLE } from '@/features/decks/utils/learning-group-style'
import { LearningGroup, useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type DeckLearningStatsCompactProps = {
  deckId: string
}

type GroupCounterProps = {
  group: LearningGroup
  label: string
}

function GroupCounter({ group, label }: GroupCounterProps) {
  const style = LEARNING_GROUP_STYLE[group]

  return (
    <View
      accessibilityLabel={label}
      accessible
      style={{
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: style.background,
        borderRadius: 6,
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
    >
      <AppText style={{ fontSize: 12 }}>{style.emoji}</AppText>
      <AppText style={{ color: style.color, fontSize: 11, fontWeight: '600' }}>{label}</AppText>
    </View>
  )
}

export function DeckLearningStatsCompact({ deckId }: DeckLearningStatsCompactProps) {
  const { t } = useTranslation()
  const { data, loading } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  if (loading && !data?.deckLearningStats) {
    return null
  }

  const stats = data?.deckLearningStats

  if (!stats) {
    return null
  }

  return (
    <View style={{ gap: 4 }}>
      <GroupCounter
        group={LearningGroup.ToLearn}
        label={t('decks.learningCounters.toLearn', { count: stats.toLearnCount })}
      />
      <GroupCounter
        group={LearningGroup.Practiced}
        label={t('decks.learningCounters.practiced', { count: stats.practicedCount })}
      />
      <GroupCounter
        group={LearningGroup.Learned}
        label={t('decks.learningCounters.learned', { count: stats.learnedCount })}
      />
      {stats.dueCount > 0 ? (
        <AppText style={{ color: '#1a56db', fontSize: 12, fontWeight: '600' }}>
          {t('decks.learningCounters.due', { count: stats.dueCount })}
        </AppText>
      ) : null}
    </View>
  )
}

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type DeckLearningStatsCompactProps = {
  deckId: string
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
    <View style={{ gap: 2 }}>
      <AppText style={{ color: '#555555', fontSize: 12 }}>
        {t('decks.learningCounters.compact', {
          toLearn: stats.toLearnCount,
          practiced: stats.practicedCount,
          learned: stats.learnedCount,
        })}
      </AppText>
      {stats.dueCount > 0 ? (
        <AppText style={{ color: '#1a56db', fontSize: 12, fontWeight: '600' }}>
          {t('decks.learningCounters.due', { count: stats.dueCount })}
        </AppText>
      ) : null}
    </View>
  )
}

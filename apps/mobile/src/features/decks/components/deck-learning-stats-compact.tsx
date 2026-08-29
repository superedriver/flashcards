import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LearningGroupStatsRow } from '@/features/decks/components/learning-group-stats-row'
import { useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type DeckLearningStatsCompactProps = {
  deckId: string
}

export function DeckLearningStatsCompact({ deckId }: DeckLearningStatsCompactProps) {
  const { t } = useTranslation()
  const { data, error, loading } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  if (loading && !data?.deckLearningStats) {
    return <View style={{ height: 64 }} />
  }

  if (error || !data?.deckLearningStats) {
    return (
      <AppText style={{ color: '#b42318', fontSize: 12 }}>{t('lessons.stats.loadError')}</AppText>
    )
  }

  const stats = data.deckLearningStats

  return (
    <LearningGroupStatsRow
      learnedCount={stats.learnedCount}
      practicedCount={stats.practicedCount}
      toLearnCount={stats.toLearnCount}
    />
  )
}

export function useDeckDueCount(deckId: string): number {
  const { data } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  return data?.deckLearningStats?.dueCount ?? 0
}

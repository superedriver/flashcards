import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LearningGroupStatsRow } from '@/features/decks/components/learning-group-stats-row'
import { AppText } from '@/ui/primitives'

type HomeLearningCountersProps = {
  dueCount: number
  learnedCount: number
  practicedCount: number
  toLearnCount: number
}

export function HomeLearningCounters({
  dueCount,
  learnedCount,
  practicedCount,
  toLearnCount,
}: HomeLearningCountersProps) {
  const { t } = useTranslation()

  return (
    <View style={{ gap: 16, width: '100%' }}>
      <AppText style={{ fontSize: 18, fontWeight: '700' }}>{t('home.todayReview')}</AppText>

      <View style={{ alignItems: 'center', gap: 4 }}>
        <AppText
          accessibilityLabel={t('home.counters.due', { count: dueCount })}
          style={{ color: '#1a56db', fontSize: 48, fontWeight: '700', lineHeight: 56 }}
        >
          {dueCount}
        </AppText>
        <AppText style={{ color: '#667085', fontSize: 14, fontWeight: '500' }}>
          {t('home.counters.dueNowLabel')}
        </AppText>
      </View>

      <LearningGroupStatsRow
        learnedCount={learnedCount}
        practicedCount={practicedCount}
        toLearnCount={toLearnCount}
      />
    </View>
  )
}

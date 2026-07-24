import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppCard, AppText } from '@/ui/primitives'

type HomeLearningCountersProps = {
  learnedCount: number
  practicedCount: number
  toLearnCount: number
}

export function HomeLearningCounters({
  learnedCount,
  practicedCount,
  toLearnCount,
}: HomeLearningCountersProps) {
  const { t } = useTranslation()

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <CounterCard label={t('home.counters.toLearn')} value={toLearnCount} />
      <CounterCard label={t('home.counters.practiced')} value={practicedCount} />
      <CounterCard label={t('home.counters.learned')} value={learnedCount} />
    </View>
  )
}

function CounterCard({ label, value }: { label: string; value: number }) {
  return (
    <AppCard style={{ flex: 1, gap: 4, padding: 12 }}>
      <AppText style={{ color: '#666666', fontSize: 13 }}>{label}</AppText>
      <AppText style={{ fontSize: 22, fontWeight: '700' }}>{value}</AppText>
    </AppCard>
  )
}

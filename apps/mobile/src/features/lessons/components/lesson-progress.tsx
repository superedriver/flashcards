import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type LessonProgressProps = {
  currentNumber: number
  reviewedCount: number
  totalCards: number
}

export function LessonProgress({ currentNumber, reviewedCount, totalCards }: LessonProgressProps) {
  const { t } = useTranslation()
  const progressPercent = totalCards === 0 ? 0 : Math.round((reviewedCount / totalCards) * 100)

  return (
    <View
      accessibilityLabel={t('lessons.progress.accessibilityLabel', {
        current: currentNumber,
        reviewed: reviewedCount,
        total: totalCards,
        percent: progressPercent,
      })}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: totalCards, min: 0, now: reviewedCount }}
      style={{ gap: 8, marginBottom: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ fontWeight: '600' }}>
          {t('lessons.progress.cardOf', { current: currentNumber, total: totalCards })}
        </AppText>
        <AppText style={{ color: '#666666' }}>
          {t('lessons.progress.percent', { percent: progressPercent })}
        </AppText>
      </View>
      <AppText style={{ color: '#666666' }}>
        {t('lessons.progress.reviewedOf', { reviewed: reviewedCount, total: totalCards })}
      </AppText>
      <View
        style={{
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          height: 10,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <View
          style={{
            backgroundColor: '#4caf50',
            height: '100%',
            width: `${progressPercent}%`,
          }}
        />
      </View>
    </View>
  )
}

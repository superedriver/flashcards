import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type LessonProgressProps = {
  currentNumber: number
  reviewedCount: number
  totalCards: number
}

export function LessonProgress({ currentNumber, reviewedCount, totalCards }: LessonProgressProps) {
  const progressPercent = totalCards === 0 ? 0 : Math.round((reviewedCount / totalCards) * 100)

  return (
    <View
      accessibilityLabel={`Card ${currentNumber} of ${totalCards}. Reviewed ${reviewedCount} of ${totalCards}. ${progressPercent} percent complete.`}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: totalCards, min: 0, now: reviewedCount }}
      style={{ gap: 8, marginBottom: 16 }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ fontWeight: '600' }}>
          Card {currentNumber} of {totalCards}
        </AppText>
        <AppText style={{ color: '#666666' }}>{progressPercent}%</AppText>
      </View>
      <AppText style={{ color: '#666666' }}>
        Reviewed {reviewedCount} of {totalCards}
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

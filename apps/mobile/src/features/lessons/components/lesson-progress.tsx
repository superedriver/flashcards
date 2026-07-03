import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type LessonProgressProps = {
  currentNumber: number
  reviewedCount: number
  totalCards: number
}

export function LessonProgress({ currentNumber, reviewedCount, totalCards }: LessonProgressProps) {
  const progress = totalCards === 0 ? 0 : reviewedCount / totalCards

  return (
    <View style={{ gap: 8, marginBottom: 16 }}>
      <AppText>
        Card {currentNumber} of {totalCards}
      </AppText>
      <AppText>
        Reviewed {reviewedCount} / {totalCards}
      </AppText>
      <View
        style={{
          backgroundColor: '#e0e0e0',
          borderRadius: 4,
          height: 8,
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <View
          style={{
            backgroundColor: '#4caf50',
            height: '100%',
            width: `${Math.round(progress * 100)}%`,
          }}
        />
      </View>
    </View>
  )
}

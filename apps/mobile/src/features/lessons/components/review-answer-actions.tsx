import { View } from 'react-native'

import { ReviewAnswer } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'

type ReviewAnswerActionsProps = {
  disabled?: boolean
  onAnswer: (answer: ReviewAnswer) => void
}

export function ReviewAnswerActions({ disabled = false, onAnswer }: ReviewAnswerActionsProps) {
  return (
    <View style={{ gap: 12 }}>
      <AppButton disabled={disabled} onPress={() => onAnswer(ReviewAnswer.DontKnow)}>
        Don&apos;t know
      </AppButton>
      <AppButton disabled={disabled} onPress={() => onAnswer(ReviewAnswer.Know)}>
        Know
      </AppButton>
    </View>
  )
}

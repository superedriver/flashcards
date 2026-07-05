import { View } from 'react-native'

import { ReviewAnswer } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'

type ReviewAnswerActionsProps = {
  disabled?: boolean
  isRevealed?: boolean
  isSubmitting?: boolean
  onAnswer: (answer: ReviewAnswer) => void
}

export function ReviewAnswerActions({
  disabled = false,
  isRevealed = false,
  isSubmitting = false,
  onAnswer,
}: ReviewAnswerActionsProps) {
  const isDisabled = disabled || isSubmitting || !isRevealed

  return (
    <View style={{ gap: 12 }}>
      {!isRevealed ? (
        <AppText style={{ color: '#666666', fontSize: 14, textAlign: 'center' }}>
          Reveal the answer to rate how well you knew it.
        </AppText>
      ) : null}

      <AppButton
        background="#c62828"
        color="white"
        disabled={isDisabled}
        onPress={() => onAnswer(ReviewAnswer.DontKnow)}
      >
        {isSubmitting ? 'Saving...' : "Don't know"}
      </AppButton>
      <AppButton
        background="#2e7d32"
        color="white"
        disabled={isDisabled}
        onPress={() => onAnswer(ReviewAnswer.Know)}
      >
        {isSubmitting ? 'Saving...' : 'Know'}
      </AppButton>
    </View>
  )
}

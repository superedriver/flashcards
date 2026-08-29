import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { ReviewAnswer } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps, destructiveButtonA11yProps } from '@/ui/utils/accessibility'

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
  const { t } = useTranslation()
  const isDisabled = disabled || isSubmitting || !isRevealed
  const dontKnowLabel = t('lessons.reviewActions.dontKnow')
  const knowLabel = t('lessons.reviewActions.know')

  return (
    <View style={{ gap: 12 }}>
      {isRevealed ? (
        <AppText style={{ color: '#667085', fontSize: 13, textAlign: 'center' }}>
          {t('lessons.reviewActions.swipeHint')}
        </AppText>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable
          {...destructiveButtonA11yProps(dontKnowLabel, t('lessons.reviewActions.dontKnowHint'))}
          disabled={isDisabled}
          onPress={() => onAnswer(ReviewAnswer.DontKnow)}
          style={{
            alignItems: 'center',
            borderColor: '#c62828',
            borderRadius: 10,
            borderWidth: 1,
            flex: 1,
            opacity: isDisabled ? 0.4 : 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <AppText style={{ color: '#c62828', fontSize: 14, fontWeight: '600' }}>
            {`← ${dontKnowLabel}`}
          </AppText>
        </Pressable>
        <Pressable
          {...buttonA11yProps(knowLabel, t('lessons.reviewActions.knowHint'))}
          disabled={isDisabled}
          onPress={() => onAnswer(ReviewAnswer.Know)}
          style={{
            alignItems: 'center',
            borderColor: '#2e7d32',
            borderRadius: 10,
            borderWidth: 1,
            flex: 1,
            opacity: isDisabled ? 0.4 : 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <AppText style={{ color: '#2e7d32', fontSize: 14, fontWeight: '600' }}>
            {`${knowLabel} →`}
          </AppText>
        </Pressable>
      </View>
    </View>
  )
}

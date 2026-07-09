import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { ReviewAnswer } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { destructiveButtonA11yProps } from '@/ui/utils/accessibility'

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

  return (
    <View style={{ gap: 12 }}>
      {!isRevealed ? (
        <AppText style={{ color: '#666666', fontSize: 14, textAlign: 'center' }}>
          {t('lessons.reviewActions.revealHint')}
        </AppText>
      ) : null}

      <AppButton
        {...destructiveButtonA11yProps(
          t('lessons.reviewActions.dontKnow'),
          t('lessons.reviewActions.dontKnowHint'),
        )}
        background="#c62828"
        color="white"
        disabled={isDisabled}
        onPress={() => onAnswer(ReviewAnswer.DontKnow)}
      >
        {isSubmitting ? t('common.saving') : t('lessons.reviewActions.dontKnow')}
      </AppButton>
      <AppButton
        accessibilityHint={t('lessons.reviewActions.knowHint')}
        accessibilityLabel={t('lessons.reviewActions.know')}
        background="#2e7d32"
        color="white"
        disabled={isDisabled}
        onPress={() => onAnswer(ReviewAnswer.Know)}
      >
        {isSubmitting ? t('common.saving') : t('lessons.reviewActions.know')}
      </AppButton>
    </View>
  )
}

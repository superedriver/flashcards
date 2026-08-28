import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { LEARNING_GROUP_STYLE } from '@/features/decks/utils/learning-group-style'
import { LearningGroup } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type LearningGroupBadgeProps = {
  learningGroup?: LearningGroup | null
  showEmoji?: boolean
}

export function LearningGroupBadge({ learningGroup, showEmoji = true }: LearningGroupBadgeProps) {
  const { t } = useTranslation()

  if (!learningGroup) {
    return null
  }

  const style = LEARNING_GROUP_STYLE[learningGroup]

  return (
    <View
      style={{
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: style.background,
        borderRadius: 6,
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
    >
      {showEmoji ? <AppText style={{ fontSize: 12 }}>{style.emoji}</AppText> : null}
      <AppText style={{ color: style.color, fontSize: 12, fontWeight: '600' }}>
        {t(`decks.learningGroup.${learningGroup}`)}
      </AppText>
    </View>
  )
}

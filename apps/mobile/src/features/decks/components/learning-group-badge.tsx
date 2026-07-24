import { useTranslation } from 'react-i18next'

import { LearningGroup } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type LearningGroupBadgeProps = {
  learningGroup?: LearningGroup | null
}

const BADGE_COLORS: Record<LearningGroup, { background: string; color: string }> = {
  [LearningGroup.ToLearn]: { background: '#e8f0fe', color: '#1a56db' },
  [LearningGroup.Practiced]: { background: '#fef3c7', color: '#92400e' },
  [LearningGroup.Learned]: { background: '#dcfce7', color: '#166534' },
}

export function LearningGroupBadge({ learningGroup }: LearningGroupBadgeProps) {
  const { t } = useTranslation()

  if (!learningGroup) {
    return null
  }

  const colors = BADGE_COLORS[learningGroup]

  return (
    <AppText
      style={{
        alignSelf: 'flex-start',
        backgroundColor: colors.background,
        borderRadius: 6,
        color: colors.color,
        fontSize: 12,
        fontWeight: '600',
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
    >
      {t(`decks.learningGroup.${learningGroup}`)}
    </AppText>
  )
}

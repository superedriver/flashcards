import { LearningGroup } from '@/graphql/generated'

export type LearningGroupStyle = {
  background: string
  color: string
  emoji: string
}

export const LEARNING_GROUP_STYLE: Record<LearningGroup, LearningGroupStyle> = {
  [LearningGroup.ToLearn]: { background: '#e8f0fe', color: '#1a56db', emoji: '🌱' },
  [LearningGroup.Practiced]: { background: '#fef3c7', color: '#92400e', emoji: '🔁' },
  [LearningGroup.Learned]: { background: '#dcfce7', color: '#166534', emoji: '✅' },
}

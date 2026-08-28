import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { LEARNING_GROUP_STYLE } from '@/features/decks/utils/learning-group-style'
import { LearningGroup, useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type DeckLearningStatsCardProps = {
  deckId: string
  isOwner?: boolean
  onStartLesson?: () => void
}

type StatCellProps = {
  accessibilityLabel: string
  chipBackground?: string
  count: number
  emoji: string
  label: string
  labelColor?: string
}

const STAT_CARD = {
  backgroundColor: '#ffffff',
  borderColor: '#d0d5dd',
  borderRadius: 12,
  borderWidth: 1,
  marginBottom: 12,
  padding: 12,
}

const STAT_DIVIDER = {
  backgroundColor: '#e4e7ec',
  marginVertical: 4,
  width: 1,
}

function StatCell({
  accessibilityLabel,
  chipBackground = '#f2f4f7',
  count,
  emoji,
  label,
  labelColor = '#667085',
}: StatCellProps) {
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={{ alignItems: 'center', flex: 1, justifyContent: 'center', minWidth: 0 }}
    >
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: chipBackground,
            borderRadius: 8,
            height: 36,
            justifyContent: 'center',
            width: 36,
          }}
        >
          <AppText>{emoji}</AppText>
        </View>
        <View>
          <AppText style={{ fontSize: 24, fontWeight: '700' }}>{count}</AppText>
          <AppText style={{ color: labelColor, fontSize: 12 }}>{label}</AppText>
        </View>
      </View>
    </View>
  )
}

export function DeckLearningStatsCard({
  deckId,
  isOwner = false,
  onStartLesson,
}: DeckLearningStatsCardProps) {
  const { t } = useTranslation()
  const { data, error, loading, refetch } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  if (loading) {
    return <LoadingState message={t('lessons.stats.loading')} />
  }

  if (error || !data?.deckLearningStats) {
    return <ErrorState message={t('lessons.stats.loadError')} onRetry={() => void refetch()} />
  }

  const stats = data.deckLearningStats
  const canStart = isOwner && stats.dueCount > 0 && onStartLesson

  return (
    <>
      <View style={STAT_CARD}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCell
            accessibilityLabel={t('lessons.stats.totalCards', { count: stats.totalCards })}
            count={stats.totalCards}
            emoji="📚"
            label={t('lessons.stats.totalCardsLabel')}
          />
          <View style={STAT_DIVIDER} />
          <StatCell
            accessibilityLabel={t('lessons.stats.dueNow', { count: stats.dueCount })}
            count={stats.dueCount}
            emoji="⏰"
            label={t('lessons.stats.dueNowLabel')}
          />
        </View>
      </View>
      <View style={STAT_CARD}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCell
            accessibilityLabel={t('lessons.stats.toLearn', { count: stats.toLearnCount })}
            chipBackground={LEARNING_GROUP_STYLE[LearningGroup.ToLearn].background}
            count={stats.toLearnCount}
            emoji={LEARNING_GROUP_STYLE[LearningGroup.ToLearn].emoji}
            label={t(`decks.learningGroup.${LearningGroup.ToLearn}`)}
            labelColor={LEARNING_GROUP_STYLE[LearningGroup.ToLearn].color}
          />
          <View style={STAT_DIVIDER} />
          <StatCell
            accessibilityLabel={t('lessons.stats.practiced', { count: stats.practicedCount })}
            chipBackground={LEARNING_GROUP_STYLE[LearningGroup.Practiced].background}
            count={stats.practicedCount}
            emoji={LEARNING_GROUP_STYLE[LearningGroup.Practiced].emoji}
            label={t(`decks.learningGroup.${LearningGroup.Practiced}`)}
            labelColor={LEARNING_GROUP_STYLE[LearningGroup.Practiced].color}
          />
          <View style={STAT_DIVIDER} />
          <StatCell
            accessibilityLabel={t('lessons.stats.learned', { count: stats.learnedCount })}
            chipBackground={LEARNING_GROUP_STYLE[LearningGroup.Learned].background}
            count={stats.learnedCount}
            emoji={LEARNING_GROUP_STYLE[LearningGroup.Learned].emoji}
            label={t(`decks.learningGroup.${LearningGroup.Learned}`)}
            labelColor={LEARNING_GROUP_STYLE[LearningGroup.Learned].color}
          />
        </View>
      </View>
      {stats.dueCount === 0 && stats.totalCards > 0 ? (
        <AppText style={{ color: '#666666', fontSize: 14, marginBottom: 16 }}>
          {t('lessons.stats.noneDue')}
        </AppText>
      ) : null}
      {canStart ? (
        <View style={{ alignItems: 'center', alignSelf: 'center', gap: 8, marginBottom: 16 }}>
          <Pressable
            {...buttonA11yProps(t('decks.deckDetail.startLesson'))}
            hitSlop={8}
            style={{
              alignItems: 'center',
              borderColor: '#1a56db',
              borderRadius: 40,
              borderWidth: 2,
              height: 72,
              justifyContent: 'center',
              width: 72,
            }}
            onPress={onStartLesson}
          >
            <Ionicons color="#1a56db" name="play" size={36} style={{ marginLeft: 4 }} />
          </Pressable>
          <AppText style={{ color: '#667085', fontSize: 14, fontWeight: '600' }}>
            {t('decks.deckDetail.startLesson')}
          </AppText>
        </View>
      ) : null}
    </>
  )
}

import { useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

type DeckLearningStatsCardProps = {
  deckId: string
}

function formatNextReview(value?: string | null): string {
  if (!value) {
    return '—'
  }

  return new Date(value).toLocaleString()
}

export function DeckLearningStatsCard({ deckId }: DeckLearningStatsCardProps) {
  const { data, error, loading, refetch } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  if (loading) {
    return <LoadingState message="Loading learning stats..." />
  }

  if (error || !data?.deckLearningStats) {
    return <ErrorState message="Could not load learning stats." onRetry={() => void refetch()} />
  }

  const stats = data.deckLearningStats

  return (
    <AppCard style={{ gap: 8, marginBottom: 16, padding: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Learning stats</AppText>
      <AppText>Total cards: {stats.totalCards}</AppText>
      <AppText>New: {stats.newCards}</AppText>
      <AppText>Due: {stats.dueCards}</AppText>
      <AppText>Reviewed: {stats.reviewedCards}</AppText>
      <AppText>Next review: {formatNextReview(stats.nextDueAt)}</AppText>
    </AppCard>
  )
}

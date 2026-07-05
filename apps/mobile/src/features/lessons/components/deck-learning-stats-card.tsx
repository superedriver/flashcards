import { useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppCard, AppText } from '@/ui/primitives'
import { ErrorState, LoadingState } from '@/ui/components'

type DeckLearningStatsCardProps = {
  deckId: string
}

function formatNextReview(value?: string | null): string {
  if (!value) {
    return 'No cards scheduled yet'
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
      <AppText style={{ fontWeight: stats.dueCards > 0 ? '600' : '400' }}>
        Due now: {stats.dueCards}
      </AppText>
      <AppText>Reviewed: {stats.reviewedCards}</AppText>
      <AppText style={{ color: '#666666' }}>
        Next review: {formatNextReview(stats.nextDueAt)}
      </AppText>
      {stats.dueCards === 0 && stats.totalCards > 0 ? (
        <AppText style={{ color: '#666666', fontSize: 14 }}>
          No cards are due right now. Check back later or add more cards.
        </AppText>
      ) : null}
    </AppCard>
  )
}

import type { ApolloCache } from '@apollo/client'

export const LEARNING_STATS_REFETCH_QUERIES = ['DeckLearningStats', 'HomeLearningProgress'] as const

export const CARD_MUTATION_REFETCH_QUERIES = [
  'DeckCards',
  ...LEARNING_STATS_REFETCH_QUERIES,
] as const

export function evictCardCountCache(cache: ApolloCache<unknown>): void {
  cache.evict({ fieldName: 'deckLearningStats' })
  cache.evict({ fieldName: 'homeLearningProgress' })
  cache.gc()
}

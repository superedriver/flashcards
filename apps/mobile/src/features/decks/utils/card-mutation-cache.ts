import type { ApolloCache } from '@apollo/client'

export const CARD_MUTATION_REFETCH_QUERIES = [
  'DeckCards',
  'DeckLearningStats',
  'HomeLearningProgress',
] as const

export function evictCardCountCache(cache: ApolloCache<unknown>): void {
  cache.evict({ fieldName: 'deckLearningStats' })
  cache.evict({ fieldName: 'homeLearningProgress' })
  cache.gc()
}

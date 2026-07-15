import type { ActiveDeckPreviewQuery } from '@/graphql/generated'

export type DeckPreviewSession = NonNullable<ActiveDeckPreviewQuery['activeDeckPreview']>

export function countPreviewReadyCards(session: DeckPreviewSession): number {
  return session.cards.filter((card) => card.back.trim().length > 0).length
}

export function countMissingBacks(session: DeckPreviewSession): number {
  return session.cards.filter((card) => card.back.trim().length === 0).length
}

export function countMissingExamples(session: DeckPreviewSession): number {
  return session.cards.filter((card) => !card.example || card.example.trim().length === 0).length
}

export function isPreviewSessionActiveError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }

  const graphQLErrors = (
    error as {
      graphQLErrors?: Array<{ extensions?: { appCode?: string; code?: string } }>
    }
  ).graphQLErrors

  if (!graphQLErrors) {
    return false
  }

  return graphQLErrors.some((item) => item.extensions?.appCode === 'PREVIEW_SESSION_ACTIVE')
}

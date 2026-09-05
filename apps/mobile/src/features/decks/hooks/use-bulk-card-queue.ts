import { useCallback, useState } from 'react'

import type { BulkCardPair } from '@/features/decks/utils/parse-bulk-card-lines'

export function useBulkCardQueue() {
  const [pairs, setPairs] = useState<BulkCardPair[]>([])

  const start = useCallback((nextPairs: BulkCardPair[]) => {
    setPairs(nextPairs)
  }, [])

  const clear = useCallback(() => {
    setPairs([])
  }, [])

  return {
    clear,
    current: pairs[0] ?? null,
    length: pairs.length,
    pairs,
    start,
  }
}

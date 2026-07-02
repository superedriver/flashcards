export type Sm2Quality = 0 | 1 | 2 | 3 | 4 | 5

export type Sm2Input = {
  quality: Sm2Quality
  previousEaseFactor?: number | null
  previousIntervalDays?: number | null
  previousRepetitions?: number | null
  reviewedAt: Date
}

export type Sm2Result = {
  easeFactor: number
  intervalDays: number
  repetitions: number
  dueAt: Date
}

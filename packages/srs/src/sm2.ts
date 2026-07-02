import { Sm2Input, Sm2Result } from './types'

const DEFAULT_EASE_FACTOR = 2.5
const MIN_EASE_FACTOR = 1.3

export function calculateNextReview(input: Sm2Input): Sm2Result {
  if (!Number.isInteger(input.quality) || input.quality < 0 || input.quality > 5) {
    throw new Error('SM-2 quality must be an integer from 0 to 5.')
  }

  const previousEaseFactor = input.previousEaseFactor ?? DEFAULT_EASE_FACTOR
  const previousIntervalDays = input.previousIntervalDays ?? 0
  const previousRepetitions = input.previousRepetitions ?? 0

  const easeFactor = calculateEaseFactor(previousEaseFactor, input.quality)

  let intervalDays: number
  let repetitions: number

  if (input.quality < 3) {
    repetitions = 0
    intervalDays = 1
  } else {
    repetitions = previousRepetitions + 1

    if (previousRepetitions === 0) {
      intervalDays = 1
    } else if (previousRepetitions === 1) {
      intervalDays = 6
    } else {
      intervalDays = Math.round(previousIntervalDays * easeFactor)
    }
  }

  return {
    easeFactor,
    intervalDays,
    repetitions,
    dueAt: addDays(input.reviewedAt, intervalDays),
  }
}

function calculateEaseFactor(previousEaseFactor: number, quality: number): number {
  const qualityDelta = 5 - quality
  const nextEaseFactor = previousEaseFactor + (0.1 - qualityDelta * (0.08 + qualityDelta * 0.02))

  return Math.max(MIN_EASE_FACTOR, roundToTwoDecimals(nextEaseFactor))
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}

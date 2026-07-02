import { describe, expect, it } from 'vitest'

import { calculateNextReview } from './sm2'

describe('calculateNextReview (SM-2)', () => {
  it('new KNOW review', () => {
    const reviewedAt = new Date('2026-01-01T10:00:00.000Z')

    const result = calculateNextReview({
      quality: 4,
      previousEaseFactor: null,
      previousIntervalDays: null,
      previousRepetitions: null,
      reviewedAt,
    })

    expect(result.repetitions).toBe(1)
    expect(result.intervalDays).toBe(1)
    expect(result.easeFactor).toBe(2.5)
    expect(result.dueAt.toISOString()).toBe('2026-01-02T10:00:00.000Z')
  })

  it('second KNOW review', () => {
    const reviewedAt = new Date('2026-01-02T10:00:00.000Z')

    const result = calculateNextReview({
      quality: 4,
      previousEaseFactor: 2.5,
      previousIntervalDays: 1,
      previousRepetitions: 1,
      reviewedAt,
    })

    expect(result.repetitions).toBe(2)
    expect(result.intervalDays).toBe(6)
    expect(result.easeFactor).toBe(2.5)
    expect(result.dueAt.toISOString()).toBe('2026-01-08T10:00:00.000Z')
  })

  it('third KNOW review', () => {
    const reviewedAt = new Date('2026-01-08T10:00:00.000Z')

    const result = calculateNextReview({
      quality: 4,
      previousEaseFactor: 2.5,
      previousIntervalDays: 6,
      previousRepetitions: 2,
      reviewedAt,
    })

    expect(result.repetitions).toBe(3)
    expect(result.intervalDays).toBe(15)
    expect(result.easeFactor).toBe(2.5)
    expect(result.dueAt.toISOString()).toBe('2026-01-23T10:00:00.000Z')
  })

  it('DONT_KNOW resets repetitions', () => {
    const reviewedAt = new Date('2026-01-08T10:00:00.000Z')

    const result = calculateNextReview({
      quality: 1,
      previousEaseFactor: 2.5,
      previousIntervalDays: 6,
      previousRepetitions: 2,
      reviewedAt,
    })

    expect(result.repetitions).toBe(0)
  })

  it('DONT_KNOW interval becomes 1 and dueAt is reviewedAt + intervalDays', () => {
    const reviewedAt = new Date('2026-01-08T10:00:00.000Z')

    const result = calculateNextReview({
      quality: 1,
      previousEaseFactor: 2.5,
      previousIntervalDays: 6,
      previousRepetitions: 2,
      reviewedAt,
    })

    expect(result.intervalDays).toBe(1)
    expect(result.dueAt.toISOString()).toBe('2026-01-09T10:00:00.000Z')
  })

  it('ease factor cannot go below 1.3', () => {
    const reviewedAt = new Date('2026-01-01T10:00:00.000Z')

    const result = calculateNextReview({
      quality: 0,
      previousEaseFactor: 1.3,
      previousIntervalDays: 1,
      previousRepetitions: 0,
      reviewedAt,
    })

    expect(result.easeFactor).toBe(1.3)
  })

  it('invalid quality throws', () => {
    const reviewedAt = new Date('2026-01-01T10:00:00.000Z')

    expect(() =>
      calculateNextReview({
        // @ts-expect-error invalid test case
        quality: 6,
        previousEaseFactor: null,
        previousIntervalDays: null,
        previousRepetitions: null,
        reviewedAt,
      }),
    ).toThrow('SM-2 quality must be an integer from 0 to 5.')

    expect(() =>
      calculateNextReview({
        // @ts-expect-error invalid test case
        quality: 1.5,
        previousEaseFactor: null,
        previousIntervalDays: null,
        previousRepetitions: null,
        reviewedAt,
      }),
    ).toThrow('SM-2 quality must be an integer from 0 to 5.')
  })
})

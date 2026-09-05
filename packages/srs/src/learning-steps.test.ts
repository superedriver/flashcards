import { describe, expect, it } from 'vitest'
import {
  calculateNextLearningState,
  learningGroupForStep,
  resolveReviewPresentationMode,
  toEffectivePresentationMode,
} from './learning-steps'

const reviewedAt = new Date('2026-01-01T00:00:00.000Z')

const MS_PER_SECOND = 1000
const MS_PER_MINUTE = 60 * MS_PER_SECOND
const MS_PER_HOUR = 60 * MS_PER_MINUTE
const MS_PER_DAY = 24 * MS_PER_HOUR

function dueAfter(ms: number): Date {
  return new Date(reviewedAt.getTime() + ms)
}

describe('calculateNextLearningState — KNOW', () => {
  it.each([
    { previous: 0, next: 1, ms: 90 * MS_PER_SECOND },
    { previous: 1, next: 2, ms: 30 * MS_PER_MINUTE },
    { previous: 2, next: 3, ms: 12 * MS_PER_HOUR },
    { previous: 3, next: 4, ms: 24 * MS_PER_HOUR },
    { previous: 4, next: 5, ms: 2 * MS_PER_DAY },
    { previous: 5, next: 6, ms: 7 * MS_PER_DAY },
    { previous: 6, next: 7, ms: 14 * MS_PER_DAY },
  ])('advances $previous → $next with correct interval', ({ previous, next, ms }) => {
    const result = calculateNextLearningState({
      answer: 'KNOW',
      previousLearningStep: previous,
      previousLongReviewSuccessCount: 0,
      reviewedAt,
    })

    expect(result).toEqual({
      learningStep: next,
      longReviewSuccessCount: 0,
      dueAt: dueAfter(ms),
    })
  })

  it('enters step 8 from 7 with count 0 and +60d', () => {
    const result = calculateNextLearningState({
      answer: 'KNOW',
      previousLearningStep: 7,
      previousLongReviewSuccessCount: 3,
      reviewedAt,
    })

    expect(result).toEqual({
      learningStep: 8,
      longReviewSuccessCount: 0,
      dueAt: dueAfter(60 * MS_PER_DAY),
    })
  })

  it.each([
    { previousCount: 0, nextCount: 1, days: 60 },
    { previousCount: 1, nextCount: 2, days: 90 },
    { previousCount: 2, nextCount: 3, days: 180 },
    { previousCount: 3, nextCount: 4, days: 180 },
  ])(
    'on step 8 increments count $previousCount → $nextCount with +$days d',
    ({ previousCount, nextCount, days }) => {
      const result = calculateNextLearningState({
        answer: 'KNOW',
        previousLearningStep: 8,
        previousLongReviewSuccessCount: previousCount,
        reviewedAt,
      })

      expect(result).toEqual({
        learningStep: 8,
        longReviewSuccessCount: nextCount,
        dueAt: dueAfter(days * MS_PER_DAY),
      })
    },
  )
})

describe('calculateNextLearningState — DONT_KNOW', () => {
  it.each([0, 1])('keeps step %s and schedules +2m', (step) => {
    const result = calculateNextLearningState({
      answer: 'DONT_KNOW',
      previousLearningStep: step,
      previousLongReviewSuccessCount: 0,
      reviewedAt,
    })

    expect(result).toEqual({
      learningStep: step,
      longReviewSuccessCount: 0,
      dueAt: dueAfter(2 * MS_PER_MINUTE),
    })
  })

  it.each([
    { previous: 2, next: 1 },
    { previous: 3, next: 2 },
    { previous: 4, next: 3 },
    { previous: 5, next: 4 },
  ])('steps 2–5: $previous → $next with +15m', ({ previous, next }) => {
    const result = calculateNextLearningState({
      answer: 'DONT_KNOW',
      previousLearningStep: previous,
      previousLongReviewSuccessCount: 2,
      reviewedAt,
    })

    expect(result).toEqual({
      learningStep: next,
      longReviewSuccessCount: 2,
      dueAt: dueAfter(15 * MS_PER_MINUTE),
    })
  })

  it.each([
    { previous: 6, next: 4 },
    { previous: 7, next: 5 },
    { previous: 8, next: 6 },
  ])('steps 6–8: $previous → $next with +12h and count reset', ({ previous, next }) => {
    const result = calculateNextLearningState({
      answer: 'DONT_KNOW',
      previousLearningStep: previous,
      previousLongReviewSuccessCount: 5,
      reviewedAt,
    })

    expect(result).toEqual({
      learningStep: next,
      longReviewSuccessCount: 0,
      dueAt: dueAfter(12 * MS_PER_HOUR),
    })
  })
})

describe('learningGroupForStep', () => {
  it.each([
    { step: 0, group: 'TO_LEARN' },
    { step: 1, group: 'TO_LEARN' },
    { step: 2, group: 'PRACTICED' },
    { step: 6, group: 'PRACTICED' },
    { step: 7, group: 'LEARNED' },
    { step: 8, group: 'LEARNED' },
  ] as const)('step $step → $group', ({ step, group }) => {
    expect(learningGroupForStep(step)).toBe(group)
  })
})

describe('resolveReviewPresentationMode', () => {
  it.each([0, 1, 2])('steps 0–2 are TARGET_TEXT_AUDIO (step %s)', (learningStep) => {
    expect(resolveReviewPresentationMode({ learningStep, randomBit: 0 })).toBe('TARGET_TEXT_AUDIO')
    expect(resolveReviewPresentationMode({ learningStep, randomBit: 1 })).toBe('TARGET_TEXT_AUDIO')
  })

  it.each([3, 4])('steps 3–4 use randomBit 0 as TARGET_TEXT_AUDIO (step %s)', (learningStep) => {
    expect(resolveReviewPresentationMode({ learningStep, randomBit: 0 })).toBe('TARGET_TEXT_AUDIO')
  })

  it.each([3, 4])('steps 3–4 use randomBit 1 as SOURCE_TEXT (step %s)', (learningStep) => {
    expect(resolveReviewPresentationMode({ learningStep, randomBit: 1 })).toBe('SOURCE_TEXT')
  })

  it.each([5, 6, 7, 8])('steps 5–8 use randomBit 0 as SOURCE_TEXT (step %s)', (learningStep) => {
    expect(resolveReviewPresentationMode({ learningStep, randomBit: 0 })).toBe('SOURCE_TEXT')
  })

  it.each([5, 6, 7, 8])(
    'steps 5–8 use randomBit 1 as TARGET_AUDIO_ONLY (step %s)',
    (learningStep) => {
      expect(resolveReviewPresentationMode({ learningStep, randomBit: 1 })).toBe(
        'TARGET_AUDIO_ONLY',
      )
    },
  )

  it('never returns TARGET_TEXT', () => {
    for (const learningStep of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
      for (const randomBit of [0, 1] as const) {
        expect(resolveReviewPresentationMode({ learningStep, randomBit })).not.toBe('TARGET_TEXT')
      }
    }
  })

  it.each([-1, 9, 1.5])('rejects invalid learningStep %s', (learningStep) => {
    expect(() => resolveReviewPresentationMode({ learningStep, randomBit: 0 })).toThrow(
      'learningStep must be an integer from 0 to 8.',
    )
  })

  it('rejects invalid randomBit', () => {
    expect(() => resolveReviewPresentationMode({ learningStep: 3, randomBit: 2 as 0 | 1 })).toThrow(
      'randomBit must be 0 or 1.',
    )
  })
})

describe('toEffectivePresentationMode', () => {
  it.each([
    {
      audioOnlyDisabled: false,
      base: 'TARGET_TEXT_AUDIO' as const,
      effective: 'TARGET_TEXT_AUDIO',
    },
    {
      audioOnlyDisabled: false,
      base: 'SOURCE_TEXT' as const,
      effective: 'SOURCE_TEXT',
    },
    {
      audioOnlyDisabled: false,
      base: 'TARGET_AUDIO_ONLY' as const,
      effective: 'TARGET_AUDIO_ONLY',
    },
    {
      audioOnlyDisabled: true,
      base: 'TARGET_TEXT_AUDIO' as const,
      effective: 'TARGET_TEXT_AUDIO',
    },
    {
      audioOnlyDisabled: true,
      base: 'SOURCE_TEXT' as const,
      effective: 'SOURCE_TEXT',
    },
    {
      audioOnlyDisabled: true,
      base: 'TARGET_AUDIO_ONLY' as const,
      effective: 'TARGET_TEXT',
    },
  ])(
    'audioOnlyDisabled=$audioOnlyDisabled $base → $effective',
    ({ audioOnlyDisabled, base, effective }) => {
      expect(toEffectivePresentationMode(base, audioOnlyDisabled)).toBe(effective)
    },
  )
})

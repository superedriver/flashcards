import {
  LearningGroup,
  LearningStepsInput,
  LearningStepsResult,
  PromptDirection,
  ReviewPresentationMode,
} from './types'

const MS_PER_SECOND = 1000
const MS_PER_MINUTE = 60 * MS_PER_SECOND
const MS_PER_HOUR = 60 * MS_PER_MINUTE
const MS_PER_DAY = 24 * MS_PER_HOUR

const KNOW_INTERVAL_MS: Record<number, number> = {
  1: 90 * MS_PER_SECOND,
  2: 30 * MS_PER_MINUTE,
  3: 12 * MS_PER_HOUR,
  4: 24 * MS_PER_HOUR,
  5: 2 * MS_PER_DAY,
  6: 7 * MS_PER_DAY,
  7: 14 * MS_PER_DAY,
}

export function calculateNextLearningState(input: LearningStepsInput): LearningStepsResult {
  const step = input.previousLearningStep
  assertLearningStep(step)

  if (
    !Number.isInteger(input.previousLongReviewSuccessCount) ||
    input.previousLongReviewSuccessCount < 0
  ) {
    throw new Error('previousLongReviewSuccessCount must be an integer >= 0.')
  }

  if (input.answer === 'KNOW') {
    return applyKnow(input)
  }

  if (input.answer === 'DONT_KNOW') {
    return applyDontKnow(input)
  }

  throw new Error('Review answer must be KNOW or DONT_KNOW.')
}

export function learningGroupForStep(step: number): LearningGroup {
  assertLearningStep(step)

  if (step <= 1) {
    return 'TO_LEARN'
  }

  if (step <= 6) {
    return 'PRACTICED'
  }

  return 'LEARNED'
}

export function resolvePromptDirection(input: {
  learningStep: number
  randomBit: 0 | 1
}): PromptDirection {
  assertLearningStep(input.learningStep)

  if (input.randomBit !== 0 && input.randomBit !== 1) {
    throw new Error('randomBit must be 0 or 1.')
  }

  if (input.learningStep <= 2) {
    return 'FRONT_TO_BACK'
  }

  if (input.learningStep >= 5 && input.learningStep <= 7) {
    return 'BACK_TO_FRONT'
  }

  return input.randomBit === 0 ? 'FRONT_TO_BACK' : 'BACK_TO_FRONT'
}

export function resolveReviewPresentationMode(input: {
  learningStep: number
  randomBit: 0 | 1
}): Exclude<ReviewPresentationMode, 'TARGET_TEXT'> {
  assertLearningStep(input.learningStep)

  if (input.randomBit !== 0 && input.randomBit !== 1) {
    throw new Error('randomBit must be 0 or 1.')
  }

  if (input.learningStep <= 2) {
    return 'TARGET_TEXT_AUDIO'
  }

  if (input.learningStep <= 4) {
    return input.randomBit === 0 ? 'TARGET_TEXT_AUDIO' : 'SOURCE_TEXT'
  }

  return input.randomBit === 0 ? 'SOURCE_TEXT' : 'TARGET_AUDIO_ONLY'
}

export function toEffectivePresentationMode(
  base: Exclude<ReviewPresentationMode, 'TARGET_TEXT'>,
  audioOnlyDisabled: boolean,
): ReviewPresentationMode {
  if (audioOnlyDisabled && base === 'TARGET_AUDIO_ONLY') {
    return 'TARGET_TEXT'
  }

  return base
}

function applyKnow(input: LearningStepsInput): LearningStepsResult {
  const oldStep = input.previousLearningStep

  if (oldStep === 8) {
    const longReviewSuccessCount = input.previousLongReviewSuccessCount + 1
    const days = longReviewSuccessCount === 1 ? 60 : longReviewSuccessCount === 2 ? 90 : 180

    return {
      learningStep: 8,
      longReviewSuccessCount,
      dueAt: addMs(input.reviewedAt, days * MS_PER_DAY),
    }
  }

  if (oldStep === 7) {
    return {
      learningStep: 8,
      longReviewSuccessCount: 0,
      dueAt: addMs(input.reviewedAt, 60 * MS_PER_DAY),
    }
  }

  const learningStep = oldStep + 1
  const intervalMs = KNOW_INTERVAL_MS[learningStep]

  if (intervalMs === undefined) {
    throw new Error(`Missing Know interval for step ${learningStep}.`)
  }

  return {
    learningStep,
    longReviewSuccessCount: input.previousLongReviewSuccessCount,
    dueAt: addMs(input.reviewedAt, intervalMs),
  }
}

function applyDontKnow(input: LearningStepsInput): LearningStepsResult {
  const oldStep = input.previousLearningStep

  if (oldStep <= 1) {
    return {
      learningStep: oldStep,
      longReviewSuccessCount: input.previousLongReviewSuccessCount,
      dueAt: addMs(input.reviewedAt, 2 * MS_PER_MINUTE),
    }
  }

  if (oldStep <= 5) {
    return {
      learningStep: Math.max(oldStep - 1, 0),
      longReviewSuccessCount: input.previousLongReviewSuccessCount,
      dueAt: addMs(input.reviewedAt, 15 * MS_PER_MINUTE),
    }
  }

  return {
    learningStep: Math.max(oldStep - 2, 0),
    longReviewSuccessCount: 0,
    dueAt: addMs(input.reviewedAt, 12 * MS_PER_HOUR),
  }
}

function assertLearningStep(step: number): void {
  if (!Number.isInteger(step) || step < 0 || step > 8) {
    throw new Error('learningStep must be an integer from 0 to 8.')
  }
}

function addMs(date: Date, ms: number): Date {
  return new Date(date.getTime() + ms)
}

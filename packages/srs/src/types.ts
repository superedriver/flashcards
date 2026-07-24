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

export type ReviewAnswer = 'KNOW' | 'DONT_KNOW'

export type LearningGroup = 'TO_LEARN' | 'PRACTICED' | 'LEARNED'

export type PromptDirection = 'FRONT_TO_BACK' | 'BACK_TO_FRONT'

export type LearningStepsInput = {
  answer: ReviewAnswer
  previousLearningStep: number
  previousLongReviewSuccessCount: number
  reviewedAt: Date
}

export type LearningStepsResult = {
  learningStep: number
  longReviewSuccessCount: number
  dueAt: Date
}

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

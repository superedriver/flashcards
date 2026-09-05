export type ReviewAnswer = 'KNOW' | 'DONT_KNOW'

export type LearningGroup = 'TO_LEARN' | 'PRACTICED' | 'LEARNED'

export type ReviewPresentationMode =
  | 'TARGET_TEXT_AUDIO'
  | 'SOURCE_TEXT'
  | 'TARGET_AUDIO_ONLY'
  | 'TARGET_TEXT'

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

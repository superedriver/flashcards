export type LearningGroup = 'TO_LEARN' | 'PRACTICED' | 'LEARNED'

export type PromptDirection = 'FRONT_TO_BACK' | 'BACK_TO_FRONT'

export type LessonCard = {
  back: string
  cardId: string
  deckId: string
  example?: string | null
  front: string
  learningGroup: LearningGroup
  learningStep: number
  notes?: string | null
  position: number
  promptDirection: PromptDirection
}

export type ActiveLesson = {
  cards: LessonCard[]
  currentIndex: number
  deckId: string | null
  reviewedCardIds: string[]
  sessionId: string
  scope?: 'DECK' | 'HOME_ACTIVE_TARGET'
}

export type LessonCompletion = {
  completedAt: string
  deckId: string | null
  dontKnowCount: number
  knownCount: number
  reviewedCards: number
  sessionId: string
  totalCards: number
}

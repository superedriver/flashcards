export type LessonCard = {
  back: string
  cardId: string
  example?: string | null
  front: string
  notes?: string | null
  position: number
}

export type ActiveLesson = {
  cards: LessonCard[]
  currentIndex: number
  deckId: string
  reviewedCardIds: string[]
  sessionId: string
}

export type LessonCompletion = {
  completedAt: string
  deckId: string
  dontKnowCount: number
  knownCount: number
  reviewedCards: number
  sessionId: string
  totalCards: number
}

export type LearningGroup = 'TO_LEARN' | 'PRACTICED' | 'LEARNED'

export type ReviewPresentationMode =
  'TARGET_TEXT_AUDIO' | 'SOURCE_TEXT' | 'TARGET_AUDIO_ONLY' | 'TARGET_TEXT'

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
  presentationMode: ReviewPresentationMode
}

export type ActiveLesson = {
  cards: LessonCard[]
  currentIndex: number
  deckId: string | null
  lessonSize: number
  reviewedCardIds: string[]
  sessionId: string
  scope?: 'DECK' | 'HOME_ACTIVE_TARGET'
}

export type LessonCompletion = {
  completedAt: string
  deckId: string | null
  scope: 'DECK' | 'HOME_ACTIVE_TARGET'
  sessionId: string
}

import type {
  LearningGroup,
  LessonCard,
  PromptDirection,
} from '@/features/lessons/types/active-lesson'

type GraphQlLessonCard = {
  back: string
  cardId: string
  deckId: string
  example?: string | null
  front: string
  learningGroup: string
  learningStep: number
  notes?: string | null
  position: number
  promptDirection: string
}

export function mapGraphQlLessonCard(card: GraphQlLessonCard): LessonCard {
  return {
    back: card.back,
    cardId: card.cardId,
    deckId: card.deckId,
    example: card.example,
    front: card.front,
    learningGroup: card.learningGroup as LearningGroup,
    learningStep: card.learningStep,
    notes: card.notes,
    position: card.position,
    promptDirection: card.promptDirection as PromptDirection,
  }
}

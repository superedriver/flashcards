import { create } from 'zustand'

import type { ActiveLesson, LessonCard, LessonCompletion } from '../types/active-lesson'

type ActiveLessonStore = {
  activeLesson: ActiveLesson | null
  completion: LessonCompletion | null
  clearActiveLesson: () => void
  clearCompletion: () => void
  enqueueNextCard: (card: LessonCard) => void
  getCurrentCard: () => LessonCard | null
  goToNextCard: () => void
  markCardReviewed: (cardId: string) => void
  setActiveLesson: (lesson: ActiveLesson) => void
  setCompletion: (completion: LessonCompletion) => void
}

export const useActiveLessonStore = create<ActiveLessonStore>((set, get) => ({
  activeLesson: null,
  completion: null,

  clearActiveLesson: () => set({ activeLesson: null }),

  clearCompletion: () => set({ completion: null }),

  getCurrentCard: () => {
    const lesson = get().activeLesson

    if (!lesson) {
      return null
    }

    return lesson.cards[lesson.currentIndex] ?? null
  },

  goToNextCard: () =>
    set((state) => {
      if (!state.activeLesson) {
        return state
      }

      return {
        activeLesson: {
          ...state.activeLesson,
          currentIndex: state.activeLesson.currentIndex + 1,
        },
      }
    }),

  enqueueNextCard: (card: LessonCard) =>
    set((state) => {
      if (!state.activeLesson) {
        return state
      }

      const existingIndex = state.activeLesson.cards.findIndex(
        (existing) => existing.cardId === card.cardId,
      )

      if (existingIndex > state.activeLesson.currentIndex) {
        return {
          activeLesson: {
            ...state.activeLesson,
            cards: state.activeLesson.cards.map((existing, index) =>
              index === existingIndex ? card : existing,
            ),
          },
        }
      }

      return {
        activeLesson: {
          ...state.activeLesson,
          cards: [...state.activeLesson.cards, card],
        },
      }
    }),

  markCardReviewed: (cardId: string) =>
    set((state) => {
      if (!state.activeLesson) {
        return state
      }

      if (state.activeLesson.reviewedCardIds.includes(cardId)) {
        return state
      }

      return {
        activeLesson: {
          ...state.activeLesson,
          reviewedCardIds: [...state.activeLesson.reviewedCardIds, cardId],
        },
      }
    }),

  setActiveLesson: (lesson) => set({ activeLesson: lesson }),

  setCompletion: (completion) => set({ completion }),
}))

export function useActiveLesson(sessionId?: string) {
  const activeLesson = useActiveLessonStore((state) => state.activeLesson)
  const completion = useActiveLessonStore((state) => state.completion)
  const clearActiveLesson = useActiveLessonStore((state) => state.clearActiveLesson)
  const clearCompletion = useActiveLessonStore((state) => state.clearCompletion)
  const enqueueNextCard = useActiveLessonStore((state) => state.enqueueNextCard)
  const getCurrentCard = useActiveLessonStore((state) => state.getCurrentCard)
  const goToNextCard = useActiveLessonStore((state) => state.goToNextCard)
  const markCardReviewed = useActiveLessonStore((state) => state.markCardReviewed)
  const setActiveLesson = useActiveLessonStore((state) => state.setActiveLesson)
  const setCompletion = useActiveLessonStore((state) => state.setCompletion)

  const lesson =
    activeLesson && sessionId && activeLesson.sessionId === sessionId ? activeLesson : null

  const currentCard = lesson ? (lesson.cards[lesson.currentIndex] ?? null) : null
  const reviewedCount = lesson?.reviewedCardIds.length ?? 0
  // Prefer the active queue length over settings lessonSize when fewer cards are available.
  // Grow with re-queued nextCard entries; never show less than reviewed; never exceed lessonSize.
  const totalCards = lesson
    ? Math.min(lesson.lessonSize, Math.max(lesson.cards.length, reviewedCount))
    : 0
  const currentNumber =
    reviewedCount >= totalCards && totalCards > 0
      ? totalCards
      : Math.min(reviewedCount + 1, Math.max(totalCards, 1))
  const isComplete =
    lesson !== null && lesson.currentIndex >= lesson.cards.length && lesson.cards.length > 0
  const hasMoreCards = lesson !== null && lesson.currentIndex < lesson.cards.length

  return {
    clearActiveLesson,
    clearCompletion,
    completion,
    currentCard,
    currentNumber,
    enqueueNextCard,
    getCurrentCard,
    goToNextCard,
    hasMoreCards,
    isComplete,
    lesson,
    markCardReviewed,
    reviewedCount,
    setActiveLesson,
    setCompletion,
    totalCards,
  }
}

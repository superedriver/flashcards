import { useCallback, useEffect, useState } from 'react'

import {
  REVIEW_SWIPE_HINT_VISIBLE_FOR_ANSWERS,
  getReviewSwipeHintAnswerCount,
  incrementReviewSwipeHintAnswerCount,
} from '@/features/lessons/storage/review-swipe-hint-storage'

export function useReviewSwipeHint() {
  const [answerCount, setAnswerCount] = useState<number | null>(null)

  useEffect(() => {
    void getReviewSwipeHintAnswerCount().then(setAnswerCount)
  }, [])

  const recordAnswer = useCallback(() => {
    void incrementReviewSwipeHintAnswerCount().then(setAnswerCount)
  }, [])

  return {
    recordAnswer,
    showSwipeHint: answerCount !== null && answerCount < REVIEW_SWIPE_HINT_VISIBLE_FOR_ANSWERS,
  }
}

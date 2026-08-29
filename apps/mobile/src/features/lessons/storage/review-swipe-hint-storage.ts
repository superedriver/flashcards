import AsyncStorage from '@react-native-async-storage/async-storage'

const REVIEW_SWIPE_HINT_ANSWER_COUNT_KEY = 'flashcards.reviewSwipeHintAnswerCount'

export const REVIEW_SWIPE_HINT_VISIBLE_FOR_ANSWERS = 3

export async function getReviewSwipeHintAnswerCount(): Promise<number> {
  const value = await AsyncStorage.getItem(REVIEW_SWIPE_HINT_ANSWER_COUNT_KEY)
  const parsed = Number.parseInt(value ?? '0', 10)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return parsed
}

export async function incrementReviewSwipeHintAnswerCount(): Promise<number> {
  const next = (await getReviewSwipeHintAnswerCount()) + 1
  await AsyncStorage.setItem(REVIEW_SWIPE_HINT_ANSWER_COUNT_KEY, String(next))

  return next
}

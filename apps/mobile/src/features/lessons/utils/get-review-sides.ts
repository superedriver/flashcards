import type { ReviewPresentationMode } from '@/features/lessons/types/active-lesson'

export function getReviewSides(input: {
  back: string
  front: string
  presentationMode: ReviewPresentationMode
}): { answer: string; prompt: string } {
  if (input.presentationMode === 'SOURCE_TEXT') {
    return { answer: input.front, prompt: input.back }
  }

  if (input.presentationMode === 'TARGET_AUDIO_ONLY') {
    return { answer: input.back, prompt: '' }
  }

  return { answer: input.back, prompt: input.front }
}

export function shouldSpeakReviewTarget(input: {
  isRevealed: boolean
  presentationMode: ReviewPresentationMode
}): boolean {
  switch (input.presentationMode) {
    case 'TARGET_TEXT_AUDIO':
    case 'TARGET_AUDIO_ONLY':
      return !input.isRevealed
    case 'SOURCE_TEXT':
    case 'TARGET_TEXT':
      return false
  }
}

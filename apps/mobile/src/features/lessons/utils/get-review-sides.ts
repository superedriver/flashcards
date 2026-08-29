import type { PromptDirection } from '@/features/lessons/types/active-lesson'

export function getReviewSides(input: {
  back: string
  front: string
  promptDirection: PromptDirection
}): { answer: string; prompt: string } {
  if (input.promptDirection === 'BACK_TO_FRONT') {
    return { answer: input.front, prompt: input.back }
  }

  return { answer: input.back, prompt: input.front }
}

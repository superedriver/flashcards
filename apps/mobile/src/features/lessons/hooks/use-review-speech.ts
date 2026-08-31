import * as Speech from 'expo-speech'
import { useCallback, useEffect } from 'react'

import { toTtsLanguageTag } from '@/features/lessons/utils/tts-language'

type UseReviewSpeechInput = {
  enabled: boolean
  languageCode?: string | null
  text: string
  utteranceKey: string
}

function stopSpeech(): void {
  try {
    Speech.stop()
  } catch {
    // Some web browsers reject stop when nothing is speaking.
  }
}

function speakText(text: string, languageCode: string): void {
  const trimmed = text.trim()

  if (!trimmed) {
    return
  }

  stopSpeech()

  try {
    Speech.speak(trimmed, {
      language: toTtsLanguageTag(languageCode),
    })
  } catch {
    // Ignore missing voices or blocked autoplay.
  }
}

export function useReviewSpeech({
  enabled,
  languageCode,
  text,
  utteranceKey,
}: UseReviewSpeechInput): { speak: () => void } {
  const speak = useCallback(() => {
    if (!languageCode?.trim()) {
      return
    }

    speakText(text, languageCode)
  }, [languageCode, text])

  useEffect(() => {
    if (!enabled || !languageCode?.trim()) {
      stopSpeech()
      return
    }

    speakText(text, languageCode)

    return () => {
      stopSpeech()
    }
  }, [enabled, languageCode, text, utteranceKey])

  return { speak }
}

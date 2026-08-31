const TTS_LANGUAGE_OVERRIDES: Record<string, string> = {
  fil: 'fil-PH',
  'zh-hans': 'zh-CN',
  'zh-hant': 'zh-TW',
}

export function toTtsLanguageTag(languageCode: string): string {
  const trimmed = languageCode.trim()

  if (!trimmed) {
    return trimmed
  }

  return TTS_LANGUAGE_OVERRIDES[trimmed.toLowerCase()] ?? trimmed
}

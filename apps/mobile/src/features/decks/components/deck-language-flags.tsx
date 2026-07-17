import { useMemo } from 'react'
import { View } from 'react-native'

import { useLanguagesQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type DeckLanguageFlagsProps = {
  sourceLanguage?: string | null
  targetLanguage?: string | null
  flagSize?: number
}

export function DeckLanguageFlags({
  sourceLanguage,
  targetLanguage,
  flagSize = 18,
}: DeckLanguageFlagsProps) {
  const { data } = useLanguagesQuery()

  const flagByCode = useMemo(() => {
    const map = new Map<string, string>()

    for (const language of data?.languages ?? []) {
      map.set(language.code, language.flag)
    }

    return map
  }, [data?.languages])

  if (!targetLanguage && !sourceLanguage) {
    return null
  }

  const targetFlag = targetLanguage ? (flagByCode.get(targetLanguage) ?? targetLanguage) : '—'
  const sourceFlag = sourceLanguage ? (flagByCode.get(sourceLanguage) ?? sourceLanguage) : '—'

  return (
    <View
      accessibilityLabel={`${targetLanguage ?? ''} → ${sourceLanguage ?? ''}`}
      style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}
    >
      <AppText style={{ fontSize: flagSize, lineHeight: flagSize + 4 }}>{targetFlag}</AppText>
      <AppText style={{ color: '#666666', fontSize: Math.max(12, flagSize - 6) }}>→</AppText>
      <AppText style={{ fontSize: flagSize, lineHeight: flagSize + 4 }}>{sourceFlag}</AppText>
    </View>
  )
}

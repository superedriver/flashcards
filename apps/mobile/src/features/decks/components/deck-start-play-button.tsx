import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { useDeckLearningStatsQuery } from '@/graphql/generated'

type DeckStartPlayButtonProps = {
  deckId: string
}

export function DeckStartPlayButton({ deckId }: DeckStartPlayButtonProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { data } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  const dueCount = data?.deckLearningStats?.dueCount ?? 0

  if (dueCount <= 0) {
    return null
  }

  return (
    <Pressable
      accessibilityLabel={t('decks.deckDetail.startLesson')}
      accessibilityRole="button"
      hitSlop={8}
      style={{
        alignItems: 'center',
        bottom: 8,
        height: 36,
        justifyContent: 'center',
        position: 'absolute',
        right: 8,
        width: 36,
        zIndex: 1,
      }}
      onPress={() => router.push(`/lessons/start?deckId=${deckId}`)}
    >
      <Ionicons color="#1a56db" name="play" size={22} />
    </Pressable>
  )
}

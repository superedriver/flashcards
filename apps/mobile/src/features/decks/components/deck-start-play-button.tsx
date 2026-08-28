import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

import { useDeckDueCount } from './deck-learning-stats-compact'

type DeckStartPlayButtonProps = {
  deckId: string
}

export function DeckStartPlayButton({ deckId }: DeckStartPlayButtonProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const dueCount = useDeckDueCount(deckId)

  if (dueCount <= 0) {
    return null
  }

  return (
    <Pressable
      {...buttonA11yProps(t('decks.deckDetail.startLesson'))}
      style={{
        alignItems: 'center',
        backgroundColor: '#1a56db',
        borderRadius: 8,
        flexDirection: 'row',
        flexShrink: 0,
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 8,
      }}
      onPress={() => router.push(`/lessons/start?deckId=${deckId}`)}
    >
      <AppText style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
        {t('decks.deckDetail.startLesson')}
      </AppText>
      <Ionicons color="#ffffff" name="chevron-forward" size={14} />
    </Pressable>
  )
}

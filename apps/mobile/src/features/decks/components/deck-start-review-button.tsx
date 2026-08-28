import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { useDeckLearningStatsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps } from '@/ui/utils/accessibility'

type DeckStartReviewButtonProps = {
  deckId: string
  onPress: () => void
}

export function DeckStartReviewButton({ deckId, onPress }: DeckStartReviewButtonProps) {
  const { t } = useTranslation()
  const { data } = useDeckLearningStatsQuery({
    variables: { deckId },
  })

  const dueCount = data?.deckLearningStats?.dueCount ?? 0

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
        gap: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
      }}
      onPress={onPress}
    >
      <Ionicons color="#ffffff" name="play" size={16} style={{ marginLeft: 1 }} />
      <AppText style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>
        {t('decks.deckDetail.startLesson')}
      </AppText>
    </Pressable>
  )
}

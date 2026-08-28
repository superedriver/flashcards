import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { LearningGroupBadge } from '@/features/decks/components/learning-group-badge'
import type { DeckCardsQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { buttonA11yProps, destructiveButtonA11yProps } from '@/ui/utils/accessibility'

type CardListItemProps = {
  card: DeckCardsQuery['deckCards'][number]
  deckId: string
  isOdd?: boolean
  isOwner: boolean
  onDelete?: (cardId: string) => void
}

export function CardListItem({
  card,
  deckId,
  isOdd = false,
  isOwner,
  onDelete,
}: CardListItemProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const displayIndex = card.position + 1

  return (
    <View
      style={{
        backgroundColor: isOdd ? '#eef2f7' : '#ffffff',
        borderColor: '#c5cdd8',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 6,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingVertical: 14 }}>
        <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
          <AppText style={{ color: '#888888', fontSize: 12 }}>#{displayIndex}</AppText>
          <AppText style={{ fontSize: 16, fontWeight: '600' }}>{card.front}</AppText>
          <AppText style={{ color: '#444444' }}>{card.back}</AppText>
          {card.example ? (
            <AppText style={{ color: '#666666' }}>
              {t('decks.card.example', { text: card.example })}
            </AppText>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 8 }}>
          <LearningGroupBadge learningGroup={card.learningGroup} />
          {isOwner ? (
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Pressable
                {...buttonA11yProps(t('decks.card.edit'))}
                hitSlop={8}
                style={{
                  alignItems: 'center',
                  height: 36,
                  justifyContent: 'center',
                  width: 36,
                }}
                onPress={() => router.push(`/decks/${deckId}/cards/${card.id}/edit`)}
              >
                <Ionicons color="#333333" name="create-outline" size={22} />
              </Pressable>
              {onDelete ? (
                <Pressable
                  {...destructiveButtonA11yProps(t('decks.card.deleteCardA11y'))}
                  hitSlop={8}
                  style={{
                    alignItems: 'center',
                    height: 36,
                    justifyContent: 'center',
                    width: 36,
                  }}
                  onPress={() => onDelete(card.id)}
                >
                  <Ionicons color="#b00020" name="trash-outline" size={22} />
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  )
}

import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { DeckCardsQuery } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { destructiveButtonA11yProps } from '@/ui/utils/accessibility'

type CardListItemProps = {
  card: DeckCardsQuery['deckCards'][number]
  deckId: string
  isOwner: boolean
  onDelete?: (cardId: string) => void
}

export function CardListItem({ card, deckId, isOwner, onDelete }: CardListItemProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <AppCard style={{ gap: 8, marginBottom: 12, padding: 16 }}>
      <AppText style={{ color: '#888888', fontSize: 12 }}>#{card.position}</AppText>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>{card.front}</AppText>
      <AppText style={{ color: '#444444' }}>{card.back}</AppText>
      {card.example ? (
        <AppText style={{ color: '#666666' }}>
          {t('decks.card.example', { text: card.example })}
        </AppText>
      ) : null}

      {isOwner ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 }}>
          <AppButton onPress={() => router.push(`/decks/${deckId}/cards/${card.id}/edit`)}>
            {t('decks.card.edit')}
          </AppButton>
          {onDelete ? (
            <AppButton
              {...destructiveButtonA11yProps(t('decks.card.deleteCardA11y'))}
              background="#b00020"
              color="white"
              onPress={() => onDelete(card.id)}
            >
              {t('decks.card.delete')}
            </AppButton>
          ) : null}
        </View>
      ) : null}
    </AppCard>
  )
}

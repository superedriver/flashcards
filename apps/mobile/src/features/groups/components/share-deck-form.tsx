import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { MyDecksQuery } from '@/graphql/generated'
import { EmptyState, ErrorState } from '@/ui/components'
import { AppCard, AppText } from '@/ui/primitives'

type ShareDeckFormProps = {
  decks: MyDecksQuery['myDecks']
  errorMessage?: string | null
  feedback?: string | null
  onCreateDeck?: () => void
  onSelectDeck: (deckId: string) => void
  selectedDeckId: string | null
}

export function ShareDeckForm({
  decks,
  errorMessage,
  feedback,
  onCreateDeck,
  onSelectDeck,
  selectedDeckId,
}: ShareDeckFormProps) {
  const { t } = useTranslation()

  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ color: '#666666' }}>{t('groups.shareDeck.viewOnlyHint')}</AppText>

      {decks.length === 0 ? (
        <EmptyState
          actionLabel={onCreateDeck ? t('groups.shareDeck.emptyAction') : undefined}
          message={t('groups.shareDeck.empty')}
          onAction={onCreateDeck}
        />
      ) : (
        decks.map((deck) => {
          const isSelected = selectedDeckId === deck.id

          return (
            <Pressable key={deck.id} onPress={() => onSelectDeck(deck.id)}>
              <AppCard
                style={{
                  borderColor: isSelected ? '#1976d2' : undefined,
                  borderWidth: isSelected ? 2 : 0,
                  gap: 8,
                  marginBottom: 12,
                  padding: 16,
                }}
              >
                <AppText style={{ fontSize: 16, fontWeight: '600' }}>{deck.title}</AppText>
                {deck.description ? (
                  <AppText style={{ color: '#666666' }}>{deck.description}</AppText>
                ) : null}
              </AppCard>
            </Pressable>
          )
        })
      )}

      {feedback ? (
        <AppText style={{ color: '#2e7d32', fontWeight: '600' }}>{feedback}</AppText>
      ) : null}
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
    </View>
  )
}

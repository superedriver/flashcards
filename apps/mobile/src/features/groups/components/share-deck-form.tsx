import type { MyDecksQuery } from '@/graphql/generated'
import { EmptyState } from '@/ui/components'
import { AppCard, AppText } from '@/ui/primitives'
import { Pressable, View } from 'react-native'

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
  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ color: '#666666' }}>Shared decks are view-only for group members.</AppText>

      {decks.length === 0 ? (
        <EmptyState
          actionLabel={onCreateDeck ? 'Create a deck' : undefined}
          message="You have no decks to share."
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

      {feedback ? <AppText>{feedback}</AppText> : null}
      {errorMessage ? <AppText style={{ color: '#b00020' }}>{errorMessage}</AppText> : null}
    </View>
  )
}

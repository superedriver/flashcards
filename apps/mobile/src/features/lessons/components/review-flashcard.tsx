import { View } from 'react-native'

import { AppButton, AppCard, AppText } from '@/ui/primitives'

export type ReviewFlashcardProps = {
  back: string
  example?: string | null
  front: string
  isRevealed: boolean
  notes?: string | null
  onReveal: () => void
}

export function ReviewFlashcard({
  back,
  example,
  front,
  isRevealed,
  notes,
  onReveal,
}: ReviewFlashcardProps) {
  return (
    <AppCard
      style={{ gap: 16, justifyContent: 'center', marginBottom: 16, minHeight: 280, padding: 24 }}
    >
      <AppText
        style={{ color: '#888888', fontSize: 12, textAlign: 'center', textTransform: 'uppercase' }}
      >
        Front
      </AppText>
      <AppText style={{ fontSize: 28, fontWeight: '700', lineHeight: 36, textAlign: 'center' }}>
        {front}
      </AppText>

      {!isRevealed ? (
        <View style={{ gap: 8, marginTop: 8 }}>
          <AppText style={{ color: '#666666', fontSize: 14, textAlign: 'center' }}>
            Try to recall the answer, then reveal it.
          </AppText>
          <AppButton
            accessibilityHint="Shows the back of the card."
            accessibilityLabel="Reveal answer"
            onPress={onReveal}
          >
            Reveal answer
          </AppButton>
        </View>
      ) : (
        <View style={{ gap: 12, marginTop: 8 }}>
          <AppText
            style={{
              color: '#888888',
              fontSize: 12,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            Back
          </AppText>
          <AppText style={{ fontSize: 24, lineHeight: 32, textAlign: 'center' }}>{back}</AppText>
          {example ? (
            <AppText style={{ color: '#666666', fontSize: 16, textAlign: 'center' }}>
              Example: {example}
            </AppText>
          ) : null}
          {notes ? (
            <AppText style={{ color: '#666666', fontSize: 14, textAlign: 'center' }}>
              Notes: {notes}
            </AppText>
          ) : null}
        </View>
      )}
    </AppCard>
  )
}

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
    <AppCard style={{ gap: 16, marginBottom: 16, minHeight: 220, padding: 20 }}>
      <AppText style={{ fontSize: 24, fontWeight: '600', textAlign: 'center' }}>{front}</AppText>

      {!isRevealed ? (
        <AppButton onPress={onReveal}>Reveal answer</AppButton>
      ) : (
        <View style={{ gap: 12 }}>
          <AppText style={{ fontSize: 20, textAlign: 'center' }}>{back}</AppText>
          {example ? <AppText style={{ color: '#666666' }}>Example: {example}</AppText> : null}
          {notes ? <AppText style={{ color: '#666666' }}>Notes: {notes}</AppText> : null}
        </View>
      )}
    </AppCard>
  )
}

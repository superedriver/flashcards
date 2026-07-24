import { useTranslation } from 'react-i18next'
import { View, useWindowDimensions } from 'react-native'

import type { PromptDirection } from '@/features/lessons/types/active-lesson'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { getLessonCardContainerStyle } from '@/ui/utils/responsive'

export type ReviewFlashcardProps = {
  back: string
  example?: string | null
  front: string
  isRevealed: boolean
  notes?: string | null
  onReveal: () => void
  promptDirection: PromptDirection
}

export function ReviewFlashcard({
  back,
  example,
  front,
  isRevealed,
  notes,
  onReveal,
  promptDirection,
}: ReviewFlashcardProps) {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const containerStyle = getLessonCardContainerStyle(width)

  const isBackToFront = promptDirection === 'BACK_TO_FRONT'
  const promptText = isBackToFront ? back : front
  const answerText = isBackToFront ? front : back
  const promptLabel = isBackToFront ? t('lessons.flashcard.back') : t('lessons.flashcard.front')
  const answerLabel = isBackToFront ? t('lessons.flashcard.front') : t('lessons.flashcard.back')

  return (
    <View style={containerStyle}>
      <AppCard
        style={{ gap: 16, justifyContent: 'center', marginBottom: 16, minHeight: 280, padding: 24 }}
      >
        <AppText
          style={{
            color: '#888888',
            fontSize: 12,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          {promptLabel}
        </AppText>
        <AppText style={{ fontSize: 28, fontWeight: '700', lineHeight: 36, textAlign: 'center' }}>
          {promptText}
        </AppText>

        {!isRevealed ? (
          <View style={{ gap: 8, marginTop: 8 }}>
            <AppText style={{ color: '#666666', fontSize: 14, textAlign: 'center' }}>
              {t('lessons.flashcard.recallHint')}
            </AppText>
            <AppButton
              accessibilityHint={t('lessons.flashcard.revealHint')}
              accessibilityLabel={t('lessons.flashcard.revealAnswer')}
              onPress={onReveal}
            >
              {t('lessons.flashcard.revealAnswer')}
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
              {answerLabel}
            </AppText>
            <AppText style={{ fontSize: 24, lineHeight: 32, textAlign: 'center' }}>
              {answerText}
            </AppText>
            {example ? (
              <AppText style={{ color: '#666666', fontSize: 16, textAlign: 'center' }}>
                {t('lessons.flashcard.example', { text: example })}
              </AppText>
            ) : null}
            {notes ? (
              <AppText style={{ color: '#666666', fontSize: 14, textAlign: 'center' }}>
                {t('lessons.flashcard.notes', { text: notes })}
              </AppText>
            ) : null}
          </View>
        )}
      </AppCard>
    </View>
  )
}

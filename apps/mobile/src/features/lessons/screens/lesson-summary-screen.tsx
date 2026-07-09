import { useLocalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'

import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { formatDateTime } from '@/i18n/formatters'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

function formatKnownPercent(knownCount: number, reviewedCards: number): string {
  if (reviewedCards === 0) {
    return '0%'
  }

  return `${Math.round((knownCount / reviewedCards) * 100)}%`
}

export function LessonSummaryScreen() {
  const router = useRouter()
  const { deckId } = useLocalSearchParams<{ deckId?: string }>()
  const { clearCompletion, completion } = useActiveLesson()

  if (!completion) {
    return (
      <Screen>
        <PageTitle title="Lesson Summary" />
        <ErrorState message="Lesson summary is not available." />
        <View style={{ gap: 12, marginTop: 16 }}>
          {deckId ? (
            <AppButton onPress={() => router.replace(`/decks/${deckId}`)}>Back to deck</AppButton>
          ) : null}
          <AppButton onPress={() => router.replace('/(tabs)/decks')}>Back to decks</AppButton>
        </View>
      </Screen>
    )
  }

  const targetDeckId = deckId ?? completion.deckId
  const knownPercent = formatKnownPercent(completion.knownCount, completion.reviewedCards)

  return (
    <Screen>
      <PageTitle title="Lesson Complete" />
      <AppCard style={{ gap: 12, marginBottom: 16, padding: 16 }}>
        <AppText style={{ fontSize: 20, fontWeight: '700' }}>Nice work!</AppText>
        <AppText style={{ color: '#666666' }}>
          Completed {formatDateTime(completion.completedAt)}
        </AppText>
        <View style={{ gap: 6, marginTop: 8 }}>
          <AppText>Cards in lesson: {completion.totalCards}</AppText>
          <AppText>Reviewed: {completion.reviewedCards}</AppText>
          <AppText style={{ color: '#2e7d32' }}>Know: {completion.knownCount}</AppText>
          <AppText style={{ color: '#c62828' }}>
            Don&apos;t know: {completion.dontKnowCount}
          </AppText>
          <AppText style={{ fontWeight: '600' }}>Known: {knownPercent}</AppText>
        </View>
      </AppCard>
      <View style={{ gap: 12 }}>
        <AppButton
          onPress={() => {
            clearCompletion()
            router.replace(`/lessons/start?deckId=${targetDeckId}`)
          }}
        >
          Start another lesson
        </AppButton>
        <AppButton
          onPress={() => {
            clearCompletion()
            router.replace(`/decks/${targetDeckId}`)
          }}
        >
          Back to deck
        </AppButton>
        <AppButton
          onPress={() => {
            clearCompletion()
            router.replace('/(tabs)/decks')
          }}
        >
          Back to decks
        </AppButton>
      </View>
    </Screen>
  )
}

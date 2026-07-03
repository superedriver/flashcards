import { useLocalSearchParams, useRouter } from 'expo-router'
import { View } from 'react-native'

import { useActiveLesson } from '@/features/lessons/hooks/use-active-lesson'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState, PageTitle, Screen } from '@/ui/components'

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

  return (
    <Screen>
      <PageTitle title="Lesson Complete" />
      <View style={{ gap: 8, marginBottom: 16 }}>
        <AppText>Total cards: {completion.totalCards}</AppText>
        <AppText>Reviewed: {completion.reviewedCards}</AppText>
        <AppText>Know: {completion.knownCount}</AppText>
        <AppText>Don&apos;t know: {completion.dontKnowCount}</AppText>
        <AppText>Completed: {new Date(completion.completedAt).toLocaleString()}</AppText>
      </View>
      <View style={{ gap: 12 }}>
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
            router.replace(`/lessons/start?deckId=${targetDeckId}`)
          }}
        >
          Start another lesson
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

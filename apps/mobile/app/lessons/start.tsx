import { useLocalSearchParams } from 'expo-router'

import { StartLessonScreen } from '@/features/lessons/screens/start-lesson-screen'

export default function StartLessonRoute() {
  const { deckId } = useLocalSearchParams<{ deckId?: string }>()

  return <StartLessonScreen deckId={deckId} />
}

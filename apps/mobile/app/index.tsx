import { Redirect } from 'expo-router'

import { PageTitle, Screen } from '@/ui/components'

export default function IndexScreen() {
  return (
    <Screen>
      <PageTitle title="Flashcards" />
      <Redirect href="/(tabs)" />
    </Screen>
  )
}

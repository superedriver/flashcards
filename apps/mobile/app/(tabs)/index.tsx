import { AppText } from '@/ui/primitives'
import { PageTitle, Screen } from '@/ui/components'

export default function HomeScreen() {
  return (
    <Screen>
      <PageTitle title="Home" />
      <AppText>Welcome to Flashcards.</AppText>
    </Screen>
  )
}

import { useRouter } from 'expo-router'
import { View } from 'react-native'

import { useMyDecksQuery } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

import { DeckList } from '../components/deck-list'

export function MyDecksScreen() {
  const router = useRouter()
  const { data, error, loading, refetch } = useMyDecksQuery()

  const listHeader = (
    <>
      <PageTitle title="My Decks" />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <AppButton onPress={() => router.push('/decks/new')}>Create Deck</AppButton>
      </View>
    </>
  )

  return (
    <Screen>
      {loading ? (
        <>
          {listHeader}
          <LoadingState message="Loading decks..." />
        </>
      ) : null}
      {error ? (
        <>
          {listHeader}
          <ErrorState message="Could not load decks." onRetry={() => void refetch()} />
        </>
      ) : null}
      {!loading && !error && data?.myDecks ? (
        <DeckList
          decks={data.myDecks}
          listHeader={listHeader}
          onCreateDeck={() => router.push('/decks/new')}
        />
      ) : null}
    </Screen>
  )
}

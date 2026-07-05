import { useCallback, useState } from 'react'
import { View } from 'react-native'

import { PublicDeckList } from '@/features/public-decks/components/public-deck-list'
import { PublicDeckSearch } from '@/features/public-decks/components/public-deck-search'
import { usePublicDecksQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function PublicDecksScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const { data, error, loading, refetch } = usePublicDecksQuery({
    variables: {
      input: searchQuery ? { query: searchQuery } : undefined,
    },
  })

  return (
    <Screen>
      <PageTitle title="Public Decks" />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        Browse community decks and copy them to your library.
      </AppText>
      <View style={{ gap: 12, marginBottom: 16 }}>
        <PublicDeckSearch value={searchQuery} onSearchChange={handleSearchChange} />
      </View>

      {loading ? <LoadingState message="Loading public decks..." /> : null}
      {error ? (
        <ErrorState message="Could not load public decks." onRetry={() => void refetch()} />
      ) : null}
      {!loading && !error && data?.publicDecks ? (
        <PublicDeckList decks={data.publicDecks.items} searchQuery={searchQuery} />
      ) : null}
    </Screen>
  )
}

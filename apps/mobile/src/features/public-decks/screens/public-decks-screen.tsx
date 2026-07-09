import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { PublicDeckList } from '@/features/public-decks/components/public-deck-list'
import { PublicDeckSearch } from '@/features/public-decks/components/public-deck-search'
import { usePublicDecksQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function PublicDecksScreen() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const { data, error, loading, refetch } = usePublicDecksQuery({
    variables: {
      input: searchQuery ? { query: searchQuery } : undefined,
    },
  })

  const listHeader = (
    <>
      <PageTitle title={t('publicDecks.title')} />
      <AppText style={{ color: '#666666', marginBottom: 12 }}>
        {t('publicDecks.description')}
      </AppText>
      <View style={{ gap: 12, marginBottom: 16 }}>
        <PublicDeckSearch value={searchQuery} onSearchChange={handleSearchChange} />
      </View>
    </>
  )

  return (
    <Screen>
      {loading ? (
        <>
          {listHeader}
          <LoadingState message={t('publicDecks.loading')} />
        </>
      ) : null}
      {error ? (
        <>
          {listHeader}
          <ErrorState message={t('publicDecks.loadError')} onRetry={() => void refetch()} />
        </>
      ) : null}
      {!loading && !error && data?.publicDecks ? (
        <PublicDeckList
          decks={data.publicDecks.items}
          listHeader={listHeader}
          searchQuery={searchQuery}
        />
      ) : null}
    </Screen>
  )
}

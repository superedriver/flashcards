import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useMyDecksQuery } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

import { DeckList } from '../components/deck-list'

export function MyDecksScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { data, error, loading, refetch } = useMyDecksQuery()

  const listHeader = (
    <>
      <PageTitle title={t('decks.myDecks.title')} />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <AppButton onPress={() => router.push('/decks/new')}>
          {t('decks.myDecks.createDeck')}
        </AppButton>
      </View>
    </>
  )

  return (
    <Screen>
      {loading ? (
        <>
          {listHeader}
          <LoadingState message={t('decks.myDecks.loading')} />
        </>
      ) : null}
      {error ? (
        <>
          {listHeader}
          <ErrorState message={t('decks.myDecks.loadError')} onRetry={() => void refetch()} />
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

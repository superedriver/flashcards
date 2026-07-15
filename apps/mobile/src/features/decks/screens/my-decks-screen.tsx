import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'

import { DecksPageSections } from '@/features/decks/components/decks-page-sections'
import { ActiveDeckPreviewBanner } from '@/features/study-languages/components/active-deck-preview-banner'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import { useDecksPageQuery } from '@/graphql/generated'
import { AppButton } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'

export function MyDecksScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { activeTargetLanguage, loading: studyLanguageLoading } = useStudyLanguageContext()

  const { data, error, loading, refetch } = useDecksPageQuery({
    skip: !activeTargetLanguage,
    variables: {
      input: {
        activeTargetLanguage: activeTargetLanguage ?? '',
      },
    },
  })

  const listHeader = (
    <>
      <PageTitle title={t('decks.myDecks.title')} />
      <ActiveDeckPreviewBanner />
      <View style={{ gap: 12, marginBottom: 16 }}>
        <AppButton onPress={() => router.push('/decks/new')}>
          {t('decks.myDecks.createDeck')}
        </AppButton>
      </View>
    </>
  )

  if (studyLanguageLoading || loading) {
    return (
      <Screen>
        {listHeader}
        <LoadingState message={t('decks.myDecks.loading')} />
      </Screen>
    )
  }

  if (!activeTargetLanguage) {
    return (
      <Screen>
        {listHeader}
        <ErrorState message={t('decks.myDecks.loadError')} />
      </Screen>
    )
  }

  if (error || !data?.decksPage) {
    return (
      <Screen>
        {listHeader}
        <ErrorState message={t('decks.myDecks.loadError')} onRetry={() => void refetch()} />
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <DecksPageSections
          listHeader={listHeader}
          page={data.decksPage}
          onCreateDeck={() => router.push('/decks/new')}
        />
      </ScrollView>
    </Screen>
  )
}

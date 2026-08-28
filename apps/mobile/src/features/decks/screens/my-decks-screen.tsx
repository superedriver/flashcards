import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { DecksPageSections } from '@/features/decks/components/decks-page-sections'
import { ActiveDeckPreviewBanner } from '@/features/study-languages/components/active-deck-preview-banner'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import { useDecksPageQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { ErrorState, LoadingState, PageTitle, Screen } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

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

  const goCreateDeck = () => router.push('/decks/new')

  const listHeader = (
    <>
      <PageTitle
        title={t('decks.myDecks.title')}
        trailing={
          <Pressable
            {...buttonA11yProps(t('decks.myDecks.createDeck'))}
            style={{
              alignItems: 'center',
              backgroundColor: '#f2f4f7',
              borderColor: '#d0d5dd',
              borderRadius: 8,
              borderWidth: 1,
              flexDirection: 'row',
              flexShrink: 0,
              gap: 4,
              paddingHorizontal: 10,
              paddingVertical: 8,
            }}
            onPress={goCreateDeck}
          >
            <Ionicons color="#344054" name="add" size={18} />
            <AppText style={{ color: '#344054', fontSize: 14, fontWeight: '600' }}>
              {t('decks.myDecks.createDeck')}
            </AppText>
          </Pressable>
        }
      />
      <ActiveDeckPreviewBanner />
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
    <Screen scrollable>
      <DecksPageSections
        listHeader={listHeader}
        page={data.decksPage}
        onCreateDeck={goCreateDeck}
      />
    </Screen>
  )
}

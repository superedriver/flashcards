import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LanguageListRow } from '@/features/study-languages/components/language-list-row'
import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { useAddStudyLanguageMutation, useLanguagesQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

type LanguageCatalogModalProps = {
  excludedLanguageCodes: string[]
  onClose: () => void
  onLanguageAdded?: () => void
  visible: boolean
}

export function LanguageCatalogModal({
  excludedLanguageCodes,
  onClose,
  onLanguageAdded,
  visible,
}: LanguageCatalogModalProps) {
  const { t } = useTranslation()
  const { height } = useWindowDimensions()
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data, loading } = useLanguagesQuery({
    skip: !visible,
    variables: { search: search.trim() || null },
  })

  const [addStudyLanguage, { loading: adding }] = useAddStudyLanguageMutation({
    refetchQueries: ['MyStudyLanguages', 'StudyLanguageBootstrap'],
  })

  const excluded = useMemo(() => new Set(excludedLanguageCodes), [excludedLanguageCodes])

  const languages = data?.languages ?? []

  const popular = languages
    .filter((language) => language.popularSortOrder != null)
    .slice()
    .sort((a, b) => (a.popularSortOrder ?? 0) - (b.popularSortOrder ?? 0))

  const rest = languages
    .filter((language) => language.popularSortOrder == null)
    .slice()
    .sort((a, b) => a.englishName.localeCompare(b.englishName))

  const sections = [
    ...(popular.length > 0
      ? [{ key: 'popular', title: t('studyLanguages.catalog.popular'), data: popular }]
      : []),
    ...(rest.length > 0 || popular.length === 0
      ? [{ key: 'all', title: t('studyLanguages.catalog.all'), data: rest }]
      : []),
  ]

  async function handleAdd(languageCode: string) {
    setErrorMessage(null)

    try {
      await addStudyLanguage({ variables: { languageCode } })
      onLanguageAdded?.()
      onClose()
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('studyLanguages.catalog.addError')))
    }
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'flex-end' }}>
        <SafeAreaView
          edges={['bottom']}
          style={{
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: height * 0.9,
            minHeight: height * 0.6,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              borderBottomColor: '#eeeeee',
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <AppText style={{ fontSize: 18, fontWeight: '700' }}>
              {t('studyLanguages.catalog.title')}
            </AppText>
            <Pressable accessibilityRole="button" onPress={onClose}>
              <AppText style={{ color: '#1976d2', fontWeight: '600' }}>
                {t('common.cancel')}
              </AppText>
            </Pressable>
          </View>

          <TextInput
            accessibilityLabel={t('studyLanguages.catalog.searchPlaceholder')}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={setSearch}
            placeholder={t('studyLanguages.catalog.searchPlaceholder')}
            style={{
              borderColor: '#cccccc',
              borderRadius: 8,
              borderWidth: 1,
              margin: 16,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
            value={search}
          />

          {errorMessage ? (
            <AppText style={{ color: '#c62828', marginHorizontal: 16, marginBottom: 8 }}>
              {errorMessage}
            </AppText>
          ) : null}

          {loading ? (
            <ActivityIndicator style={{ marginTop: 24 }} />
          ) : languages.length === 0 ? (
            <AppText style={{ color: '#666666', padding: 16 }}>
              {t('studyLanguages.catalog.empty')}
            </AppText>
          ) : (
            <FlatList
              data={sections.flatMap((section) => [
                { type: 'header' as const, key: `h-${section.key}`, title: section.title },
                ...section.data.map((language) => ({
                  type: 'language' as const,
                  key: language.code,
                  language,
                })),
              ])}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => {
                if (item.type === 'header') {
                  return (
                    <AppText
                      style={{
                        backgroundColor: '#f5f5f5',
                        color: '#666666',
                        fontSize: 13,
                        fontWeight: '700',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.title}
                    </AppText>
                  )
                }

                const alreadyAdded = excluded.has(item.language.code)

                return (
                  <LanguageListRow
                    disabled={alreadyAdded || adding}
                    language={item.language}
                    onPress={alreadyAdded ? undefined : () => void handleAdd(item.language.code)}
                    rightAccessory={
                      alreadyAdded ? (
                        <AppText style={{ color: '#888888', fontSize: 12 }}>
                          {t('studyLanguages.catalog.alreadyAdded')}
                        </AppText>
                      ) : null
                    }
                  />
                )
              }}
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  )
}

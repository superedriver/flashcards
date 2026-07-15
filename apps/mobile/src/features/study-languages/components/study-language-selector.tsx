import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Pressable, View } from 'react-native'

import { LanguageCatalogModal } from '@/features/study-languages/components/language-catalog-modal'
import { StudyLanguagesListModal } from '@/features/study-languages/components/study-languages-list-modal'
import { useStudyLanguageContext } from '@/features/study-languages/hooks/use-study-language-context'
import { AppText } from '@/ui/primitives'

export function StudyLanguageSelector() {
  const { t } = useTranslation()
  const { activeLanguage, loading, studyLanguages } = useStudyLanguageContext()
  const [studyListOpen, setStudyListOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)

  const flag = activeLanguage?.flag ?? t('studyLanguages.selector.emptyFlag')
  const name = activeLanguage?.nativeName ?? activeLanguage?.englishName ?? ''

  return (
    <>
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
        <Pressable
          accessibilityLabel={
            name
              ? t('studyLanguages.selector.accessibilityLabel', { name })
              : t('studyLanguages.selector.openAccessibilityLabel')
          }
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setStudyListOpen(true)}
          style={{
            alignItems: 'center',
            borderColor: '#dddddd',
            borderRadius: 20,
            borderWidth: 1,
            flexDirection: 'row',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          {loading && !activeLanguage ? (
            <ActivityIndicator size="small" />
          ) : (
            <AppText style={{ fontSize: 22 }}>{flag}</AppText>
          )}
        </Pressable>

        <Pressable
          accessibilityLabel={t('studyLanguages.selector.addAccessibilityLabel')}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setCatalogOpen(true)}
          style={{
            alignItems: 'center',
            borderColor: '#dddddd',
            borderRadius: 16,
            borderWidth: 1,
            height: 32,
            justifyContent: 'center',
            width: 32,
          }}
        >
          <AppText style={{ fontSize: 20, fontWeight: '600', lineHeight: 22 }}>+</AppText>
        </Pressable>
      </View>

      <StudyLanguagesListModal visible={studyListOpen} onClose={() => setStudyListOpen(false)} />
      <LanguageCatalogModal
        excludedLanguageCodes={studyLanguages.map((item) => item.languageCode)}
        visible={catalogOpen}
        onClose={() => setCatalogOpen(false)}
      />
    </>
  )
}

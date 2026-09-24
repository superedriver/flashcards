import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Pressable, View } from 'react-native'

import { getGraphqlErrorMessage } from '@/features/decks/utils/deck-form-utils'
import { LanguageCatalogModal } from '@/features/study-languages/components/language-catalog-modal'
import { persistActiveTargetLanguage } from '@/features/study-languages/storage/active-target-language-storage'
import {
  hasShownLegacyNoLanguageHint,
  markLegacyNoLanguageHintShown,
} from '@/features/study-languages/storage/legacy-no-language-hint-storage'
import { useCompleteStudyLanguageOnboardingMutation } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { PageTitle, Screen } from '@/ui/components'

type SelectedLanguage = {
  code: string
  englishName: string
  nativeName: string
  flag: string
}

function LanguageRow({
  language,
  placeholder,
  onPress,
}: {
  language: SelectedLanguage | null
  placeholder: string
  onPress: () => void
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: pressed ? '#f5f5f5' : '#ffffff',
        borderColor: '#e0e0e0',
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 14,
      })}
    >
      {language ? (
        <>
          <AppText style={{ fontSize: 24, marginRight: 12 }}>{language.flag}</AppText>
          <AppText style={{ flex: 1, fontSize: 16, fontWeight: '500' }}>
            {language.nativeName}
          </AppText>
          <AppText style={{ color: '#999999', fontSize: 13 }}>{language.englishName}</AppText>
          <AppText style={{ color: '#bbbbbb', fontSize: 18, marginLeft: 8 }}>›</AppText>
        </>
      ) : (
        <>
          <AppText style={{ color: '#cccccc', fontSize: 24, marginRight: 12 }}>🌐</AppText>
          <AppText style={{ color: '#aaaaaa', flex: 1, fontSize: 16 }}>{placeholder}</AppText>
          <AppText style={{ color: '#bbbbbb', fontSize: 18 }}>›</AppText>
        </>
      )}
    </Pressable>
  )
}

export function StudyLanguageOnboardingScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const [targetLanguage, setTargetLanguage] = useState<SelectedLanguage | null>(null)
  const [nativeLanguage, setNativeLanguage] = useState<SelectedLanguage | null>(null)
  const [picker, setPicker] = useState<'target' | 'native' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [completeOnboarding, { loading }] = useCompleteStudyLanguageOnboardingMutation({
    refetchQueries: ['MyStudyLanguages', 'StudyLanguageBootstrap'],
  })

  async function handleSubmit() {
    setErrorMessage(null)

    if (!targetLanguage || !nativeLanguage) {
      setErrorMessage(t('studyLanguages.onboarding.validationRequired'))
      return
    }

    try {
      const result = await completeOnboarding({
        variables: {
          input: {
            targetLanguage: targetLanguage.code,
            nativeLanguage: nativeLanguage.code,
          },
        },
      })

      if (!result.data?.completeStudyLanguageOnboarding) {
        setErrorMessage(t('studyLanguages.onboarding.submitError'))
        return
      }

      await persistActiveTargetLanguage(targetLanguage.code)

      const hintShown = await hasShownLegacyNoLanguageHint()

      if (!hintShown) {
        await markLegacyNoLanguageHintShown()
        Alert.alert(
          t('studyLanguages.onboarding.legacyHintTitle'),
          t('studyLanguages.onboarding.legacyHintMessage'),
          [
            {
              text: t('common.ok'),
              onPress: () => router.replace('/(tabs)'),
            },
          ],
        )
        return
      }

      router.replace('/(tabs)')
    } catch (error) {
      setErrorMessage(getGraphqlErrorMessage(error, t('studyLanguages.onboarding.submitError')))
    }
  }

  const bothSelected = targetLanguage !== null && nativeLanguage !== null

  return (
    <Screen scrollable>
      <View style={{ maxWidth: 480, width: '100%' }}>
        <PageTitle title={t('studyLanguages.onboarding.title')} />
        <AppText style={{ color: '#888888', marginBottom: 28 }}>
          {t('studyLanguages.onboarding.description')}
        </AppText>

        <View style={{ gap: 20 }}>
          <View style={{ gap: 8 }}>
            <AppText
              style={{
                color: '#444444',
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}
            >
              {t('studyLanguages.onboarding.targetLabel')}
            </AppText>
            <LanguageRow
              language={targetLanguage}
              placeholder={t('studyLanguages.onboarding.targetPlaceholder')}
              onPress={() => setPicker('target')}
            />
          </View>

          <View style={{ gap: 8 }}>
            <AppText
              style={{
                color: '#444444',
                fontSize: 13,
                fontWeight: '600',
                letterSpacing: 0.3,
                textTransform: 'uppercase',
              }}
            >
              {t('studyLanguages.onboarding.nativeLabel')}
            </AppText>
            <LanguageRow
              language={nativeLanguage}
              placeholder={t('studyLanguages.onboarding.nativePlaceholder')}
              onPress={() => setPicker('native')}
            />
          </View>

          {bothSelected ? (
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#f0f4ff',
                borderRadius: 10,
                flexDirection: 'row',
                gap: 8,
                justifyContent: 'center',
                paddingVertical: 12,
              }}
            >
              <AppText style={{ fontSize: 22 }}>{nativeLanguage.flag}</AppText>
              <AppText style={{ color: '#1976d2', fontSize: 16, fontWeight: '600' }}>→</AppText>
              <AppText style={{ fontSize: 22 }}>{targetLanguage.flag}</AppText>
              <AppText style={{ color: '#444444', fontSize: 14, marginLeft: 4 }}>
                {nativeLanguage.englishName} → {targetLanguage.englishName}
              </AppText>
            </View>
          ) : null}

          {errorMessage ? <AppText style={{ color: '#c62828' }}>{errorMessage}</AppText> : null}

          <AppButton
            disabled={!bothSelected || loading}
            onPress={() => void handleSubmit()}
            style={{
              backgroundColor: bothSelected ? '#1976d2' : '#cccccc',
              borderColor: bothSelected ? '#1976d2' : '#cccccc',
              borderRadius: 10,
              height: 48,
            }}
          >
            <AppText style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              {loading
                ? t('studyLanguages.onboarding.submitting')
                : t('studyLanguages.onboarding.submit')}
            </AppText>
          </AppButton>
        </View>
      </View>

      <LanguageCatalogModal
        mode="select"
        title={
          picker === 'native'
            ? t('studyLanguages.onboarding.nativePickerTitle')
            : t('studyLanguages.onboarding.targetPickerTitle')
        }
        visible={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={(language) => {
          if (picker === 'target') {
            setTargetLanguage(language)
          } else if (picker === 'native') {
            setNativeLanguage(language)
          }
        }}
      />
    </Screen>
  )
}

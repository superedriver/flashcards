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

  return (
    <Screen scrollable>
      <PageTitle title={t('studyLanguages.onboarding.title')} />
      <AppText style={{ color: '#666666', marginBottom: 24 }}>
        {t('studyLanguages.onboarding.description')}
      </AppText>

      <View style={{ gap: 16 }}>
        <View style={{ gap: 8 }}>
          <AppText style={{ fontWeight: '600' }}>
            {t('studyLanguages.onboarding.targetLabel')}
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPicker('target')}
            style={{
              borderColor: '#cccccc',
              borderRadius: 8,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            {targetLanguage ? (
              <AppText>
                {targetLanguage.flag} {targetLanguage.nativeName} ({targetLanguage.englishName})
              </AppText>
            ) : (
              <AppText style={{ color: '#888888' }}>
                {t('studyLanguages.onboarding.targetPlaceholder')}
              </AppText>
            )}
          </Pressable>
        </View>

        <View style={{ gap: 8 }}>
          <AppText style={{ fontWeight: '600' }}>
            {t('studyLanguages.onboarding.nativeLabel')}
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={() => setPicker('native')}
            style={{
              borderColor: '#cccccc',
              borderRadius: 8,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 12,
            }}
          >
            {nativeLanguage ? (
              <AppText>
                {nativeLanguage.flag} {nativeLanguage.nativeName} ({nativeLanguage.englishName})
              </AppText>
            ) : (
              <AppText style={{ color: '#888888' }}>
                {t('studyLanguages.onboarding.nativePlaceholder')}
              </AppText>
            )}
          </Pressable>
        </View>

        {errorMessage ? <AppText style={{ color: '#c62828' }}>{errorMessage}</AppText> : null}

        <AppButton disabled={loading} onPress={() => void handleSubmit()}>
          {loading
            ? t('studyLanguages.onboarding.submitting')
            : t('studyLanguages.onboarding.submit')}
        </AppButton>
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

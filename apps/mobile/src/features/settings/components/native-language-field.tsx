import { useMemo, useState } from 'react'
import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { LanguageCatalogModal } from '@/features/study-languages/components/language-catalog-modal'
import { useLanguagesQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type NativeLanguageFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function NativeLanguageField({ control, errors }: NativeLanguageFieldProps) {
  const { t } = useTranslation()
  const [pickerOpen, setPickerOpen] = useState(false)
  const { data: languagesData } = useLanguagesQuery()

  const languagesByCode = useMemo(() => {
    const map = new Map<string, { flag: string; nativeName: string; englishName: string }>()

    for (const language of languagesData?.languages ?? []) {
      map.set(language.code, language)
    }

    return map
  }, [languagesData?.languages])

  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ fontWeight: '600' }}>{t('settings.fields.nativeLanguage.label')}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        {t('settings.fields.nativeLanguage.description')}
      </AppText>
      <Controller
        control={control}
        name="nativeLanguage"
        render={({ field: { onChange, value } }) => {
          const language = languagesByCode.get(value)

          return (
            <>
              <Pressable
                accessibilityLabel={t('settings.fields.nativeLanguage.accessibilityLabel')}
                accessibilityRole="button"
                onPress={() => setPickerOpen(true)}
                style={{
                  borderColor: '#cccccc',
                  borderRadius: 8,
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}
              >
                <AppText style={{ color: value ? '#111111' : '#888888' }}>
                  {language
                    ? `${language.flag} ${language.nativeName} (${language.englishName})`
                    : value || t('settings.fields.nativeLanguage.placeholder')}
                </AppText>
              </Pressable>
              <LanguageCatalogModal
                mode="select"
                title={t('settings.fields.nativeLanguage.pickerTitle')}
                visible={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(selected) => {
                  onChange(selected.code)
                  setPickerOpen(false)
                }}
              />
            </>
          )
        }}
      />
      <FormFieldError message={errors.nativeLanguage?.message} />
    </View>
  )
}

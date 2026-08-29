import { Ionicons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { SettingsLabeledRow } from '@/features/settings/components/settings-labeled-row'
import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { LanguageCatalogModal } from '@/features/study-languages/components/language-catalog-modal'
import { useLanguagesQuery } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type NativeLanguageFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
  onCommit?: (value: string) => void
}

export function NativeLanguageField({ control, errors, onCommit }: NativeLanguageFieldProps) {
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
    <View>
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
              >
                <SettingsLabeledRow
                  label={t('settings.fields.nativeLanguage.label')}
                  trailing={
                    <View
                      style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        flexShrink: 1,
                        gap: 4,
                      }}
                    >
                      <AppText
                        numberOfLines={1}
                        style={{
                          color: value ? '#344054' : '#98a2b3',
                          flexShrink: 1,
                          fontSize: 14,
                        }}
                      >
                        {language
                          ? `${language.flag} ${language.englishName}`
                          : value || t('settings.fields.nativeLanguage.placeholder')}
                      </AppText>
                      <Ionicons color="#98a2b3" name="chevron-forward" size={16} />
                    </View>
                  }
                />
              </Pressable>
              <LanguageCatalogModal
                mode="select"
                title={t('settings.fields.nativeLanguage.pickerTitle')}
                visible={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(selected) => {
                  onChange(selected.code)
                  setPickerOpen(false)
                  onCommit?.(selected.code)
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

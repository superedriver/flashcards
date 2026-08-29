import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import type { AppLocale } from '@/i18n'
import { AppText } from '@/ui/primitives'

type InterfaceLocaleFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
  onCommit?: (value: AppLocale) => void
}

export function InterfaceLocaleField({ control, onCommit }: InterfaceLocaleFieldProps) {
  const { t } = useTranslation()
  const localeOptions: Array<{ value: AppLocale; label: string }> = [
    { value: 'en', label: t('settings.fields.interfaceLocale.optionEn') },
    { value: 'uk', label: t('settings.fields.interfaceLocale.optionUk') },
  ]

  return (
    <View style={{ gap: 8 }}>
      <AppText style={{ color: '#344054', fontSize: 14, fontWeight: '600' }}>
        {t('settings.fields.interfaceLocale.label')}
      </AppText>
      <Controller
        control={control}
        name="interfaceLocale"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {localeOptions.map((option) => {
              const isSelected = value === option.value

              return (
                <Pressable
                  key={option.value}
                  accessibilityLabel={t('settings.fields.interfaceLocale.accessibilityLabel', {
                    label: option.label,
                  })}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    onChange(option.value)
                    onCommit?.(option.value)
                  }}
                  style={{
                    backgroundColor: isSelected ? '#e8f0fe' : '#ffffff',
                    borderColor: isSelected ? '#1a56db' : '#e4e7ec',
                    borderRadius: 8,
                    borderWidth: 1,
                    flex: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <AppText
                    style={{
                      color: isSelected ? '#1a56db' : '#344054',
                      fontWeight: isSelected ? '700' : '500',
                      textAlign: 'center',
                    }}
                  >
                    {option.label}
                  </AppText>
                </Pressable>
              )
            })}
          </View>
        )}
      />
    </View>
  )
}

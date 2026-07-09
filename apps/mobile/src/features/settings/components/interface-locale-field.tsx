import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import type { AppLocale } from '@/i18n'
import { AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type InterfaceLocaleFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function InterfaceLocaleField({ control, errors }: InterfaceLocaleFieldProps) {
  const { t } = useTranslation()
  const localeOptions: Array<{ value: AppLocale; label: string }> = [
    { value: 'en', label: t('settings.fields.interfaceLocale.optionEn') },
    { value: 'uk', label: t('settings.fields.interfaceLocale.optionUk') },
  ]

  return (
    <>
      <AppText style={{ fontWeight: '600' }}>{t('settings.fields.interfaceLocale.label')}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        {t('settings.fields.interfaceLocale.description')}
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
                  onPress={() => onChange(option.value)}
                  style={{
                    borderColor: isSelected ? '#1976d2' : '#cccccc',
                    borderRadius: 8,
                    borderWidth: 1,
                    flex: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: isSelected ? '#e3f2fd' : '#ffffff',
                  }}
                >
                  <AppText style={{ fontWeight: isSelected ? '700' : '500', textAlign: 'center' }}>
                    {option.label}
                  </AppText>
                </Pressable>
              )
            })}
          </View>
        )}
      />
      <FormFieldError message={errors.interfaceLocale?.message} />
    </>
  )
}

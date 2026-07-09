import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Pressable, View } from 'react-native'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import type { AppLocale } from '@/i18n'
import { AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

const LOCALE_OPTIONS: Array<{ value: AppLocale; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'uk', label: 'Українська' },
]

type InterfaceLocaleFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function InterfaceLocaleField({ control, errors }: InterfaceLocaleFieldProps) {
  return (
    <>
      <AppText style={{ fontWeight: '600' }}>Interface language</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Language for app menus, buttons, and messages.
      </AppText>
      <Controller
        control={control}
        name="interfaceLocale"
        render={({ field: { onChange, value } }) => (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LOCALE_OPTIONS.map((option) => {
              const isSelected = value === option.value

              return (
                <Pressable
                  key={option.value}
                  accessibilityLabel={`Interface language ${option.label}`}
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

import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppInput, AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type ReminderTimeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function ReminderTimeField({ control, errors }: ReminderTimeFieldProps) {
  const { t } = useTranslation()

  return (
    <>
      <AppText style={{ fontWeight: '600' }}>{t('settings.fields.reminderTime.label')}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        {t('settings.fields.reminderTime.description')}
      </AppText>
      <Controller
        control={control}
        name="reminderTime"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('settings.fields.reminderTime.accessibilityLabel')}
            placeholder={t('settings.fields.reminderTime.placeholder')}
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      <FormFieldError message={errors.reminderTime?.message} />
    </>
  )
}

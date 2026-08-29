import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { TextInput } from 'react-native'

import { SettingsLabeledRow } from '@/features/settings/components/settings-labeled-row'
import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { FormFieldError } from '@/ui/components'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

type ReminderTimeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
  onCommit?: (value: string) => void
}

export function ReminderTimeField({ control, errors, onCommit }: ReminderTimeFieldProps) {
  const { t } = useTranslation()

  return (
    <>
      <Controller
        control={control}
        name="reminderTime"
        render={({ field: { onBlur, onChange, value } }) => (
          <SettingsLabeledRow
            label={t('settings.fields.reminderTime.label')}
            trailing={
              <TextInput
                accessibilityLabel={t('settings.fields.reminderTime.accessibilityLabel')}
                placeholder={t('settings.fields.reminderTime.placeholder')}
                value={value ?? ''}
                onBlur={() => {
                  onBlur()
                  const next = value ?? ''
                  if (TIME_PATTERN.test(next)) {
                    onCommit?.(next)
                  }
                }}
                onChangeText={onChange}
                style={{
                  color: '#1a56db',
                  fontSize: 16,
                  fontWeight: '600',
                  minWidth: 64,
                  paddingVertical: 4,
                  textAlign: 'right',
                }}
              />
            }
          />
        )}
      />
      <FormFieldError message={errors.reminderTime?.message} />
    </>
  )
}

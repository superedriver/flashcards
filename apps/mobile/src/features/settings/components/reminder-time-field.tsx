import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppInput, AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type ReminderTimeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function ReminderTimeField({ control, errors }: ReminderTimeFieldProps) {
  return (
    <>
      <AppText style={{ fontWeight: '600' }}>Reminder time</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Daily reminder hour in 24-hour format (HH:mm). Minutes are stored but only the hour is used
        for reminders in this MVP.
      </AppText>
      <Controller
        control={control}
        name="reminderTime"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel="Reminder time"
            placeholder="09:00"
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

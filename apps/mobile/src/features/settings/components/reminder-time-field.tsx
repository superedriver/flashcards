import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppInput } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type ReminderTimeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function ReminderTimeField({ control, errors }: ReminderTimeFieldProps) {
  return (
    <>
      <Controller
        control={control}
        name="reminderTime"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="Reminder time (HH:mm)"
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.reminderTime ? <ErrorState message={errors.reminderTime.message} /> : null}
    </>
  )
}

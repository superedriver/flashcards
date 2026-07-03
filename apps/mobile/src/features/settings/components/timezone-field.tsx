import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppInput } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type TimezoneFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function TimezoneField({ control, errors }: TimezoneFieldProps) {
  return (
    <>
      <Controller
        control={control}
        name="timezone"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput placeholder="Timezone" value={value} onBlur={onBlur} onChangeText={onChange} />
        )}
      />
      {errors.timezone ? <ErrorState message={errors.timezone.message} /> : null}
    </>
  )
}

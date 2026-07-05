import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import {
  getDeviceTimezone,
  type SettingsFormValues,
} from '@/features/settings/validation/settings-form.schema'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type TimezoneFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function TimezoneField({ control, errors }: TimezoneFieldProps) {
  return (
    <>
      <AppText style={{ fontWeight: '600' }}>Timezone</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Used for daily reminder scheduling (IANA timezone, e.g. Europe/Kyiv).
      </AppText>
      <Controller
        control={control}
        name="timezone"
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <AppInput
              accessibilityLabel="Timezone"
              placeholder="Europe/Kyiv"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
            <AppButton
              accessibilityHint="Fills the timezone field with your device timezone."
              accessibilityLabel="Use device timezone"
              onPress={() => onChange(getDeviceTimezone())}
            >
              Use device timezone
            </AppButton>
          </>
        )}
      />
      <FormFieldError message={errors.timezone?.message} />
    </>
  )
}

import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <>
      <AppText style={{ fontWeight: '600' }}>{t('settings.fields.timezone.label')}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        {t('settings.fields.timezone.description')}
      </AppText>
      <Controller
        control={control}
        name="timezone"
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <AppInput
              accessibilityLabel={t('settings.fields.timezone.accessibilityLabel')}
              placeholder={t('settings.fields.timezone.placeholder')}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
            <AppButton
              accessibilityHint={t('settings.fields.timezone.useDeviceHint')}
              accessibilityLabel={t('settings.fields.timezone.useDeviceAccessibilityLabel')}
              onPress={() => onChange(getDeviceTimezone())}
            >
              {t('settings.fields.timezone.useDevice')}
            </AppButton>
          </>
        )}
      />
      <FormFieldError message={errors.timezone?.message} />
    </>
  )
}

import { useState } from 'react'
import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Switch, TextInput, View } from 'react-native'

import { SettingsLabeledRow } from '@/features/settings/components/settings-labeled-row'
import {
  getDeviceTimezone,
  type SettingsFormValues,
} from '@/features/settings/validation/settings-form.schema'
import { AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type TimezoneFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
  onCommit?: (value: string) => void
}

export function TimezoneField({ control, errors, onCommit }: TimezoneFieldProps) {
  const { t } = useTranslation()
  const deviceTimezone = getDeviceTimezone()
  const [lockToDevice, setLockToDevice] = useState<boolean | null>(null)

  return (
    <View style={{ gap: 10 }}>
      <Controller
        control={control}
        name="timezone"
        render={({ field: { onChange, value } }) => {
          const usingDevice = lockToDevice ?? value === deviceTimezone

          return (
            <>
              <SettingsLabeledRow
                label={t('settings.fields.timezone.label')}
                trailing={
                  usingDevice ? (
                    <AppText
                      numberOfLines={1}
                      style={{ color: '#667085', flexShrink: 1, fontSize: 14 }}
                    >
                      {value}
                    </AppText>
                  ) : (
                    <TextInput
                      accessibilityLabel={t('settings.fields.timezone.accessibilityLabel')}
                      placeholder={t('settings.fields.timezone.placeholder')}
                      value={value}
                      onBlur={() => {
                        const next = value.trim()
                        if (next) {
                          onCommit?.(next)
                        }
                      }}
                      onChangeText={onChange}
                      style={{
                        color: '#344054',
                        flexShrink: 1,
                        fontSize: 14,
                        minWidth: 120,
                        textAlign: 'right',
                      }}
                    />
                  )
                }
              />
              <SettingsLabeledRow
                label={t('settings.fields.timezone.useDevice')}
                trailing={
                  <Switch
                    accessibilityLabel={t('settings.fields.timezone.useDeviceAccessibilityLabel')}
                    value={usingDevice}
                    onValueChange={(next) => {
                      setLockToDevice(next)
                      if (next) {
                        onChange(deviceTimezone)
                        onCommit?.(deviceTimezone)
                      }
                    }}
                  />
                }
              />
            </>
          )
        }}
      />
      <FormFieldError message={errors.timezone?.message} />
    </View>
  )
}

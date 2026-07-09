import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppInput, AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type LessonSizeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function LessonSizeField({ control, errors }: LessonSizeFieldProps) {
  const { t } = useTranslation()

  return (
    <>
      <AppText style={{ fontWeight: '600' }}>{t('settings.fields.lessonSize.label')}</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        {t('settings.fields.lessonSize.description')}
      </AppText>
      <Controller
        control={control}
        name="lessonSize"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('settings.fields.lessonSize.accessibilityLabel')}
            keyboardType="number-pad"
            placeholder={t('settings.fields.lessonSize.placeholder')}
            value={String(value ?? '')}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      <FormFieldError message={errors.lessonSize?.message} />
    </>
  )
}

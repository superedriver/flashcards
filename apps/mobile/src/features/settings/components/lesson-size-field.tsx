import type { Control, FieldErrors } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppInput, AppText } from '@/ui/primitives'
import { FormFieldError } from '@/ui/components'

type LessonSizeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function LessonSizeField({ control, errors }: LessonSizeFieldProps) {
  return (
    <>
      <AppText style={{ fontWeight: '600' }}>Lesson size</AppText>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Number of cards per lesson session (5–100).
      </AppText>
      <Controller
        control={control}
        name="lessonSize"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            keyboardType="number-pad"
            placeholder="e.g. 20"
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

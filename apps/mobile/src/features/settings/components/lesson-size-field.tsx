import type { Control, FieldErrors } from 'react-hook-form'

import type { SettingsFormValues } from '@/features/settings/validation/settings-form.schema'
import { AppInput } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'
import { Controller } from 'react-hook-form'

type LessonSizeFieldProps = {
  control: Control<SettingsFormValues>
  errors: FieldErrors<SettingsFormValues>
}

export function LessonSizeField({ control, errors }: LessonSizeFieldProps) {
  return (
    <>
      <Controller
        control={control}
        name="lessonSize"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            keyboardType="number-pad"
            placeholder="Lesson size (5-100)"
            value={String(value ?? '')}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.lessonSize ? <ErrorState message={errors.lessonSize.message} /> : null}
    </>
  )
}

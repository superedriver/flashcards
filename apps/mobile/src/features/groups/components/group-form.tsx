import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import {
  groupFormSchema,
  type GroupFormValues,
} from '@/features/groups/validation/group-form.schema'
import { AppButton, AppInput } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type GroupFormProps = {
  cancelLabel?: string
  defaultValues?: GroupFormValues
  errorMessage?: string | null
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (values: GroupFormValues) => Promise<void>
  submitLabel: string
}

export function GroupForm({
  cancelLabel = 'Cancel',
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitLabel,
}: GroupFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<GroupFormValues>({
    defaultValues: defaultValues ?? {
      description: '',
      name: '',
    },
    resolver: zodResolver(groupFormSchema),
  })

  return (
    <View style={{ gap: 12 }}>
      <Controller
        control={control}
        name="name"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            placeholder="Group name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.name ? <ErrorState message={errors.name.message} /> : null}

      <Controller
        control={control}
        name="description"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            multiline
            numberOfLines={4}
            placeholder="Description (optional)"
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.description ? <ErrorState message={errors.description.message} /> : null}

      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      <AppButton disabled={isSubmitting} onPress={() => void handleSubmit(onSubmit)()}>
        {submitLabel}
      </AppButton>

      {onCancel ? (
        <AppButton disabled={isSubmitting} onPress={onCancel}>
          {cancelLabel}
        </AppButton>
      ) : null}
    </View>
  )
}

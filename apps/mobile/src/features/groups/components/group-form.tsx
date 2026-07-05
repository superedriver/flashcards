import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import {
  groupFormSchema,
  type GroupFormValues,
} from '@/features/groups/validation/group-form.schema'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState, FieldLabel, FormFieldError } from '@/ui/components'

type GroupFormProps = {
  cancelLabel?: string
  defaultValues?: GroupFormValues
  errorMessage?: string | null
  isSubmitting?: boolean
  onCancel?: () => void
  onClearError?: () => void
  onSubmit: (values: GroupFormValues) => Promise<void>
  submitLabel: string
  submittingLabel?: string
}

export function GroupForm({
  cancelLabel = 'Cancel',
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onClearError,
  onSubmit,
  submitLabel,
  submittingLabel,
}: GroupFormProps) {
  const isSubmittingRef = useRef(false)

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

  const handleFormSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || isSubmitting) {
      return
    }

    isSubmittingRef.current = true

    try {
      await onSubmit(values)
    } finally {
      isSubmittingRef.current = false
    }
  })

  const clearError = () => {
    onClearError?.()
  }

  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ color: '#666666', fontSize: 14 }}>
        Groups let you invite others and share decks for view-only study.
      </AppText>
      <FieldLabel>Group name</FieldLabel>
      <Controller
        control={control}
        name="name"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel="Group name"
            placeholder="Group name"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              clearError()
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.name?.message} />

      <FieldLabel>Description</FieldLabel>
      <Controller
        control={control}
        name="description"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel="Description (optional)"
            multiline
            numberOfLines={4}
            placeholder="Description (optional)"
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={(text) => {
              clearError()
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.description?.message} />

      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      <AppButton disabled={isSubmitting} onPress={() => void handleFormSubmit()}>
        {isSubmitting ? (submittingLabel ?? `${submitLabel}...`) : submitLabel}
      </AppButton>

      {onCancel ? (
        <AppButton disabled={isSubmitting} onPress={onCancel}>
          {cancelLabel}
        </AppButton>
      ) : null}
    </View>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { deckFormSchema, type DeckFormValues } from '@/features/decks/validation/deck-form.schema'
import { AppButton, AppInput } from '@/ui/primitives'
import { ErrorState, FieldLabel, FormFieldError } from '@/ui/components'

type DeckFormProps = {
  cancelLabel?: string
  defaultValues?: DeckFormValues
  errorMessage?: string | null
  isSubmitting?: boolean
  onCancel?: () => void
  onClearError?: () => void
  onSubmit: (values: DeckFormValues) => Promise<void>
  submitLabel: string
  submittingLabel?: string
}

export function DeckForm({
  cancelLabel = 'Cancel',
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onClearError,
  onSubmit,
  submitLabel,
  submittingLabel,
}: DeckFormProps) {
  const isSubmittingRef = useRef(false)

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<DeckFormValues>({
    defaultValues: defaultValues ?? {
      description: '',
      title: '',
    },
    resolver: zodResolver(deckFormSchema),
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
      <FieldLabel>Title</FieldLabel>
      <Controller
        control={control}
        name="title"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel="Title"
            placeholder="Title"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              clearError()
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.title?.message} />

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

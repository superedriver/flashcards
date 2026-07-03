import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { cardFormSchema, type CardFormValues } from '@/features/decks/validation/card-form.schema'
import { AppButton, AppInput } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type CardFormProps = {
  cancelLabel?: string
  defaultValues?: CardFormValues
  errorMessage?: string | null
  isSubmitting?: boolean
  onCancel?: () => void
  onDelete?: () => void
  onSubmit: (values: CardFormValues) => Promise<void>
  showDelete?: boolean
  submitLabel: string
}

export function CardForm({
  cancelLabel = 'Cancel',
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onDelete,
  onSubmit,
  showDelete = false,
  submitLabel,
}: CardFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<CardFormValues>({
    defaultValues: defaultValues ?? {
      back: '',
      example: '',
      front: '',
      notes: '',
    },
    resolver: zodResolver(cardFormSchema),
  })

  return (
    <View style={{ gap: 12 }}>
      <Controller
        control={control}
        name="front"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            multiline
            numberOfLines={3}
            placeholder="Front"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.front ? <ErrorState message={errors.front.message} /> : null}

      <Controller
        control={control}
        name="back"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            multiline
            numberOfLines={3}
            placeholder="Back"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.back ? <ErrorState message={errors.back.message} /> : null}

      <Controller
        control={control}
        name="example"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            multiline
            numberOfLines={3}
            placeholder="Example (optional)"
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.example ? <ErrorState message={errors.example.message} /> : null}

      <Controller
        control={control}
        name="notes"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            multiline
            numberOfLines={3}
            placeholder="Notes (optional)"
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors.notes ? <ErrorState message={errors.notes.message} /> : null}

      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      <AppButton disabled={isSubmitting} onPress={() => void handleSubmit(onSubmit)()}>
        {submitLabel}
      </AppButton>

      {onCancel ? (
        <AppButton disabled={isSubmitting} onPress={onCancel}>
          {cancelLabel}
        </AppButton>
      ) : null}

      {showDelete && onDelete ? (
        <AppButton background="#b00020" color="white" disabled={isSubmitting} onPress={onDelete}>
          Delete Card
        </AppButton>
      ) : null}
    </View>
  )
}

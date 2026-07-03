import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { View } from 'react-native'

import { deckFormSchema, type DeckFormValues } from '@/features/decks/validation/deck-form.schema'
import { AppButton, AppInput } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type DeckFormProps = {
  cancelLabel?: string
  defaultValues?: DeckFormValues
  errorMessage?: string | null
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (values: DeckFormValues) => Promise<void>
  submitLabel: string
}

export function DeckForm({
  cancelLabel = 'Cancel',
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitLabel,
}: DeckFormProps) {
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

  return (
    <View style={{ gap: 12 }}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput placeholder="Title" value={value} onBlur={onBlur} onChangeText={onChange} />
        )}
      />
      {errors.title ? <ErrorState message={errors.title.message} /> : null}

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

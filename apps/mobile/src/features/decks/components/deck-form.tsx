import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import {
  createDeckFormSchema,
  type DeckFormValues,
} from '@/features/decks/validation/deck-form.schema'
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
  cancelLabel,
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onClearError,
  onSubmit,
  submitLabel,
  submittingLabel,
}: DeckFormProps) {
  const { t } = useTranslation()
  const isSubmittingRef = useRef(false)
  const deckFormSchema = useMemo(() => createDeckFormSchema(t), [t])
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel')

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
      <FieldLabel>{t('decks.deckForm.title')}</FieldLabel>
      <Controller
        control={control}
        name="title"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('decks.deckForm.title')}
            placeholder={t('decks.deckForm.title')}
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

      <FieldLabel>{t('decks.deckForm.description')}</FieldLabel>
      <Controller
        control={control}
        name="description"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('decks.deckForm.descriptionOptional')}
            multiline
            numberOfLines={4}
            placeholder={t('decks.deckForm.descriptionOptional')}
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
          {resolvedCancelLabel}
        </AppButton>
      ) : null}
    </View>
  )
}

import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AiExampleGenerator } from '@/features/ai-examples/components/ai-example-generator'
import {
  createCardFormSchema,
  type CardFormValues,
} from '@/features/decks/validation/card-form.schema'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState, FieldLabel, FormFieldError } from '@/ui/components'
import { destructiveButtonA11yProps } from '@/ui/utils/accessibility'

type CardFormProps = {
  cancelLabel?: string
  cardId?: string
  defaultValues?: CardFormValues
  errorMessage?: string | null
  isSubmitting?: boolean
  onCancel?: () => void
  onClearError?: () => void
  onDelete?: () => void
  onSubmit: (values: CardFormValues) => Promise<void>
  showDelete?: boolean
  submitLabel: string
  submittingLabel?: string
}

export function CardForm({
  cancelLabel,
  cardId,
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onClearError,
  onDelete,
  onSubmit,
  showDelete = false,
  submitLabel,
  submittingLabel,
}: CardFormProps) {
  const { t } = useTranslation()
  const isSubmittingRef = useRef(false)
  const cardFormSchema = useMemo(() => createCardFormSchema(t), [t])
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel')

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<CardFormValues>({
    defaultValues: defaultValues ?? {
      back: '',
      example: '',
      front: '',
      notes: '',
    },
    resolver: zodResolver(cardFormSchema),
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
      <FieldLabel>{t('decks.cardForm.front')}</FieldLabel>
      <Controller
        control={control}
        name="front"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('decks.cardForm.front')}
            multiline
            numberOfLines={3}
            placeholder={t('decks.cardForm.front')}
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              clearError()
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.front?.message} />

      <FieldLabel>{t('decks.cardForm.back')}</FieldLabel>
      <Controller
        control={control}
        name="back"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('decks.cardForm.back')}
            multiline
            numberOfLines={3}
            placeholder={t('decks.cardForm.back')}
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              clearError()
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.back?.message} />

      <FieldLabel>{t('decks.cardForm.example')}</FieldLabel>
      <Controller
        control={control}
        name="example"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('decks.cardForm.exampleOptional')}
            multiline
            numberOfLines={3}
            placeholder={t('decks.cardForm.exampleOptional')}
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={(text) => {
              clearError()
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.example?.message} />

      {cardId ? (
        <AiExampleGenerator
          cardId={cardId}
          currentExample={watch('example')}
          onExampleSelected={(exampleText) =>
            setValue('example', exampleText, { shouldDirty: true, shouldValidate: true })
          }
        />
      ) : (
        <AppText style={{ color: '#666666' }}>{t('decks.cardForm.saveFirstForAi')}</AppText>
      )}

      <FieldLabel>{t('decks.cardForm.notes')}</FieldLabel>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('decks.cardForm.notesOptional')}
            multiline
            numberOfLines={3}
            placeholder={t('decks.cardForm.notesOptional')}
            value={value ?? ''}
            onBlur={onBlur}
            onChangeText={(text) => {
              clearError()
              onChange(text)
            }}
          />
        )}
      />
      <FormFieldError message={errors.notes?.message} />

      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      <AppButton disabled={isSubmitting} onPress={() => void handleFormSubmit()}>
        {isSubmitting ? (submittingLabel ?? `${submitLabel}...`) : submitLabel}
      </AppButton>

      {onCancel ? (
        <AppButton disabled={isSubmitting} onPress={onCancel}>
          {resolvedCancelLabel}
        </AppButton>
      ) : null}

      {showDelete && onDelete ? (
        <AppButton
          {...destructiveButtonA11yProps(t('decks.card.deleteCardA11y'))}
          background="#b00020"
          color="white"
          disabled={isSubmitting}
          onPress={onDelete}
        >
          {t('decks.card.deleteCard')}
        </AppButton>
      ) : null}
    </View>
  )
}

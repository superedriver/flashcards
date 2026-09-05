import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useRef } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import { AiExampleGenerator } from '@/features/ai-examples/components/ai-example-generator'
import { useUnsavedChangesGuard } from '@/features/decks/hooks/use-unsaved-changes-guard'
import { confirmAction, confirmDestructiveAction } from '@/features/decks/utils/confirm-destructive'
import { isLikelyFrontPaste } from '@/features/decks/utils/parse-bulk-card-lines'
import {
  createCardFormSchema,
  type CardFormValues,
} from '@/features/decks/validation/card-form.schema'
import { AppInput, AppText } from '@/ui/primitives'
import { ErrorState, FieldLabel, FormFieldError } from '@/ui/components'
import { buttonA11yProps, destructiveButtonA11yProps } from '@/ui/utils/accessibility'

const CARD_FORM_MAX_WIDTH = 640

type CardFormProps = {
  bulkFrontMessages?: string[] | null
  cancelLabel?: string
  cardId?: string
  defaultValues?: CardFormValues
  errorMessage?: string | null
  isSubmitting?: boolean
  onCancel?: () => void
  onClearError?: () => void
  onDelete?: () => Promise<boolean>
  onFrontTextChange?: (text: string, isPaste: boolean) => void
  onSubmit: (values: CardFormValues) => Promise<boolean>
  resetOnSuccess?: boolean
  showDelete?: boolean
  submitLabel: string
  submittingLabel?: string
}

export function CardForm({
  bulkFrontMessages,
  cancelLabel,
  cardId,
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onClearError,
  onDelete,
  onFrontTextChange,
  onSubmit,
  resetOnSuccess = false,
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
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setValue,
  } = useForm<CardFormValues>({
    defaultValues: defaultValues ?? {
      back: '',
      example: '',
      front: '',
      notes: '',
    },
    mode: 'onChange',
    resolver: zodResolver(cardFormSchema),
  })

  const frontValue = useWatch({ control, name: 'front' })
  const backValue = useWatch({ control, name: 'back' })
  const canSubmit =
    isDirty &&
    Boolean(frontValue?.trim()) &&
    Boolean(backValue?.trim()) &&
    !errors.front &&
    !errors.back &&
    !errors.example &&
    !errors.notes &&
    !isSubmitting &&
    !(bulkFrontMessages && bulkFrontMessages.length > 0)

  const { allowLeave, resetLeaveGuard } = useUnsavedChangesGuard(
    isDirty,
    t('decks.cardForm.unsavedTitle'),
    t('decks.cardForm.unsavedMessage'),
  )

  const handleFormSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || isSubmitting || !canSubmit) {
      return
    }

    isSubmittingRef.current = true
    allowLeave()

    try {
      const didSave = await onSubmit(values)

      if (!didSave) {
        resetLeaveGuard()
        return
      }

      if (resetOnSuccess) {
        reset({
          back: '',
          example: '',
          front: '',
          notes: '',
        })
        resetLeaveGuard()
      }
    } catch {
      resetLeaveGuard()
    } finally {
      isSubmittingRef.current = false
    }
  })

  const clearError = () => {
    onClearError?.()
  }

  const handleCancel = () => {
    if (!onCancel) {
      return
    }

    if (!isDirty) {
      onCancel()
      return
    }

    confirmAction(t('decks.cardForm.unsavedTitle'), t('decks.cardForm.unsavedMessage'), () => {
      allowLeave()
      onCancel()
    })
  }

  const handleDelete = () => {
    if (!onDelete) {
      return
    }

    confirmDestructiveAction(t('decks.card.deleteTitle'), t('decks.card.deleteMessage'), () => {
      void (async () => {
        allowLeave()

        try {
          const didDelete = await onDelete()

          if (!didDelete) {
            resetLeaveGuard()
          }
        } catch {
          resetLeaveGuard()
        }
      })()
    })
  }

  const exampleField = (
    <Controller
      control={control}
      name="example"
      render={({ field: { onBlur, onChange, value } }) => (
        <AppInput
          accessibilityLabel={t('decks.cardForm.exampleOptional')}
          multiline
          numberOfLines={4}
          placeholder={t('decks.cardForm.exampleOptional')}
          value={value ?? ''}
          onBlur={onBlur}
          onChangeText={(text) => {
            clearError()
            onChange(text)
          }}
          style={{ minHeight: 96 }}
        />
      )}
    />
  )

  return (
    <View style={{ gap: 12, maxWidth: CARD_FORM_MAX_WIDTH, width: '100%' }}>
      <View
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e4e7ec',
          borderRadius: 12,
          borderWidth: 1,
          gap: 12,
          padding: 16,
        }}
      >
        <View>
          <FieldLabel>{t('decks.cardForm.front')}</FieldLabel>
          <Controller
            control={control}
            name="front"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                accessibilityLabel={t('decks.cardForm.front')}
                multiline={Boolean(onFrontTextChange)}
                placeholder={t('decks.cardForm.front')}
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => {
                  clearError()
                  onFrontTextChange?.(text, isLikelyFrontPaste(value, text))
                  onChange(text)
                }}
              />
            )}
          />
          <FormFieldError message={errors.front?.message} />
          {bulkFrontMessages && bulkFrontMessages.length > 0 ? (
            <View
              accessibilityRole="alert"
              style={{
                backgroundColor: '#fef3f2',
                borderColor: '#fecdca',
                borderRadius: 8,
                borderWidth: 1,
                gap: 4,
                marginTop: 8,
                padding: 10,
              }}
            >
              <AppText style={{ color: '#b42318', fontSize: 13, fontWeight: '700' }}>
                {t('decks.createCard.bulkErrorTitle')}
              </AppText>
              {bulkFrontMessages.map((message, index) => (
                <AppText key={`${index}-${message}`} style={{ color: '#b42318', fontSize: 13 }}>
                  {message}
                </AppText>
              ))}
            </View>
          ) : null}
        </View>

        <View>
          <FieldLabel>{t('decks.cardForm.back')}</FieldLabel>
          <Controller
            control={control}
            name="back"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                accessibilityLabel={t('decks.cardForm.back')}
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
        </View>

        {cardId ? (
          <AiExampleGenerator
            cardId={cardId}
            onExampleSelected={(exampleText) =>
              setValue('example', exampleText, { shouldDirty: true, shouldValidate: true })
            }
          >
            {({ generateButton, suggestions }) => (
              <View>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}
                >
                  <AppText style={{ fontWeight: '600' }}>{t('decks.cardForm.example')}</AppText>
                  {generateButton}
                </View>
                {exampleField}
                <FormFieldError message={errors.example?.message} />
                <View style={{ marginTop: 8 }}>{suggestions}</View>
              </View>
            )}
          </AiExampleGenerator>
        ) : (
          <View>
            <FieldLabel>{t('decks.cardForm.example')}</FieldLabel>
            {exampleField}
            <FormFieldError message={errors.example?.message} />
            <AppText style={{ color: '#667085', fontSize: 13, marginTop: 6 }}>
              {t('decks.cardForm.saveFirstForAi')}
            </AppText>
          </View>
        )}

        <View>
          <FieldLabel>{t('decks.cardForm.notes')}</FieldLabel>
          <Controller
            control={control}
            name="notes"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                accessibilityLabel={t('decks.cardForm.notesOptional')}
                multiline
                numberOfLines={4}
                placeholder={t('decks.cardForm.notesOptional')}
                value={value ?? ''}
                onBlur={onBlur}
                onChangeText={(text) => {
                  clearError()
                  onChange(text)
                }}
                style={{ minHeight: 96 }}
              />
            )}
          />
          <FormFieldError message={errors.notes?.message} />
        </View>

        {errorMessage ? <ErrorState message={errorMessage} /> : null}
      </View>

      <Pressable
        {...buttonA11yProps(submitLabel)}
        disabled={!canSubmit}
        onPress={() => void handleFormSubmit()}
        style={{
          alignItems: 'center',
          backgroundColor: '#1a56db',
          borderRadius: 8,
          opacity: canSubmit ? 1 : 0.45,
          paddingVertical: 12,
        }}
      >
        <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
          {isSubmitting ? (submittingLabel ?? `${submitLabel}...`) : submitLabel}
        </AppText>
      </Pressable>

      {onCancel ? (
        <Pressable
          {...buttonA11yProps(resolvedCancelLabel)}
          disabled={isSubmitting}
          onPress={handleCancel}
          style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.5 : 1, paddingVertical: 4 }}
        >
          <AppText style={{ color: '#667085', fontSize: 15, fontWeight: '600' }}>
            {resolvedCancelLabel}
          </AppText>
        </Pressable>
      ) : null}

      {showDelete && onDelete ? (
        <View style={{ gap: 8, marginTop: 8 }}>
          <AppText style={{ color: '#b42318', fontSize: 13, fontWeight: '700' }}>
            {t('decks.actions.dangerZone')}
          </AppText>
          <Pressable
            {...destructiveButtonA11yProps(t('decks.card.deleteCardA11y'))}
            disabled={isSubmitting}
            onPress={handleDelete}
            style={{
              alignItems: 'center',
              alignSelf: 'flex-start',
              flexDirection: 'row',
              gap: 6,
              opacity: isSubmitting ? 0.5 : 1,
              paddingVertical: 4,
            }}
          >
            <Ionicons color="#b42318" name="trash-outline" size={16} />
            <AppText style={{ color: '#b42318', fontSize: 14, fontWeight: '600' }}>
              {t('decks.card.deleteCard')}
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  )
}

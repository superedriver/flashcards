import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import {
  createGroupFormSchema,
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
  cancelLabel,
  defaultValues,
  errorMessage,
  isSubmitting = false,
  onCancel,
  onClearError,
  onSubmit,
  submitLabel,
  submittingLabel,
}: GroupFormProps) {
  const { t } = useTranslation()
  const isSubmittingRef = useRef(false)
  const groupFormSchema = useMemo(() => createGroupFormSchema(t), [t])
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel')

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
        {t('groups.groupForm.description')}
      </AppText>
      <FieldLabel>{t('groups.groupForm.name')}</FieldLabel>
      <Controller
        control={control}
        name="name"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('groups.groupForm.name')}
            placeholder={t('groups.groupForm.name')}
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

      <FieldLabel>{t('groups.groupForm.descriptionLabel')}</FieldLabel>
      <Controller
        control={control}
        name="description"
        render={({ field: { onBlur, onChange, value } }) => (
          <AppInput
            accessibilityLabel={t('groups.groupForm.descriptionOptional')}
            multiline
            numberOfLines={4}
            placeholder={t('groups.groupForm.descriptionOptional')}
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

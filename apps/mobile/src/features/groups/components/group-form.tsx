import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo, useRef } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
  createGroupFormSchema,
  type GroupFormValues,
} from '@/features/groups/validation/group-form.schema'
import { AppInput, AppText } from '@/ui/primitives'
import { ErrorState, FieldLabel, FormFieldError } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

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

  const nameValue = useWatch({ control, name: 'name' })
  const canSubmit = Boolean(nameValue?.trim()) && !isSubmitting

  const handleFormSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || isSubmitting || !values.name.trim()) {
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
          <FieldLabel>{t('groups.groupForm.name')}</FieldLabel>
          <Controller
            control={control}
            name="name"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                accessibilityLabel={t('groups.groupForm.name')}
                maxLength={GROUP_NAME_MAX_LENGTH}
                placeholder={t('groups.groupForm.namePlaceholder')}
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
        </View>

        <View>
          <FieldLabel>{t('groups.groupForm.descriptionLabel')}</FieldLabel>
          <Controller
            control={control}
            name="description"
            render={({ field: { onBlur, onChange, value } }) => (
              <AppInput
                accessibilityLabel={t('groups.groupForm.descriptionLabel')}
                maxLength={GROUP_DESCRIPTION_MAX_LENGTH}
                multiline
                numberOfLines={4}
                placeholder={t('groups.groupForm.descriptionPlaceholder')}
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
          <FormFieldError message={errors.description?.message} />
        </View>

        {errorMessage ? <ErrorState message={errorMessage} /> : null}

        <View style={{ alignItems: 'flex-end', marginTop: 4 }}>
          <Pressable
            {...buttonA11yProps(submitLabel)}
            disabled={!canSubmit}
            onPress={() => void handleFormSubmit()}
            style={{
              backgroundColor: '#1a56db',
              borderRadius: 8,
              opacity: canSubmit ? 1 : 0.45,
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <AppText style={{ color: '#ffffff', fontSize: 15, fontWeight: '700' }}>
              {isSubmitting ? (submittingLabel ?? `${submitLabel}...`) : submitLabel}
            </AppText>
          </Pressable>
        </View>
      </View>

      {onCancel ? (
        <Pressable
          {...buttonA11yProps(resolvedCancelLabel)}
          disabled={isSubmitting}
          onPress={onCancel}
          style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.5 : 1, paddingVertical: 4 }}
        >
          <AppText style={{ color: '#667085', fontSize: 15, fontWeight: '600' }}>
            {resolvedCancelLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  )
}

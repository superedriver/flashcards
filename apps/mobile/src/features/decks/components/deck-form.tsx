import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Pressable, View } from 'react-native'

import {
  createDeckFormSchema,
  type DeckFormValues,
} from '@/features/decks/validation/deck-form.schema'
import { LanguageCatalogModal } from '@/features/study-languages/components/language-catalog-modal'
import { useLanguagesQuery } from '@/graphql/generated'
import { AppButton, AppInput, AppText } from '@/ui/primitives'
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
  const [pickerField, setPickerField] = useState<'targetLanguage' | 'sourceLanguage' | null>(null)

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<DeckFormValues>({
    defaultValues: defaultValues ?? {
      description: '',
      sourceLanguage: '',
      targetLanguage: '',
      title: '',
    },
    resolver: zodResolver(deckFormSchema),
  })

  useEffect(() => {
    if (!defaultValues) {
      return
    }

    reset(defaultValues)
  }, [defaultValues, reset])

  const targetLanguage = watch('targetLanguage')
  const sourceLanguage = watch('sourceLanguage')

  const { data: languagesData } = useLanguagesQuery()
  const languagesByCode = useMemo(() => {
    const map = new Map<string, { flag: string; nativeName: string; englishName: string }>()

    for (const language of languagesData?.languages ?? []) {
      map.set(language.code, language)
    }

    return map
  }, [languagesData?.languages])

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

  function renderLanguageValue(code: string) {
    const language = languagesByCode.get(code)

    if (!language) {
      return code || t('decks.deckForm.languagePlaceholder')
    }

    return `${language.flag} ${language.nativeName} (${language.englishName})`
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

      <FieldLabel>{t('decks.deckForm.targetLanguage')}</FieldLabel>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          clearError()
          setPickerField('targetLanguage')
        }}
        style={{
          borderColor: '#cccccc',
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}
      >
        <AppText style={{ color: targetLanguage ? '#111111' : '#888888' }}>
          {renderLanguageValue(targetLanguage)}
        </AppText>
      </Pressable>
      <FormFieldError message={errors.targetLanguage?.message} />

      <FieldLabel>{t('decks.deckForm.sourceLanguage')}</FieldLabel>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          clearError()
          setPickerField('sourceLanguage')
        }}
        style={{
          borderColor: '#cccccc',
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}
      >
        <AppText style={{ color: sourceLanguage ? '#111111' : '#888888' }}>
          {renderLanguageValue(sourceLanguage)}
        </AppText>
      </Pressable>
      <FormFieldError message={errors.sourceLanguage?.message} />

      {targetLanguage && sourceLanguage && targetLanguage === sourceLanguage ? (
        <AppText style={{ color: '#ed6c02' }}>{t('decks.deckForm.sameLanguageWarning')}</AppText>
      ) : null}

      {errorMessage ? <ErrorState message={errorMessage} /> : null}

      <AppButton disabled={isSubmitting} onPress={() => void handleFormSubmit()}>
        {isSubmitting ? (submittingLabel ?? `${submitLabel}...`) : submitLabel}
      </AppButton>

      {onCancel ? (
        <AppButton disabled={isSubmitting} onPress={onCancel}>
          {resolvedCancelLabel}
        </AppButton>
      ) : null}

      <LanguageCatalogModal
        mode="select"
        title={
          pickerField === 'sourceLanguage'
            ? t('decks.deckForm.sourceLanguage')
            : t('decks.deckForm.targetLanguage')
        }
        visible={pickerField !== null}
        onClose={() => setPickerField(null)}
        onSelect={(language) => {
          if (!pickerField) {
            return
          }

          setValue(pickerField, language.code, { shouldDirty: true, shouldValidate: true })
        }}
      />
    </View>
  )
}

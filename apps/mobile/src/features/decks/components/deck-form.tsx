import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, Pressable, View } from 'react-native'

import {
  createDeckFormSchema,
  type DeckFormValues,
} from '@/features/decks/validation/deck-form.schema'
import { LanguageCatalogModal } from '@/features/study-languages/components/language-catalog-modal'
import { useLanguagesQuery } from '@/graphql/generated'
import { AppInput, AppText } from '@/ui/primitives'
import { ErrorState, FieldLabel, FormFieldError } from '@/ui/components'
import { buttonA11yProps } from '@/ui/utils/accessibility'

const DECK_FORM_MAX_WIDTH = 640

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

function LanguageSelectorRow({
  accessibilityLabel,
  caption,
  displayValue,
  isEmpty,
  onPress,
}: {
  accessibilityLabel: string
  caption: string
  displayValue: string
  isEmpty: boolean
  onPress: () => void
}) {
  return (
    <View style={{ flex: 1, minWidth: 0 }}>
      <Pressable
        {...buttonA11yProps(accessibilityLabel)}
        onPress={onPress}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: 4,
          minHeight: 36,
        }}
      >
        <AppText
          numberOfLines={1}
          style={{
            color: isEmpty ? '#98a2b3' : '#101828',
            flex: 1,
            fontSize: 15,
            fontWeight: '600',
          }}
        >
          {displayValue}
        </AppText>
        <Ionicons color="#98a2b3" name="chevron-forward" size={16} />
      </Pressable>
      <AppText style={{ color: '#667085', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
        {caption}
      </AppText>
    </View>
  )
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
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setValue,
  } = useForm<DeckFormValues>({
    defaultValues: defaultValues ?? {
      description: '',
      sourceLanguage: '',
      targetLanguage: '',
      title: '',
    },
    mode: 'onChange',
    resolver: zodResolver(deckFormSchema),
  })

  useEffect(() => {
    if (!defaultValues) {
      return
    }

    reset(defaultValues)
  }, [defaultValues, reset])

  const titleValue = useWatch({ control, name: 'title' })
  const targetLanguage = useWatch({ control, name: 'targetLanguage' })
  const sourceLanguage = useWatch({ control, name: 'sourceLanguage' })

  const canSubmit =
    isDirty &&
    Boolean(titleValue?.trim()) &&
    Boolean(targetLanguage?.trim()) &&
    Boolean(sourceLanguage?.trim()) &&
    !errors.title &&
    !errors.description &&
    !errors.targetLanguage &&
    !errors.sourceLanguage &&
    !isSubmitting

  const { data: languagesData } = useLanguagesQuery()
  const languagesByCode = useMemo(() => {
    const map = new Map<string, { flag: string; nativeName: string; englishName: string }>()

    for (const language of languagesData?.languages ?? []) {
      map.set(language.code, language)
    }

    return map
  }, [languagesData?.languages])

  const handleFormSubmit = handleSubmit(async (values) => {
    if (isSubmittingRef.current || isSubmitting || !canSubmit) {
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

    return `${language.flag} ${language.nativeName}`
  }

  const openPicker = (field: 'targetLanguage' | 'sourceLanguage') => {
    clearError()
    setPickerField(field)
  }

  return (
    <View style={{ gap: 12, maxWidth: DECK_FORM_MAX_WIDTH, width: '100%' }}>
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
        </View>

        <View>
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
                style={{ minHeight: 96 }}
              />
            )}
          />
          <FormFieldError message={errors.description?.message} />
        </View>

        <View>
          <FieldLabel>{t('decks.deckForm.languages')}</FieldLabel>
          <View
            style={{
              backgroundColor: '#f9fafb',
              borderColor: '#e4e7ec',
              borderRadius: 12,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
              <LanguageSelectorRow
                accessibilityLabel={t('decks.deckForm.targetLanguage')}
                caption={t('decks.deckForm.targetShort')}
                displayValue={renderLanguageValue(targetLanguage ?? '')}
                isEmpty={!targetLanguage}
                onPress={() => openPicker('targetLanguage')}
              />
              <AppText style={{ color: '#667085', fontSize: 16, fontWeight: '700' }}>→</AppText>
              <LanguageSelectorRow
                accessibilityLabel={t('decks.deckForm.sourceLanguage')}
                caption={t('decks.deckForm.sourceShort')}
                displayValue={renderLanguageValue(sourceLanguage ?? '')}
                isEmpty={!sourceLanguage}
                onPress={() => openPicker('sourceLanguage')}
              />
            </View>
          </View>
          <FormFieldError message={errors.targetLanguage?.message} />
          <FormFieldError message={errors.sourceLanguage?.message} />
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
          onPress={onCancel}
          style={{ alignSelf: 'flex-start', opacity: isSubmitting ? 0.5 : 1, paddingVertical: 4 }}
        >
          <AppText style={{ color: '#667085', fontSize: 15, fontWeight: '600' }}>
            {resolvedCancelLabel}
          </AppText>
        </Pressable>
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

          const otherCode = pickerField === 'targetLanguage' ? sourceLanguage : targetLanguage

          if (otherCode && language.code === otherCode) {
            Alert.alert(
              t('decks.deckForm.sameLanguageTitle'),
              t('decks.deckForm.sameLanguageWarning'),
            )
          }
        }}
      />
    </View>
  )
}

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type CsvInputFormProps = {
  csvText: string
  errorMessage?: string | null
  isSubmitting?: boolean
  onChangeCsvText: (value: string) => void
  onClearError?: () => void
  onPreview: () => void
}

export function CsvInputForm({
  csvText,
  errorMessage,
  isSubmitting = false,
  onChangeCsvText,
  onClearError,
  onPreview,
}: CsvInputFormProps) {
  const { t } = useTranslation()

  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ fontWeight: '600' }}>{t('csvImport.form.formatTitle')}</AppText>
      <AppText style={{ color: '#666666' }}>{t('csvImport.form.formatDescription')}</AppText>
      <AppText style={{ color: '#666666', fontFamily: 'monospace', fontSize: 13 }}>
        {t('csvImport.form.example')}
      </AppText>
      <AppInput
        multiline
        numberOfLines={10}
        placeholder={t('csvImport.form.placeholder')}
        value={csvText}
        onChangeText={(text) => {
          onClearError?.()
          onChangeCsvText(text)
        }}
      />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      <AppButton disabled={isSubmitting || csvText.trim().length === 0} onPress={onPreview}>
        {isSubmitting ? t('csvImport.form.previewing') : t('csvImport.form.preview')}
      </AppButton>
    </View>
  )
}

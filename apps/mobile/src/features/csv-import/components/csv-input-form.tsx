import { View } from 'react-native'

import { AppButton, AppInput, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

type CsvInputFormProps = {
  csvText: string
  errorMessage?: string | null
  isSubmitting?: boolean
  onChangeCsvText: (value: string) => void
  onPreview: () => void
}

export function CsvInputForm({
  csvText,
  errorMessage,
  isSubmitting = false,
  onChangeCsvText,
  onPreview,
}: CsvInputFormProps) {
  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ fontWeight: '600' }}>CSV format</AppText>
      <AppText style={{ color: '#666666' }}>
        {`front,back,example,notes\nhello,привіт,Hello world,Common greeting`}
      </AppText>
      <AppInput
        multiline
        numberOfLines={10}
        placeholder="Paste CSV text here"
        value={csvText}
        onChangeText={onChangeCsvText}
      />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      <AppButton disabled={isSubmitting || csvText.trim().length === 0} onPress={onPreview}>
        Preview import
      </AppButton>
    </View>
  )
}

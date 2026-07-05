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
  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ fontWeight: '600' }}>CSV format</AppText>
      <AppText style={{ color: '#666666' }}>
        First row must be a header. Required columns: front, back. Optional: example, notes.
      </AppText>
      <AppText style={{ color: '#666666', fontFamily: 'monospace', fontSize: 13 }}>
        {`front,back,example,notes\nhello,привіт,Hello world,Common greeting`}
      </AppText>
      <AppInput
        multiline
        numberOfLines={10}
        placeholder="Paste CSV text here"
        value={csvText}
        onChangeText={(text) => {
          onClearError?.()
          onChangeCsvText(text)
        }}
      />
      {errorMessage ? <ErrorState message={errorMessage} /> : null}
      <AppButton disabled={isSubmitting || csvText.trim().length === 0} onPress={onPreview}>
        {isSubmitting ? 'Previewing...' : 'Preview import'}
      </AppButton>
    </View>
  )
}

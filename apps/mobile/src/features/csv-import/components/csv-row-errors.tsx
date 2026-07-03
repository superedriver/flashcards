import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type CsvRowErrorsProps = {
  errors: Array<{ field?: string | null; message: string; rowNumber: number }>
}

export function CsvRowErrors({ errors }: CsvRowErrorsProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <View style={{ gap: 4, marginTop: 4 }}>
      {errors.map((error, index) => (
        <AppText
          key={`${error.rowNumber}-${error.field ?? 'field'}-${index}`}
          style={{ color: '#b00020' }}
        >
          Row {error.rowNumber}
          {error.field ? ` (${error.field})` : ''}: {error.message}
        </AppText>
      ))}
    </View>
  )
}

import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { AppText } from '@/ui/primitives'

type CsvRowErrorsProps = {
  errors: Array<{ field?: string | null; message: string; rowNumber: number }>
}

export function CsvRowErrors({ errors }: CsvRowErrorsProps) {
  const { t } = useTranslation()

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
          {t('csvImport.rowError', {
            row: error.rowNumber,
            field: error.field ? t('csvImport.rowErrorField', { field: error.field }) : '',
            message: error.message,
          })}
        </AppText>
      ))}
    </View>
  )
}

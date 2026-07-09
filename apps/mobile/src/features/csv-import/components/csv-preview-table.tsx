import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { PreviewCsvImportMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

import { CsvRowErrors } from './csv-row-errors'

type CsvPreviewTableProps = {
  previewRows: PreviewCsvImportMutation['previewCsvImport']['previewRows']
}

export function CsvPreviewTable({ previewRows }: CsvPreviewTableProps) {
  const { t } = useTranslation()
  const missing = t('csvImport.preview.missing')

  return (
    <View style={{ gap: 12 }}>
      {previewRows.map((row) => (
        <View
          key={row.rowNumber}
          style={{
            borderColor: row.isValid ? '#cccccc' : '#b00020',
            borderRadius: 8,
            borderWidth: 1,
            gap: 4,
            padding: 12,
          }}
        >
          <AppText style={{ fontWeight: '600' }}>
            {row.isValid
              ? t('csvImport.preview.rowValid', { number: row.rowNumber })
              : t('csvImport.preview.rowInvalid', { number: row.rowNumber })}
          </AppText>
          <AppText>{t('csvImport.preview.front', { value: row.front ?? missing })}</AppText>
          <AppText>{t('csvImport.preview.back', { value: row.back ?? missing })}</AppText>
          {row.example ? (
            <AppText>{t('csvImport.preview.example', { value: row.example })}</AppText>
          ) : null}
          {row.notes ? (
            <AppText>{t('csvImport.preview.notes', { value: row.notes })}</AppText>
          ) : null}
          <CsvRowErrors errors={row.errors} />
        </View>
      ))}
    </View>
  )
}

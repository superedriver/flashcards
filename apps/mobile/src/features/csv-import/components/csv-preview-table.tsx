import { View } from 'react-native'

import type { PreviewCsvImportMutation } from '@/graphql/generated'
import { AppText } from '@/ui/primitives'

import { CsvRowErrors } from './csv-row-errors'

type CsvPreviewTableProps = {
  previewRows: PreviewCsvImportMutation['previewCsvImport']['previewRows']
}

export function CsvPreviewTable({ previewRows }: CsvPreviewTableProps) {
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
            Row {row.rowNumber} {row.isValid ? '(valid)' : '(invalid)'}
          </AppText>
          <AppText>Front: {row.front ?? '—'}</AppText>
          <AppText>Back: {row.back ?? '—'}</AppText>
          {row.example ? <AppText>Example: {row.example}</AppText> : null}
          {row.notes ? <AppText>Notes: {row.notes}</AppText> : null}
          <CsvRowErrors errors={row.errors} />
        </View>
      ))}
    </View>
  )
}

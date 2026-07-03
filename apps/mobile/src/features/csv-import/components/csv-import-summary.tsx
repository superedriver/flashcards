import { View } from 'react-native'

import type { PreviewCsvImportMutation } from '@/graphql/generated'
import { CsvImportStatus } from '@/graphql/generated'
import { AppButton, AppText } from '@/ui/primitives'
import { ErrorState } from '@/ui/components'

import { CsvPreviewTable } from './csv-preview-table'
import { CsvRowErrors } from './csv-row-errors'

type CsvImportSummaryProps = {
  importResult: PreviewCsvImportMutation['previewCsvImport']
  isConfirming?: boolean
  onConfirm?: () => void
}

export function CsvImportSummary({
  importResult,
  isConfirming = false,
  onConfirm,
}: CsvImportSummaryProps) {
  const canConfirm =
    importResult.status === CsvImportStatus.Pending &&
    importResult.validRows > 0 &&
    Boolean(onConfirm)

  return (
    <View style={{ gap: 12 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Import preview</AppText>
      <AppText>Total rows: {importResult.totalRows}</AppText>
      <AppText>Valid rows: {importResult.validRows}</AppText>
      <AppText>Invalid rows: {importResult.invalidRows}</AppText>

      {importResult.invalidRows > 0 ? (
        <AppText style={{ color: '#666666' }}>Invalid rows will be skipped during import.</AppText>
      ) : null}

      <CsvRowErrors errors={importResult.errors} />
      <CsvPreviewTable previewRows={importResult.previewRows} />

      {canConfirm ? (
        <AppButton disabled={isConfirming} onPress={onConfirm}>
          Confirm import
        </AppButton>
      ) : null}

      {importResult.validRows === 0 ? (
        <ErrorState message="No valid rows to import. Fix your CSV and try again." />
      ) : null}
    </View>
  )
}

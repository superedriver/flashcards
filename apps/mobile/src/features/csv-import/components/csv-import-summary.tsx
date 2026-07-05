import { View } from 'react-native'

import type { PreviewCsvImportMutation } from '@/graphql/generated'
import { CsvImportStatus } from '@/graphql/generated'
import { AppButton, AppCard, AppText } from '@/ui/primitives'
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
    <View style={{ gap: 12, marginTop: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>Import preview</AppText>
      <AppCard style={{ gap: 8, padding: 16 }}>
        <AppText>Total rows: {importResult.totalRows}</AppText>
        <AppText style={{ color: '#2e7d32' }}>Valid rows: {importResult.validRows}</AppText>
        <AppText style={{ color: importResult.invalidRows > 0 ? '#c62828' : '#666666' }}>
          Invalid rows: {importResult.invalidRows}
        </AppText>
        {importResult.invalidRows > 0 ? (
          <AppText style={{ color: '#666666', fontSize: 14 }}>
            Invalid rows will be skipped. Only valid rows are imported.
          </AppText>
        ) : null}
      </AppCard>

      <CsvRowErrors errors={importResult.errors} />
      <CsvPreviewTable previewRows={importResult.previewRows} />

      {canConfirm ? (
        <AppButton disabled={isConfirming} onPress={onConfirm}>
          {isConfirming ? 'Importing...' : `Import ${importResult.validRows} cards`}
        </AppButton>
      ) : null}

      {importResult.validRows === 0 ? (
        <ErrorState message="No valid rows to import. Fix your CSV and preview again." />
      ) : null}
    </View>
  )
}

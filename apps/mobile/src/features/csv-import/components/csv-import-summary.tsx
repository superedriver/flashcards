import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const canConfirm =
    importResult.status === CsvImportStatus.Pending &&
    importResult.validRows > 0 &&
    Boolean(onConfirm)

  return (
    <View style={{ gap: 12, marginTop: 16 }}>
      <AppText style={{ fontSize: 16, fontWeight: '600' }}>{t('csvImport.summary.title')}</AppText>
      <AppCard style={{ gap: 8, padding: 16 }}>
        <AppText>{t('csvImport.summary.totalRows', { count: importResult.totalRows })}</AppText>
        <AppText style={{ color: '#2e7d32' }}>
          {t('csvImport.summary.validRows', { count: importResult.validRows })}
        </AppText>
        <AppText style={{ color: importResult.invalidRows > 0 ? '#c62828' : '#666666' }}>
          {t('csvImport.summary.invalidRows', { count: importResult.invalidRows })}
        </AppText>
        {importResult.invalidRows > 0 ? (
          <AppText style={{ color: '#666666', fontSize: 14 }}>
            {t('csvImport.summary.invalidHint')}
          </AppText>
        ) : null}
      </AppCard>

      <CsvRowErrors errors={importResult.errors} />
      <CsvPreviewTable previewRows={importResult.previewRows} />

      {canConfirm ? (
        <AppButton disabled={isConfirming} onPress={onConfirm}>
          {isConfirming
            ? t('csvImport.summary.importing')
            : t('csvImport.summary.importCards', { count: importResult.validRows })}
        </AppButton>
      ) : null}

      {importResult.validRows === 0 ? (
        <ErrorState message={t('csvImport.summary.noValidRows')} />
      ) : null}
    </View>
  )
}

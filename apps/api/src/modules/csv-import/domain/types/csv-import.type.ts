import { CsvImportStatus } from './csv-import-status.type';
import { CsvImportPreviewRow, CsvImportRowError } from './csv-import-row.type';

export type CsvImport = {
  id: string;
  userId: string;
  deckId: string;
  status: CsvImportStatus;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  previewRows: CsvImportPreviewRow[];
  errors: CsvImportRowError[];
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
  expiresAt: Date;
};

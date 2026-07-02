import {
  CsvImport,
  CsvImportPreviewRow,
  CsvImportRowError,
} from '../../domain/types';

export const CSV_IMPORT_REPOSITORY = Symbol('CSV_IMPORT_REPOSITORY');

export type CreateCsvImportInput = {
  userId: string;
  deckId: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  previewRows: CsvImportPreviewRow[];
  errors: CsvImportRowError[];
  expiresAt: Date;
};

export type CsvImportRepositoryPort = {
  create(input: CreateCsvImportInput): Promise<CsvImport>;
  findById(importId: string): Promise<CsvImport | null>;
  markConfirmed(importId: string, confirmedAt: Date): Promise<CsvImport>;
  markExpired(importId: string): Promise<CsvImport>;
};

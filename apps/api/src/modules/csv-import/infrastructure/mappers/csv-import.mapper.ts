import {
  CsvImport,
  CsvImportPreviewRow,
  CsvImportRowError,
  CsvImportStatus,
} from '../../domain/types';

type PrismaCsvImportRecord = {
  id: string;
  userId: string;
  deckId: string;
  status: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  previewRows: unknown;
  errors: unknown;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
  expiresAt: Date;
};

export function toCsvImport(record: PrismaCsvImportRecord): CsvImport {
  return {
    id: record.id,
    userId: record.userId,
    deckId: record.deckId,
    status: record.status as CsvImportStatus,
    totalRows: record.totalRows,
    validRows: record.validRows,
    invalidRows: record.invalidRows,
    previewRows: parsePreviewRows(record.previewRows),
    errors: parseRowErrors(record.errors),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    confirmedAt: record.confirmedAt,
    expiresAt: record.expiresAt,
  };
}

function parsePreviewRows(value: unknown): CsvImportPreviewRow[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isPreviewRow(item)) {
      return [];
    }

    return [item];
  });
}

function parseRowErrors(value: unknown): CsvImportRowError[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRowError(item)) {
      return [];
    }

    return [item];
  });
}

function isPreviewRow(value: unknown): value is CsvImportPreviewRow {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const row = value as Record<string, unknown>;

  return (
    typeof row.rowNumber === 'number' &&
    typeof row.front === 'string' &&
    typeof row.back === 'string' &&
    (typeof row.example === 'string' || row.example === null) &&
    (typeof row.notes === 'string' || row.notes === null) &&
    typeof row.isValid === 'boolean' &&
    Array.isArray(row.errors)
  );
}

function isRowError(value: unknown): value is CsvImportRowError {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const error = value as Record<string, unknown>;

  return (
    typeof error.rowNumber === 'number' &&
    typeof error.field === 'string' &&
    typeof error.message === 'string'
  );
}

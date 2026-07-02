import { parse } from 'csv-parse/sync';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { CsvImportPreviewRow, CsvImportRowError } from '../types';

export type ParseCsvInput = {
  csvText: string;
};

export type ParseCsvResult = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  previewRows: CsvImportPreviewRow[];
  errors: CsvImportRowError[];
};

const MAX_CSV_TEXT_SIZE_BYTES = 1024 * 1024;
const MAX_ROWS = 1000;
const MAX_COLUMNS = 20;
const FRONT_MAX_LENGTH = 2000;
const BACK_MAX_LENGTH = 4000;
const OPTIONAL_TEXT_MAX_LENGTH = 4000;

const SUPPORTED_HEADERS = ['front', 'back', 'example', 'notes'] as const;
const REQUIRED_HEADERS = ['front', 'back'] as const;

type SupportedHeader = (typeof SUPPORTED_HEADERS)[number];
type CsvRecord = Partial<Record<SupportedHeader, string>> &
  Record<string, string>;

export class CsvParserService {
  parse(input: ParseCsvInput): ParseCsvResult {
    const csvText = input.csvText;

    if (Buffer.byteLength(csvText, 'utf8') > MAX_CSV_TEXT_SIZE_BYTES) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'CSV text must be at most 1 MB',
      );
    }

    const globalErrors: CsvImportRowError[] = [];
    let records: CsvRecord[] = [];

    try {
      records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
        relax_column_count: true,
      });
    } catch {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'CSV text is invalid',
      );
    }

    if (records.length === 0) {
      return {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        previewRows: [],
        errors: globalErrors,
      };
    }

    const headerNames = Object.keys(records[0] ?? {});

    if (headerNames.length > MAX_COLUMNS) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'CSV must have at most 20 columns',
      );
    }

    for (const requiredHeader of REQUIRED_HEADERS) {
      if (!headerNames.includes(requiredHeader)) {
        globalErrors.push({
          rowNumber: 1,
          field: requiredHeader,
          message: `Missing required column: ${requiredHeader}`,
        });
      }
    }

    const unsupportedHeaders = headerNames.filter(
      (header) => !SUPPORTED_HEADERS.includes(header as SupportedHeader),
    );

    for (const header of unsupportedHeaders) {
      globalErrors.push({
        rowNumber: 1,
        field: header,
        message: `Unsupported column: ${header}`,
      });
    }

    if (globalErrors.length > 0) {
      return {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        previewRows: [],
        errors: globalErrors,
      };
    }

    if (records.length > MAX_ROWS) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'CSV must have at most 1000 rows',
      );
    }

    const previewRows: CsvImportPreviewRow[] = records.map((record, index) =>
      this.toPreviewRow(record, index + 2),
    );

    const validRows = previewRows.filter((row) => row.isValid).length;

    return {
      totalRows: previewRows.length,
      validRows,
      invalidRows: previewRows.length - validRows,
      previewRows,
      errors: globalErrors,
    };
  }

  private toPreviewRow(
    record: CsvRecord,
    rowNumber: number,
  ): CsvImportPreviewRow {
    const errors: CsvImportRowError[] = [];

    const front = this.normalizeField(record.front);
    const back = this.normalizeField(record.back);
    const example = this.normalizeOptionalField(record.example);
    const notes = this.normalizeOptionalField(record.notes);

    if (!front) {
      errors.push({
        rowNumber,
        field: 'front',
        message: 'Front is required',
      });
    } else if (front.length > FRONT_MAX_LENGTH) {
      errors.push({
        rowNumber,
        field: 'front',
        message: 'Front must be at most 2000 characters',
      });
    }

    if (!back) {
      errors.push({
        rowNumber,
        field: 'back',
        message: 'Back is required',
      });
    } else if (back.length > BACK_MAX_LENGTH) {
      errors.push({
        rowNumber,
        field: 'back',
        message: 'Back must be at most 4000 characters',
      });
    }

    if (example !== null && example.length > OPTIONAL_TEXT_MAX_LENGTH) {
      errors.push({
        rowNumber,
        field: 'example',
        message: 'Example must be at most 4000 characters',
      });
    }

    if (notes !== null && notes.length > OPTIONAL_TEXT_MAX_LENGTH) {
      errors.push({
        rowNumber,
        field: 'notes',
        message: 'Notes must be at most 4000 characters',
      });
    }

    return {
      rowNumber,
      front,
      back,
      example,
      notes,
      isValid: errors.length === 0,
      errors,
    };
  }

  private normalizeField(value: string | undefined): string {
    return (value ?? '').trim();
  }

  private normalizeOptionalField(value: string | undefined): string | null {
    const trimmed = (value ?? '').trim();
    return trimmed.length > 0 ? trimmed : null;
  }
}

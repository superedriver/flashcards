export type CsvImportParsedRow = {
  rowNumber: number;
  front: string;
  back: string;
  example: string | null;
  notes: string | null;
};

export type CsvImportRowError = {
  rowNumber: number;
  field: string;
  message: string;
};

export type CsvImportPreviewRow = CsvImportParsedRow & {
  isValid: boolean;
  errors: CsvImportRowError[];
};

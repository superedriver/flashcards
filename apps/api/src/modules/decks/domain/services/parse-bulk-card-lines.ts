import {
  BULK_BACK_MAX_LENGTH,
  BULK_CARD_MAX_VALID_ROWS,
  BULK_FRONT_MAX_LENGTH,
} from './normalize-card-pair';

export type BulkCardFormatErrorCode =
  | 'INVALID_FORMAT'
  | 'FRONT_REQUIRED'
  | 'BACK_REQUIRED'
  | 'FRONT_TOO_LONG'
  | 'BACK_TOO_LONG';

export type BulkCardFormatError = {
  code: BulkCardFormatErrorCode;
  lineNumber: number;
};

export type BulkCardPair = {
  back: string;
  front: string;
  lineNumber: number;
};

export type ParseBulkCardLinesResult = {
  formatErrors: BulkCardFormatError[];
  tooManyValid: boolean;
  validPairs: BulkCardPair[];
};

function splitPhysicalLines(text: string): string[] {
  return text.split(/\r\n|\n|\r/);
}

function parseNonEmptyLine(
  line: string,
  lineNumber: number,
): { errors: BulkCardFormatError[] } | { pair: BulkCardPair } {
  const commaCount = (line.match(/,/g) ?? []).length;

  if (commaCount !== 1) {
    return {
      errors: [
        {
          code: 'INVALID_FORMAT',
          lineNumber,
        },
      ],
    };
  }

  const separatorIndex = line.indexOf(',');
  const front = line.slice(0, separatorIndex).trim();
  const back = line.slice(separatorIndex + 1).trim();
  const errors: BulkCardFormatError[] = [];

  if (!front) {
    errors.push({ code: 'FRONT_REQUIRED', lineNumber });
  } else if (front.length > BULK_FRONT_MAX_LENGTH) {
    errors.push({ code: 'FRONT_TOO_LONG', lineNumber });
  }

  if (!back) {
    errors.push({ code: 'BACK_REQUIRED', lineNumber });
  } else if (back.length > BULK_BACK_MAX_LENGTH) {
    errors.push({ code: 'BACK_TOO_LONG', lineNumber });
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    pair: {
      back,
      front,
      lineNumber,
    },
  };
}

export function parseBulkCardLines(text: string): ParseBulkCardLinesResult {
  const lines = splitPhysicalLines(text);
  const formatErrors: BulkCardFormatError[] = [];
  const validPairs: BulkCardPair[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index] ?? '';

    if (line.trim() === '') {
      continue;
    }

    const parsed = parseNonEmptyLine(line, lineNumber);

    if ('errors' in parsed) {
      formatErrors.push(...parsed.errors);
      continue;
    }

    validPairs.push(parsed.pair);
  }

  return {
    formatErrors,
    tooManyValid: validPairs.length > BULK_CARD_MAX_VALID_ROWS,
    validPairs,
  };
}

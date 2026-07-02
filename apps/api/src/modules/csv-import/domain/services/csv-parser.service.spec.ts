import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import { CsvParserService } from './csv-parser.service';

describe('CsvParserService', () => {
  const parser = new CsvParserService();

  function expectValidationError(action: () => unknown): void {
    try {
      action();
      fail('Expected validation error');
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
    }
  }

  const validCsv = [
    'front,back,example,notes',
    '  hola  ,hello,Hello world,Common greeting',
    '"adiós, friend",goodbye,,',
    'gracias,thanks,,',
  ].join('\n');

  it('parses valid CSV with required front/back columns', () => {
    const result = parser.parse({ csvText: validCsv });

    expect(result.totalRows).toBe(3);
    expect(result.validRows).toBe(3);
    expect(result.invalidRows).toBe(0);
    expect(result.previewRows[0]).toMatchObject({
      rowNumber: 2,
      front: 'hola',
      back: 'hello',
      example: 'Hello world',
      notes: 'Common greeting',
      isValid: true,
    });
  });

  it('trims text fields', () => {
    const result = parser.parse({
      csvText: 'front,back\n  spaced  ,  value  ',
    });

    expect(result.previewRows[0]).toMatchObject({
      front: 'spaced',
      back: 'value',
    });
  });

  it('supports optional example and notes columns', () => {
    const result = parser.parse({
      csvText: 'front,back,example,notes\nhello,world,Ex,Note',
    });

    expect(result.previewRows[0]).toMatchObject({
      example: 'Ex',
      notes: 'Note',
    });
  });

  it('ignores empty trailing lines', () => {
    const result = parser.parse({
      csvText: 'front,back\nhello,world\n\n\n',
    });

    expect(result.totalRows).toBe(1);
  });

  it('handles quoted CSV values', () => {
    const result = parser.parse({
      csvText: 'front,back\n"hello, there",world',
    });

    expect(result.previewRows[0]).toMatchObject({
      front: 'hello, there',
      back: 'world',
      isValid: true,
    });
  });

  it('returns empty result for header-only or empty data rows', () => {
    const headerOnly = parser.parse({ csvText: 'front,back\n' });
    const empty = parser.parse({ csvText: '' });

    expect(headerOnly).toEqual({
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      previewRows: [],
      errors: [],
    });
    expect(empty).toEqual(headerOnly);
  });

  it('reports missing required header columns (front/back)', () => {
    const result = parser.parse({ csvText: 'front\nhello' });

    expect(result.previewRows).toEqual([]);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowNumber: 1,
          field: 'back',
          message: 'Missing required column: back',
        }),
      ]),
    );
  });

  it('reports unsupported header columns', () => {
    const result = parser.parse({
      csvText: 'front,back,extra\nhello,world,x',
    });

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'extra',
          message: 'Unsupported column: extra',
        }),
      ]),
    );
  });

  it('marks rows invalid when front is missing or empty', () => {
    const result = parser.parse({ csvText: 'front,back\n,world' });

    expect(result.previewRows[0]!.isValid).toBe(false);
    expect(result.previewRows[0]!.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'front',
          message: 'Front is required',
        }),
      ]),
    );
    expect(result.validRows).toBe(0);
    expect(result.invalidRows).toBe(1);
  });

  it('marks rows invalid when back is missing or empty', () => {
    const result = parser.parse({ csvText: 'front,back\nhello,' });

    expect(result.previewRows[0]!.isValid).toBe(false);
    expect(result.previewRows[0]!.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'back', message: 'Back is required' }),
      ]),
    );
  });

  it('validates front max length 2000', () => {
    const result = parser.parse({
      csvText: `front,back\n${'a'.repeat(2001)},ok`,
    });

    expect(result.previewRows[0]!.isValid).toBe(false);
    expect(result.previewRows[0]!.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'front' })]),
    );
  });

  it('validates back max length 4000', () => {
    const result = parser.parse({
      csvText: `front,back\nok,${'b'.repeat(4001)}`,
    });

    expect(result.previewRows[0]!.isValid).toBe(false);
  });

  it('validates example/notes max length 4000', () => {
    const result = parser.parse({
      csvText: `front,back,example,notes\nok,ok,${'e'.repeat(4001)},short`,
    });

    expect(result.previewRows[0]!.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'example' })]),
    );
  });

  it('throws VALIDATION_ERROR when csvText exceeds 1 MB', () => {
    const oversized = 'front,back\n' + 'x'.repeat(1024 * 1024);

    expectValidationError(() => parser.parse({ csvText: oversized }));
  });

  it('throws VALIDATION_ERROR when row count exceeds 1000', () => {
    const rows = Array.from(
      { length: 1001 },
      (_, index) => `w${index},b${index}`,
    );
    const csvText = ['front,back', ...rows].join('\n');

    expectValidationError(() => parser.parse({ csvText }));
  });

  it('throws VALIDATION_ERROR when column count exceeds 20', () => {
    const headers = Array.from(
      { length: 21 },
      (_, index) => `col${index}`,
    ).join(',');

    expectValidationError(() =>
      parser.parse({ csvText: `${headers}\n${'v,'.repeat(20)}v` }),
    );
  });

  it('throws VALIDATION_ERROR for invalid CSV syntax', () => {
    expectValidationError(() =>
      parser.parse({ csvText: 'front,back\n"unclosed quote,value' }),
    );
  });

  it('returns validRows and invalidRows counts correctly', () => {
    const result = parser.parse({
      csvText: 'front,back\nvalid,ok\n,bad\nalso,good',
    });

    expect(result.totalRows).toBe(3);
    expect(result.validRows).toBe(2);
    expect(result.invalidRows).toBe(1);
  });
});

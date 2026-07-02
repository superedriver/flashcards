import { toCsvImport } from './csv-import.mapper';

const previewRows = [
  {
    rowNumber: 2,
    front: 'hola',
    back: 'hello',
    example: null,
    notes: null,
    isValid: true,
    errors: [],
  },
];

const errors = [
  {
    rowNumber: 1,
    field: 'back',
    message: 'Missing required column: back',
  },
];

const prismaRecord = {
  id: 'import-1',
  userId: 'owner-1',
  deckId: 'deck-1',
  status: 'PENDING',
  totalRows: 1,
  validRows: 1,
  invalidRows: 0,
  previewRows,
  errors,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  confirmedAt: null,
  expiresAt: new Date('2026-06-02T00:00:00.000Z'),
};

describe('csv-import.mapper', () => {
  it('toCsvImport maps all fields from Prisma record', () => {
    expect(toCsvImport(prismaRecord)).toEqual({
      id: 'import-1',
      userId: 'owner-1',
      deckId: 'deck-1',
      status: 'PENDING',
      totalRows: 1,
      validRows: 1,
      invalidRows: 0,
      previewRows,
      errors,
      createdAt: prismaRecord.createdAt,
      updatedAt: prismaRecord.updatedAt,
      confirmedAt: null,
      expiresAt: prismaRecord.expiresAt,
    });
  });

  it('toCsvImport casts status to domain enum', () => {
    const mapped = toCsvImport({ ...prismaRecord, status: 'CONFIRMED' });

    expect(mapped.status).toBe('CONFIRMED');
  });

  it('toCsvImport maps previewRows JSON safely', () => {
    const mapped = toCsvImport({
      ...prismaRecord,
      previewRows: [{ invalid: true }, ...previewRows],
    });

    expect(mapped.previewRows).toEqual(previewRows);
  });

  it('toCsvImport maps errors JSON safely (null/empty to [])', () => {
    expect(toCsvImport({ ...prismaRecord, errors: null }).errors).toEqual([]);
    expect(toCsvImport({ ...prismaRecord, errors: [] }).errors).toEqual([]);
    expect(
      toCsvImport({ ...prismaRecord, errors: [{ bad: true }] }).errors,
    ).toEqual([]);
  });
});

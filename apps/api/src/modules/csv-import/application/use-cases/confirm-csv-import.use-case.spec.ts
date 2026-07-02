import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { CreateManyCardsInput } from '../../../decks/application/ports/card-repository.port';
import { Card, Deck } from '../../../decks/domain/types';
import { CsvImport, CsvImportPreviewRow } from '../../domain/types';
import { ConfirmCsvImportUseCase } from './confirm-csv-import.use-case';

const owner: AuthUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const deck: Deck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: null,
  visibility: 'PRIVATE',
  moderationStatus: 'NONE',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

function validRow(
  overrides: Partial<CsvImportPreviewRow> = {},
): CsvImportPreviewRow {
  return {
    rowNumber: 2,
    front: 'hola',
    back: 'hello',
    example: null,
    notes: null,
    isValid: true,
    errors: [],
    ...overrides,
  };
}

function invalidRow(
  overrides: Partial<CsvImportPreviewRow> = {},
): CsvImportPreviewRow {
  return {
    rowNumber: 3,
    front: '',
    back: 'bad',
    example: null,
    notes: null,
    isValid: false,
    errors: [{ rowNumber: 3, field: 'front', message: 'Front is required' }],
    ...overrides,
  };
}

function createCsvImport(overrides: Partial<CsvImport> = {}): CsvImport {
  return {
    id: 'import-1',
    userId: 'owner-1',
    deckId: 'deck-1',
    status: 'PENDING',
    totalRows: 2,
    validRows: 1,
    invalidRows: 1,
    previewRows: [validRow(), invalidRow()],
    errors: [],
    createdAt: new Date('2026-06-01T00:00:00.000Z'),
    updatedAt: new Date('2026-06-01T00:00:00.000Z'),
    confirmedAt: null,
    expiresAt: new Date('2026-06-02T00:00:00.000Z'),
    ...overrides,
  };
}

function createUseCase(options?: {
  user?: SafeUser | null;
  csvImport?: CsvImport | null;
  deck?: Deck | null;
  existingCardCount?: number;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const findImportById = jest
    .fn()
    .mockResolvedValue(
      options?.csvImport === undefined ? createCsvImport() : options.csvImport,
    );
  const markExpired = jest
    .fn()
    .mockImplementation((importId: string) =>
      Promise.resolve(createCsvImport({ id: importId, status: 'EXPIRED' })),
    );
  const markConfirmed = jest.fn().mockImplementation((importId: string) =>
    Promise.resolve(
      createCsvImport({
        id: importId,
        status: 'CONFIRMED',
        confirmedAt: new Date('2026-06-01T12:00:00.000Z'),
      }),
    ),
  );
  const countByDeckId = jest
    .fn()
    .mockResolvedValue(options?.existingCardCount ?? 3);
  const createMany = jest
    .fn<Promise<Card[]>, [CreateManyCardsInput]>()
    .mockResolvedValue([]);

  const useCase = new ConfirmCsvImportUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findById: findDeckById,
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      create: jest.fn(),
    },
    {
      findById: jest.fn(),
      findByDeckId: jest.fn(),
      countByDeckId,
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      softDeleteByDeckId: jest.fn(),
      createMany,
    },
    {
      create: jest.fn(),
      findById: findImportById,
      markConfirmed,
      markExpired,
    },
  );

  return { useCase, createMany, markConfirmed, markExpired, countByDeckId };
}

describe('ConfirmCsvImportUseCase', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-01T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'import-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws NOT_FOUND when import is missing', async () => {
    const { useCase } = createUseCase({ csvImport: null });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.NOT_FOUND });
  });

  it('throws FORBIDDEN when import belongs to another user', async () => {
    const { useCase } = createUseCase({
      csvImport: createCsvImport({ userId: 'other-user' }),
    });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'import-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('throws VALIDATION_ERROR when import is not PENDING', async () => {
    const { useCase, createMany } = createUseCase({
      csvImport: createCsvImport({ status: 'CONFIRMED' }),
    });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'import-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    expect(createMany).not.toHaveBeenCalled();
  });

  it('throws VALIDATION_ERROR and calls markExpired when import is expired', async () => {
    const { useCase, markExpired, createMany } = createUseCase({
      csvImport: createCsvImport({
        expiresAt: new Date('2026-06-01T11:00:00.000Z'),
      }),
    });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'import-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    expect(markExpired).toHaveBeenCalledWith('import-1');
    expect(createMany).not.toHaveBeenCalled();
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'import-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for non-owner deck', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'import-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('throws VALIDATION_ERROR when no valid rows to import', async () => {
    const { useCase, createMany } = createUseCase({
      csvImport: createCsvImport({
        previewRows: [invalidRow()],
        validRows: 0,
        invalidRows: 1,
        totalRows: 1,
      }),
    });

    await expect(
      useCase.execute({ currentUser: owner, importId: 'import-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });

    expect(createMany).not.toHaveBeenCalled();
  });

  it('creates cards only from valid preview rows via createMany', async () => {
    const { useCase, createMany } = createUseCase();

    await useCase.execute({ currentUser: owner, importId: 'import-1' });

    expect(createMany).toHaveBeenCalledWith({
      cards: [
        expect.objectContaining({
          deckId: 'deck-1',
          front: 'hola',
          back: 'hello',
        }),
      ],
    });
  });

  it('skips invalid preview rows', async () => {
    const { useCase, createMany } = createUseCase();

    await useCase.execute({ currentUser: owner, importId: 'import-1' });

    const createManyInput = createMany.mock.calls[0]![0];
    expect(createManyInput.cards).toHaveLength(1);
  });

  it('appends card positions after existing deck card count', async () => {
    const { useCase, createMany, countByDeckId } = createUseCase({
      existingCardCount: 5,
      csvImport: createCsvImport({
        previewRows: [
          validRow({ rowNumber: 2, front: 'one', back: '1' }),
          validRow({ rowNumber: 3, front: 'two', back: '2' }),
        ],
        validRows: 2,
        invalidRows: 0,
        totalRows: 2,
      }),
    });

    await useCase.execute({ currentUser: owner, importId: 'import-1' });

    expect(countByDeckId).toHaveBeenCalledWith('deck-1');
    expect(createMany).toHaveBeenCalledWith({
      cards: [
        expect.objectContaining({ front: 'one', position: 5 }),
        expect.objectContaining({ front: 'two', position: 6 }),
      ],
    });
  });

  it('preserves CSV row order in created card positions', async () => {
    const { useCase, createMany } = createUseCase({
      csvImport: createCsvImport({
        previewRows: [
          validRow({ rowNumber: 2, front: 'first', back: '1' }),
          invalidRow(),
          validRow({ rowNumber: 4, front: 'second', back: '2' }),
        ],
      }),
    });

    await useCase.execute({ currentUser: owner, importId: 'import-1' });

    const createManyInput = createMany.mock.calls[0]![0];
    expect(createManyInput.cards.map((card) => card.front)).toEqual([
      'first',
      'second',
    ]);
  });

  it('calls markConfirmed and returns createdCardsCount', async () => {
    const { useCase, markConfirmed } = createUseCase({
      csvImport: createCsvImport({
        previewRows: [
          validRow({ rowNumber: 2 }),
          validRow({ rowNumber: 3, front: 'adios', back: 'bye' }),
        ],
        validRows: 2,
        invalidRows: 0,
        totalRows: 2,
      }),
    });

    const result = await useCase.execute({
      currentUser: owner,
      importId: 'import-1',
    });

    expect(markConfirmed).toHaveBeenCalledWith(
      'import-1',
      new Date('2026-06-01T12:00:00.000Z'),
    );
    expect(result.createdCardsCount).toBe(2);
    expect(result.import.status).toBe('CONFIRMED');
  });
});

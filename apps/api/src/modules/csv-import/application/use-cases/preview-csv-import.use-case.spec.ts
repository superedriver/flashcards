import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../../decks/domain/types';
import { CsvImport } from '../../domain/types';
import { CreateCsvImportInput } from '../ports/csv-import-repository.port';
import { PreviewCsvImportUseCase } from './preview-csv-import.use-case';

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

const csvImport: CsvImport = {
  id: 'import-1',
  userId: 'owner-1',
  deckId: 'deck-1',
  status: 'PENDING',
  totalRows: 1,
  validRows: 1,
  invalidRows: 0,
  previewRows: [
    {
      rowNumber: 2,
      front: 'hola',
      back: 'hello',
      example: null,
      notes: null,
      isValid: true,
      errors: [],
    },
  ],
  errors: [],
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  confirmedAt: null,
  expiresAt: new Date('2026-06-02T00:00:00.000Z'),
};

const csvText = 'front,back\nhola,hello';

function createUseCase(options?: {
  user?: SafeUser | null;
  deck?: Deck | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const create = jest
    .fn<Promise<CsvImport>, [CreateCsvImportInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...csvImport,
        totalRows: input.totalRows,
        validRows: input.validRows,
        invalidRows: input.invalidRows,
        previewRows: input.previewRows,
        errors: input.errors,
        expiresAt: input.expiresAt,
      }),
    );

  const useCase = new PreviewCsvImportUseCase(
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
      create,
      findById: jest.fn(),
      markConfirmed: jest.fn(),
      markExpired: jest.fn(),
    },
  );

  return { useCase, create };
}

describe('PreviewCsvImportUseCase', () => {
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
      useCase.execute({ currentUser: owner, deckId: 'deck-1', csvText }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'missing', csvText }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for non-owner (canManageDeck)', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({ currentUser: owner, deckId: 'deck-1', csvText }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('parses CSV and stores pending CsvImport via repository', async () => {
    const { useCase, create } = createUseCase();

    const result = await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      csvText,
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'owner-1',
        deckId: 'deck-1',
        totalRows: 1,
        validRows: 1,
        invalidRows: 0,
      }),
    );
    expect(result.id).toBe('import-1');
  });

  it('does not create cards during preview', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({ currentUser: owner, deckId: 'deck-1', csvText });

    expect(create).toHaveBeenCalledTimes(1);
  });

  it('passes previewRows and errors to repository create', async () => {
    const { useCase, create } = createUseCase();
    const mixedCsv = 'front,back\nhola,hello\n,bad';

    await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      csvText: mixedCsv,
    });

    const createInput = create.mock.calls[0]![0];

    expect(createInput.previewRows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ front: 'hola', isValid: true }),
        expect.objectContaining({ isValid: false }),
      ]),
    );
    expect(createInput.errors).toEqual([]);
  });

  it('sets expiresAt approximately 24 hours from now', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({ currentUser: owner, deckId: 'deck-1', csvText });

    const createInput = create.mock.calls[0]![0];
    const expectedExpiry = new Date('2026-06-02T12:00:00.000Z');

    expect(createInput.expiresAt.getTime()).toBe(expectedExpiry.getTime());
  });

  it('returns created CsvImport from repository', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUser: owner,
      deckId: 'deck-1',
      csvText,
    });

    expect(result).toEqual(
      expect.objectContaining({
        id: 'import-1',
        status: 'PENDING',
        validRows: 1,
      }),
    );
  });
});

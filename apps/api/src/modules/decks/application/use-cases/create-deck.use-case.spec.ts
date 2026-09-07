import { ErrorCodes } from '../../../../common/errors';
import { SafeUser } from '../../../auth/domain/types';
import { UserSettings } from '../../../account/domain/types';
import { Deck } from '../../domain/types';
import { CreateDeckInput } from '../ports/deck-repository.port';
import { CreateDeckUseCase } from './create-deck.use-case';

const safeUser: SafeUser = {
  id: 'owner-1',
  email: 'owner@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const settings: UserSettings = {
  id: 'settings-1',
  userId: 'owner-1',
  interfaceLocale: 'en',
  themePreference: 'SYSTEM',
  notificationsEnabled: false,
  reminderTime: '18:00',
  timezone: 'UTC',
  audioAutoplayEnabled: false,
  lessonSize: 20,
  nativeLanguage: 'uk',
  activeTargetLanguage: null,
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
  targetLanguage: 'es',
  sourceLanguage: 'uk',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

function createUseCase(options?: {
  user?: SafeUser | null;
  settings?: UserSettings | null;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const create = jest
    .fn<Promise<Deck>, [CreateDeckInput]>()
    .mockImplementation((input) =>
      Promise.resolve({
        ...deck,
        ownerId: input.ownerId,
        title: input.title,
        description: input.description ?? null,
        targetLanguage: input.targetLanguage,
        sourceLanguage: input.sourceLanguage,
      }),
    );
  const findByUserId = jest
    .fn()
    .mockResolvedValue(
      options?.settings === undefined ? settings : options.settings,
    );
  const findByCode = jest.fn().mockImplementation((code: string) =>
    Promise.resolve(
      ['es', 'uk', 'en'].includes(code)
        ? {
            code,
            englishName: code,
            nativeName: code,
            flag: '🏳️',
            popularSortOrder: null,
          }
        : null,
    ),
  );

  const useCase = new CreateDeckUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
      deleteById: jest.fn(),
    },
    {
      create,
      findById: jest.fn(),
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      countByOwnerAndTargetLanguage: jest.fn(),
    },
    {
      findByUserId,
      createForUser: jest.fn(),
      update: jest.fn(),
      findWithNotificationsEnabled: jest.fn(),
    },
    {
      findAll: jest.fn(),
      findByCode,
    },
  );

  return { useCase, create, findByCode, findByUserId };
}

describe('CreateDeckUseCase', () => {
  it('rejects missing user with UNAUTHORIZED', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUserId: 'missing',
        title: 'Deck',
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('rejects blocked user with USER_BLOCKED', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUserId: 'owner-1',
        title: 'Deck',
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('trims title and creates deck for owner', async () => {
    const { useCase, create } = createUseCase();

    const result = await useCase.execute({
      currentUserId: 'owner-1',
      title: '  Spanish Basics  ',
      targetLanguage: 'es',
    });

    expect(create).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      title: 'Spanish Basics',
      description: undefined,
      targetLanguage: 'es',
      sourceLanguage: 'uk',
    });
    expect(result.deck.title).toBe('Spanish Basics');
  });

  it('rejects empty title after trim with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUserId: 'owner-1',
        title: '   ',
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('rejects title longer than 120 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUserId: 'owner-1',
        title: 'a'.repeat(121),
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('trims description and passes null when empty', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({
      currentUserId: 'owner-1',
      title: 'Deck',
      description: '   ',
      targetLanguage: 'es',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ description: null }),
    );
  });

  it('rejects description longer than 1000 with VALIDATION_ERROR', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUserId: 'owner-1',
        title: 'Deck',
        description: 'a'.repeat(1001),
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('creates deck with ownerId = currentUserId', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({
      currentUserId: 'owner-1',
      title: 'Deck',
      targetLanguage: 'es',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: 'owner-1' }),
    );
  });

  it('defaults sourceLanguage from user settings nativeLanguage', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({
      currentUserId: 'owner-1',
      title: 'Deck',
      targetLanguage: 'es',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ sourceLanguage: 'uk' }),
    );
  });

  it('uses explicit sourceLanguage when provided', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({
      currentUserId: 'owner-1',
      title: 'Deck',
      targetLanguage: 'es',
      sourceLanguage: 'en',
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ sourceLanguage: 'en' }),
    );
  });

  it('rejects unknown targetLanguage with LANGUAGE_NOT_FOUND', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUserId: 'owner-1',
        title: 'Deck',
        targetLanguage: 'xx',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.LANGUAGE_NOT_FOUND });
  });

  it('rejects missing settings when sourceLanguage omitted', async () => {
    const { useCase } = createUseCase({ settings: null });

    await expect(
      useCase.execute({
        currentUserId: 'owner-1',
        title: 'Deck',
        targetLanguage: 'es',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('returns SOURCE_TARGET_SAME warning when languages match', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUserId: 'owner-1',
      title: 'Deck',
      targetLanguage: 'uk',
      sourceLanguage: 'uk',
    });

    expect(result.warnings).toEqual([
      expect.objectContaining({ code: 'SOURCE_TARGET_SAME' }),
    ]);
  });

  it('returns no warnings when languages differ', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUserId: 'owner-1',
      title: 'Deck',
      targetLanguage: 'es',
    });

    expect(result.warnings).toEqual([]);
  });
});

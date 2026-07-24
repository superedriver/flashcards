import { ErrorCodes } from '../../../../common/errors';
import { UserSettings } from '../../../account/domain/types';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../../decks/domain/types';
import { HomeLearningProgressUseCase } from './home-learning-progress.use-case';

const authUser: AuthUser = {
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
  nativeLanguage: 'en',
  activeTargetLanguage: 'es',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

function createDeck(overrides: Partial<Deck> = {}): Deck {
  return {
    id: 'deck-1',
    ownerId: 'owner-1',
    title: 'Spanish',
    description: null,
    visibility: 'PRIVATE',
    moderationStatus: 'NONE',
    isOfficial: false,
    sourceDeckId: null,
    targetLanguage: 'es',
    sourceLanguage: 'en',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

function createUseCase(options?: {
  user?: SafeUser | null;
  settings?: UserSettings | null;
  decks?: Deck[];
  totalCardsByDeckId?: Record<string, number>;
  groups?: {
    toLearnCount: number;
    practicedCount: number;
    learnedCount: number;
  };
  dueCount?: number;
}) {
  const decks = options?.decks ?? [createDeck()];
  const totalCardsByDeckId = options?.totalCardsByDeckId ?? { 'deck-1': 12 };
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findSettings = jest
    .fn()
    .mockResolvedValue(
      options?.settings === undefined ? settings : options.settings,
    );
  const findByOwner = jest.fn().mockResolvedValue(decks);
  const countByDeckId = jest.fn((deckId: string) =>
    Promise.resolve(totalCardsByDeckId[deckId] ?? 0),
  );
  const countLearningGroupsForOwnDecksWithTargetLanguage = jest
    .fn()
    .mockResolvedValue(
      options?.groups ?? {
        toLearnCount: 4,
        practicedCount: 5,
        learnedCount: 3,
      },
    );
  const countDueForOwnDecksWithTargetLanguage = jest
    .fn<
      Promise<number>,
      [{ userId: string; targetLanguage: string; now: Date }]
    >()
    .mockResolvedValue(options?.dueCount ?? 2);

  const useCase = new HomeLearningProgressUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      findByUserId: findSettings,
      createForUser: jest.fn().mockResolvedValue(settings),
      update: jest.fn(),
      findWithNotificationsEnabled: jest.fn(),
    },
    {
      findById: jest.fn(),
      findByOwner,
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
      countByOwnerAndTargetLanguage: jest.fn(),
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
      createMany: jest.fn(),
    },
    {
      findByUserAndCard: jest.fn(),
      findDueCardIdsForDeck: jest.fn(),
      findDueCardIdsForOwnDecksWithTargetLanguage: jest.fn(),
      countReviewedForDeck: jest.fn(),
      countDueForDeck: jest.fn(),
      countDueForUser: jest.fn(),
      countDueForOwnDecksWithTargetLanguage,
      countLearningGroupsForDeck: jest.fn(),
      countLearningGroupsForOwnDecksWithTargetLanguage,
      findNextDueAtForDeck: jest.fn(),
      createInitialIfMissing: jest.fn(),
      createInitialMany: jest.fn(),
      upsert: jest.fn(),
    },
  );

  return {
    useCase,
    countLearningGroupsForOwnDecksWithTargetLanguage,
    countDueForOwnDecksWithTargetLanguage,
  };
}

describe('HomeLearningProgressUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('returns zeros when active target language is missing', async () => {
    const { useCase } = createUseCase({
      settings: { ...settings, activeTargetLanguage: null },
    });

    await expect(useCase.execute({ currentUser: authUser })).resolves.toEqual({
      activeTargetLanguage: null,
      toLearnCount: 0,
      practicedCount: 0,
      learnedCount: 0,
      dueCount: 0,
      totalCardCount: 0,
    });
  });

  it('returns learning-group progress for active target language', async () => {
    const {
      useCase,
      countLearningGroupsForOwnDecksWithTargetLanguage,
      countDueForOwnDecksWithTargetLanguage,
    } = createUseCase({
      decks: [
        createDeck({ id: 'deck-1', targetLanguage: 'es' }),
        createDeck({ id: 'deck-2', targetLanguage: 'fr' }),
        createDeck({ id: 'deck-3', targetLanguage: 'es' }),
      ],
      totalCardsByDeckId: {
        'deck-1': 10,
        'deck-2': 99,
        'deck-3': 2,
      },
      groups: {
        toLearnCount: 4,
        practicedCount: 5,
        learnedCount: 3,
      },
      dueCount: 2,
    });

    const result = await useCase.execute({ currentUser: authUser });

    expect(result).toEqual({
      activeTargetLanguage: 'es',
      toLearnCount: 4,
      practicedCount: 5,
      learnedCount: 3,
      dueCount: 2,
      totalCardCount: 12,
    });

    expect(
      countLearningGroupsForOwnDecksWithTargetLanguage,
    ).toHaveBeenCalledWith({
      userId: 'owner-1',
      targetLanguage: 'es',
    });

    const dueInput = countDueForOwnDecksWithTargetLanguage.mock.calls[0]![0];
    expect(dueInput.userId).toBe('owner-1');
    expect(dueInput.targetLanguage).toBe('es');
    expect(dueInput.now).toBeInstanceOf(Date);
  });
});

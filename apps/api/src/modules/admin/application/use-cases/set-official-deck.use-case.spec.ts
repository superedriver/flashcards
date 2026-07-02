import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { ModerationDeck } from '../../domain/types';
import { SetOfficialDeckUseCase } from './set-official-deck.use-case';

const adminUser: AuthUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
};

const moderatorUser: AuthUser = {
  id: 'mod-1',
  email: 'mod@example.com',
  role: 'MODERATOR',
};

const regularUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
};

const safeAdmin: SafeUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const officialDeck: ModerationDeck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Official Deck',
  description: null,
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
  isOfficial: true,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  deletedAt: null,
  ownerEmail: 'owner@example.com',
  cardCount: 10,
};

function createUseCase(options?: {
  user?: SafeUser | null;
  setOfficial?: jest.Mock;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeAdmin : options.user);
  const setOfficial =
    options?.setOfficial ?? jest.fn().mockResolvedValue(officialDeck);

  const useCase = new SetOfficialDeckUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      moderationQueue: jest.fn(),
      setModerationStatus: jest.fn(),
      setOfficial,
    },
  );

  return { useCase, setOfficial };
}

describe('SetOfficialDeckUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUser: adminUser,
        deckId: 'deck-1',
        isOfficial: true,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: adminUser,
        deckId: 'deck-1',
        isOfficial: true,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws FORBIDDEN for MODERATOR', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, id: 'mod-1', role: 'MODERATOR' },
    });

    await expect(
      useCase.execute({
        currentUser: moderatorUser,
        deckId: 'deck-1',
        isOfficial: true,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('throws FORBIDDEN for USER', async () => {
    const { useCase } = createUseCase({
      user: { ...safeAdmin, id: 'user-1', role: 'USER' },
    });

    await expect(
      useCase.execute({
        currentUser: regularUser,
        deckId: 'deck-1',
        isOfficial: true,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('sets isOfficial true and false for ADMIN', async () => {
    const { useCase, setOfficial } = createUseCase();

    await useCase.execute({
      currentUser: adminUser,
      deckId: 'deck-1',
      isOfficial: true,
    });
    expect(setOfficial).toHaveBeenLastCalledWith({
      deckId: 'deck-1',
      isOfficial: true,
    });

    await useCase.execute({
      currentUser: adminUser,
      deckId: 'deck-1',
      isOfficial: false,
    });
    expect(setOfficial).toHaveBeenLastCalledWith({
      deckId: 'deck-1',
      isOfficial: false,
    });
  });

  it('throws DECK_NOT_FOUND when repository update fails', async () => {
    const setOfficial = jest.fn().mockRejectedValue(new Error('not found'));
    const { useCase } = createUseCase({ setOfficial });

    await expect(
      useCase.execute({
        currentUser: adminUser,
        deckId: 'missing-1',
        isOfficial: true,
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('returns ModerationDeck from repository', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUser: adminUser,
      deckId: 'deck-1',
      isOfficial: true,
    });

    expect(result).toEqual(officialDeck);
  });
});

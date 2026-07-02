import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { ModerationDeck } from '../../domain/types';
import { ModerateDeckUseCase } from './moderate-deck.use-case';

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

const safeUser: SafeUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  role: 'ADMIN',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const moderationDeck: ModerationDeck = {
  id: 'deck-1',
  ownerId: 'owner-1',
  title: 'Spanish Basics',
  description: null,
  visibility: 'PUBLIC',
  moderationStatus: 'APPROVED',
  isOfficial: false,
  sourceDeckId: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
  ownerEmail: 'owner@example.com',
  cardCount: 5,
};

function createUseCase(options?: {
  user?: SafeUser | null;
  setModerationStatus?: jest.Mock;
}) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const setModerationStatus =
    options?.setModerationStatus ?? jest.fn().mockResolvedValue(moderationDeck);

  const useCase = new ModerateDeckUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      moderationQueue: jest.fn(),
      setModerationStatus,
      setOfficial: jest.fn(),
    },
  );

  return { useCase, setModerationStatus };
}

describe('ModerateDeckUseCase', () => {
  it('throws UNAUTHORIZED when user is missing', async () => {
    const { useCase } = createUseCase({ user: null });

    await expect(
      useCase.execute({
        currentUser: adminUser,
        deckId: 'deck-1',
        action: 'APPROVE',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.UNAUTHORIZED });
  });

  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: adminUser,
        deckId: 'deck-1',
        action: 'APPROVE',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws FORBIDDEN for USER', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, id: 'user-1', role: 'USER' },
    });

    await expect(
      useCase.execute({
        currentUser: regularUser,
        deckId: 'deck-1',
        action: 'APPROVE',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.FORBIDDEN });
  });

  it('allows ADMIN to approve/reject/hide', async () => {
    const { useCase, setModerationStatus } = createUseCase();

    await useCase.execute({
      currentUser: adminUser,
      deckId: 'deck-1',
      action: 'APPROVE',
    });
    expect(setModerationStatus).toHaveBeenLastCalledWith({
      deckId: 'deck-1',
      status: 'APPROVED',
    });

    await useCase.execute({
      currentUser: adminUser,
      deckId: 'deck-1',
      action: 'REJECT',
    });
    expect(setModerationStatus).toHaveBeenLastCalledWith({
      deckId: 'deck-1',
      status: 'REJECTED',
    });

    await useCase.execute({
      currentUser: adminUser,
      deckId: 'deck-1',
      action: 'HIDE',
    });
    expect(setModerationStatus).toHaveBeenLastCalledWith({
      deckId: 'deck-1',
      status: 'HIDDEN',
    });
  });

  it('allows MODERATOR to approve/reject/hide', async () => {
    const { useCase, setModerationStatus } = createUseCase({
      user: { ...safeUser, id: 'mod-1', role: 'MODERATOR' },
    });

    await useCase.execute({
      currentUser: moderatorUser,
      deckId: 'deck-1',
      action: 'APPROVE',
    });

    expect(setModerationStatus).toHaveBeenCalledWith({
      deckId: 'deck-1',
      status: 'APPROVED',
    });
  });

  it('throws DECK_NOT_FOUND when repository update fails', async () => {
    const setModerationStatus = jest
      .fn()
      .mockRejectedValue(new Error('not found'));
    const { useCase } = createUseCase({ setModerationStatus });

    await expect(
      useCase.execute({
        currentUser: adminUser,
        deckId: 'missing-1',
        action: 'APPROVE',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('returns ModerationDeck from repository', async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      currentUser: adminUser,
      deckId: 'deck-1',
      action: 'APPROVE',
    });

    expect(result).toEqual(moderationDeck);
  });
});

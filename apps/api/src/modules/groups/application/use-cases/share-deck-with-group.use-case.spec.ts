import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Deck } from '../../../decks/domain/types';
import { DeckGroupShare, Group, GroupMember } from '../../domain/types';
import { ShareDeckWithGroupUseCase } from './share-deck-with-group.use-case';

const authUser: AuthUser = {
  id: 'user-1',
  email: 'owner@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'owner@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const deck: Deck = {
  id: 'deck-1',
  ownerId: 'user-1',
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

const group: Group = {
  id: 'group-1',
  name: 'Study Group',
  description: null,
  createdById: 'user-1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const ownerMember: GroupMember = {
  id: 'member-1',
  groupId: 'group-1',
  userId: 'user-1',
  role: 'OWNER',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const memberMember: GroupMember = {
  ...ownerMember,
  id: 'member-2',
  role: 'MEMBER',
};

const share: DeckGroupShare = {
  id: 'share-1',
  deckId: 'deck-1',
  groupId: 'group-1',
  permission: 'VIEW',
  createdById: 'user-1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

function createUseCase(options?: {
  user?: SafeUser | null;
  deck?: Deck | null;
  group?: Group | null;
  myMember?: GroupMember | null;
  existingShare?: DeckGroupShare | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findDeckById = jest
    .fn()
    .mockResolvedValue(options?.deck === undefined ? deck : options.deck);
  const findGroupById = jest
    .fn()
    .mockResolvedValue(options?.group === undefined ? group : options.group);
  const findMember = jest
    .fn()
    .mockResolvedValue(
      options?.myMember === undefined ? ownerMember : options.myMember,
    );
  const findByDeckAndGroup = jest
    .fn()
    .mockResolvedValue(
      options?.existingShare === undefined ? null : options.existingShare,
    );
  const createShare = jest.fn().mockResolvedValue(share);

  const useCase = new ShareDeckWithGroupUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: findDeckById,
      findByOwner: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      publish: jest.fn(),
      unpublish: jest.fn(),
      findPublicApprovedById: jest.fn(),
      searchPublicApproved: jest.fn(),
      createCopiedDeck: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: findGroupById,
      findMember,
      findMembers: jest.fn(),
      findGroupsForUser: jest.fn(),
      addMember: jest.fn(),
    },
    {
      create: createShare,
      findByDeckAndGroup,
      findActiveGroupsForDeck: jest.fn(),
      findSharedDecksForGroup: jest.fn(),
      userHasAccessToDeck: jest.fn(),
    },
  );

  return { useCase, createShare };
}

describe('ShareDeckWithGroupUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        deckId: 'deck-1',
        groupId: 'group-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws DECK_NOT_FOUND when deck is missing', async () => {
    const { useCase } = createUseCase({ deck: null });

    await expect(
      useCase.execute({
        currentUser: authUser,
        deckId: 'missing',
        groupId: 'group-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_NOT_FOUND });
  });

  it('throws DECK_FORBIDDEN for non-owner deck', async () => {
    const { useCase } = createUseCase({
      deck: { ...deck, ownerId: 'other-user' },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        deckId: 'deck-1',
        groupId: 'group-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.DECK_FORBIDDEN });
  });

  it('throws GROUP_NOT_FOUND when group is missing', async () => {
    const { useCase } = createUseCase({ group: null });

    await expect(
      useCase.execute({
        currentUser: authUser,
        deckId: 'deck-1',
        groupId: 'missing',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_NOT_FOUND });
  });

  it('throws GROUP_FORBIDDEN for MEMBER', async () => {
    const { useCase } = createUseCase({ myMember: memberMember });

    await expect(
      useCase.execute({
        currentUser: authUser,
        deckId: 'deck-1',
        groupId: 'group-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_FORBIDDEN });
  });

  it('throws VALIDATION_ERROR when deck is already shared with group', async () => {
    const { useCase } = createUseCase({ existingShare: share });

    await expect(
      useCase.execute({
        currentUser: authUser,
        deckId: 'deck-1',
        groupId: 'group-1',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('creates deck group share for deck owner who is OWNER/ADMIN in group', async () => {
    const { useCase, createShare } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      deckId: 'deck-1',
      groupId: 'group-1',
    });

    expect(createShare).toHaveBeenCalledWith({
      deckId: 'deck-1',
      groupId: 'group-1',
      createdById: 'user-1',
    });
    expect(result).toEqual(share);
  });
});

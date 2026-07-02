import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Group, GroupMember } from '../../domain/types';
import { GroupDetailUseCase } from './group-detail.use-case';

const authUser: AuthUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'user@example.com',
  role: 'USER',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
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

const myMember: GroupMember = {
  id: 'member-1',
  groupId: 'group-1',
  userId: 'user-1',
  role: 'OWNER',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const members: GroupMember[] = [myMember];

function createUseCase(options?: {
  user?: SafeUser | null;
  group?: Group | null;
  myMember?: GroupMember | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findById = jest
    .fn()
    .mockResolvedValue(options?.group === undefined ? group : options.group);
  const findMember = jest
    .fn()
    .mockResolvedValue(
      options?.myMember === undefined ? myMember : options.myMember,
    );
  const findMembers = jest.fn().mockResolvedValue(members);

  const useCase = new GroupDetailUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create: jest.fn(),
      findById,
      findMember,
      findMembers,
      findGroupsForUser: jest.fn(),
      addMember: jest.fn(),
    },
  );

  return { useCase };
}

describe('GroupDetailUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser, groupId: 'group-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws GROUP_NOT_FOUND when group is missing', async () => {
    const { useCase } = createUseCase({ group: null });

    await expect(
      useCase.execute({ currentUser: authUser, groupId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_NOT_FOUND });
  });

  it('throws GROUP_FORBIDDEN for non-member', async () => {
    const { useCase } = createUseCase({ myMember: null });

    await expect(
      useCase.execute({ currentUser: authUser, groupId: 'group-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_FORBIDDEN });
  });

  it('returns group, myMember, and members for member', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUser: authUser, groupId: 'group-1' }),
    ).resolves.toEqual({
      group,
      myMember,
      members,
    });
  });
});

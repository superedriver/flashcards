import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { GroupWithMyRole } from '../../domain/types';
import { MyGroupsUseCase } from './my-groups.use-case';

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

const groups: GroupWithMyRole[] = [
  {
    id: 'group-1',
    name: 'Study Group',
    description: null,
    createdById: 'user-1',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    deletedAt: null,
    myRole: 'OWNER',
  },
];

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findGroupsForUser = jest.fn().mockResolvedValue(groups);

  const useCase = new MyGroupsUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: jest.fn(),
      findMember: jest.fn(),
      findMembers: jest.fn(),
      findGroupsForUser,
      addMember: jest.fn(),
    },
  );

  return { useCase, findGroupsForUser };
}

describe('MyGroupsUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('returns groups from repository for current user', async () => {
    const { useCase, findGroupsForUser } = createUseCase();

    await expect(useCase.execute({ currentUser: authUser })).resolves.toEqual(
      groups,
    );
    expect(findGroupsForUser).toHaveBeenCalledWith('user-1');
  });
});

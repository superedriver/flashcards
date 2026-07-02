import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Group } from '../../domain/types';
import { CreateGroupUseCase } from './create-group.use-case';

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

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const create = jest.fn().mockResolvedValue(group);
  const addMember = jest.fn().mockResolvedValue({
    id: 'member-1',
    groupId: 'group-1',
    userId: 'user-1',
    role: 'OWNER' as const,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  });

  const useCase = new CreateGroupUseCase(
    {
      findById,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create,
      findById: jest.fn(),
      findMember: jest.fn(),
      findMembers: jest.fn(),
      findGroupsForUser: jest.fn(),
      addMember,
    },
  );

  return { useCase, create, addMember };
}

describe('CreateGroupUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser, name: 'Group' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws VALIDATION_ERROR when name is empty/whitespace', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUser: authUser, name: '   ' }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('throws VALIDATION_ERROR when name exceeds 120 characters', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({ currentUser: authUser, name: 'a'.repeat(121) }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('throws VALIDATION_ERROR when description exceeds 1000 characters', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: authUser,
        name: 'Group',
        description: 'a'.repeat(1001),
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('creates group and adds creator as OWNER member', async () => {
    const { useCase, create, addMember } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      name: 'Study Group',
    });

    expect(create).toHaveBeenCalledWith({
      name: 'Study Group',
      description: undefined,
      createdById: 'user-1',
    });
    expect(addMember).toHaveBeenCalledWith({
      groupId: 'group-1',
      userId: 'user-1',
      role: 'OWNER',
    });
    expect(result).toEqual(group);
  });

  it('trims name and optional description', async () => {
    const { useCase, create } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      name: '  Study Group  ',
      description: '  Spanish learners  ',
    });

    expect(create).toHaveBeenCalledWith({
      name: 'Study Group',
      description: 'Spanish learners',
      createdById: 'user-1',
    });
  });
});

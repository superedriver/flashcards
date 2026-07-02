import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Group, GroupInvitation, GroupMember } from '../../domain/types';
import { CreateGroupInvitationInput } from '../ports/group-invitation-repository.port';
import { InviteUserToGroupUseCase } from './invite-user-to-group.use-case';

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

const invitation: GroupInvitation = {
  id: 'invitation-1',
  groupId: 'group-1',
  email: 'invitee@example.com',
  invitedById: 'user-1',
  status: 'PENDING',
  expiresAt: new Date('2026-07-01T00:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  acceptedAt: null,
  declinedAt: null,
};

function createUseCase(options?: {
  user?: SafeUser | null;
  group?: Group | null;
  myMember?: GroupMember | null;
  pendingInvitation?: GroupInvitation | null;
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
      options?.myMember === undefined ? ownerMember : options.myMember,
    );
  const findPendingByGroupAndEmail = jest
    .fn()
    .mockResolvedValue(
      options?.pendingInvitation === undefined
        ? null
        : options.pendingInvitation,
    );
  const createInvitation = jest
    .fn<Promise<GroupInvitation>, [CreateGroupInvitationInput]>()
    .mockResolvedValue(invitation);

  const useCase = new InviteUserToGroupUseCase(
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
      findMembers: jest.fn(),
      findGroupsForUser: jest.fn(),
      addMember: jest.fn(),
    },
    {
      create: createInvitation,
      findById: jest.fn(),
      findPendingForEmail: jest.fn(),
      findPendingByGroupAndEmail,
      markAccepted: jest.fn(),
      markDeclined: jest.fn(),
    },
  );

  return { useCase, createInvitation };
}

describe('InviteUserToGroupUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({
        currentUser: authUser,
        groupId: 'group-1',
        email: 'invitee@example.com',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws GROUP_NOT_FOUND when group is missing', async () => {
    const { useCase } = createUseCase({ group: null });

    await expect(
      useCase.execute({
        currentUser: authUser,
        groupId: 'missing',
        email: 'invitee@example.com',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_NOT_FOUND });
  });

  it('throws GROUP_FORBIDDEN for MEMBER', async () => {
    const { useCase } = createUseCase({ myMember: memberMember });

    await expect(
      useCase.execute({
        currentUser: authUser,
        groupId: 'group-1',
        email: 'invitee@example.com',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_FORBIDDEN });
  });

  it('throws VALIDATION_ERROR for invalid email', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        currentUser: authUser,
        groupId: 'group-1',
        email: 'not-an-email',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.VALIDATION_ERROR });
  });

  it('throws GROUP_INVITATION_INVALID when pending invitation already exists', async () => {
    const { useCase } = createUseCase({ pendingInvitation: invitation });

    await expect(
      useCase.execute({
        currentUser: authUser,
        groupId: 'group-1',
        email: 'invitee@example.com',
      }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_INVITATION_INVALID });
  });

  it('creates invitation with normalized email and expiry for OWNER/ADMIN', async () => {
    const { useCase, createInvitation } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      groupId: 'group-1',
      email: '  Invitee@Example.COM  ',
    });

    expect(createInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        groupId: 'group-1',
        email: 'invitee@example.com',
        invitedById: 'user-1',
      }),
    );
    const createInput = createInvitation.mock.calls[0]![0];
    expect(createInput.expiresAt).toBeInstanceOf(Date);
    expect(result).toEqual(invitation);
  });
});

import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { Group, GroupInvitation, GroupMember } from '../../domain/types';
import { AcceptGroupInvitationUseCase } from './accept-group-invitation.use-case';

const authUser: AuthUser = {
  id: 'user-1',
  email: 'invitee@example.com',
  role: 'USER',
};

const safeUser: SafeUser = {
  id: 'user-1',
  email: 'invitee@example.com',
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
  createdById: 'owner-1',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
};

const pendingInvitation: GroupInvitation = {
  id: 'invitation-1',
  groupId: 'group-1',
  email: 'invitee@example.com',
  invitedById: 'owner-1',
  status: 'PENDING',
  expiresAt: new Date('2099-01-01T00:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  acceptedAt: null,
  declinedAt: null,
};

const acceptedInvitation: GroupInvitation = {
  ...pendingInvitation,
  status: 'ACCEPTED',
  acceptedAt: new Date('2026-06-01T00:00:00.000Z'),
};

const newMember: GroupMember = {
  id: 'member-1',
  groupId: 'group-1',
  userId: 'user-1',
  role: 'MEMBER',
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  invitation?: GroupInvitation | null;
  group?: Group | null;
  existingMember?: GroupMember | null;
}) {
  const findByIdUser = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findByIdInvitation = jest
    .fn()
    .mockResolvedValue(
      options?.invitation === undefined
        ? pendingInvitation
        : options.invitation,
    );
  const findByIdGroup = jest
    .fn()
    .mockResolvedValue(options?.group === undefined ? group : options.group);
  const findMember = jest
    .fn()
    .mockResolvedValue(
      options?.existingMember === undefined ? null : options.existingMember,
    );
  const addMember = jest.fn().mockResolvedValue(newMember);
  const markAccepted = jest.fn().mockResolvedValue(acceptedInvitation);

  const useCase = new AcceptGroupInvitationUseCase(
    {
      findById: findByIdUser,
      findByEmail: jest.fn(),
      create: jest.fn(),
      markEmailVerified: jest.fn(),
      updatePasswordHash: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: findByIdInvitation,
      findPendingForEmail: jest.fn(),
      findPendingByGroupAndEmail: jest.fn(),
      markAccepted,
      markDeclined: jest.fn(),
    },
    {
      create: jest.fn(),
      findById: findByIdGroup,
      findMember,
      findMembers: jest.fn(),
      findGroupsForUser: jest.fn(),
      addMember,
    },
  );

  return { useCase, addMember, markAccepted };
}

describe('AcceptGroupInvitationUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser, invitationId: 'invitation-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('throws GROUP_INVITATION_NOT_FOUND when invitation is missing', async () => {
    const { useCase } = createUseCase({ invitation: null });

    await expect(
      useCase.execute({ currentUser: authUser, invitationId: 'missing' }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_INVITATION_NOT_FOUND });
  });

  it('throws GROUP_INVITATION_INVALID when invitation is not PENDING', async () => {
    const { useCase } = createUseCase({
      invitation: { ...pendingInvitation, status: 'DECLINED' },
    });

    await expect(
      useCase.execute({ currentUser: authUser, invitationId: 'invitation-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_INVITATION_INVALID });
  });

  it('throws GROUP_INVITATION_INVALID when invitation is expired', async () => {
    const { useCase } = createUseCase({
      invitation: {
        ...pendingInvitation,
        expiresAt: new Date('2020-01-01T00:00:00.000Z'),
      },
    });

    await expect(
      useCase.execute({ currentUser: authUser, invitationId: 'invitation-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_INVITATION_INVALID });
  });

  it('throws GROUP_INVITATION_INVALID when invitation email does not match current user', async () => {
    const { useCase } = createUseCase({
      invitation: { ...pendingInvitation, email: 'other@example.com' },
    });

    await expect(
      useCase.execute({ currentUser: authUser, invitationId: 'invitation-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_INVITATION_INVALID });
  });

  it('throws GROUP_NOT_FOUND when group is missing', async () => {
    const { useCase } = createUseCase({ group: null });

    await expect(
      useCase.execute({ currentUser: authUser, invitationId: 'invitation-1' }),
    ).rejects.toMatchObject({ code: ErrorCodes.GROUP_NOT_FOUND });
  });

  it('adds MEMBER when user is not yet a member', async () => {
    const { useCase, addMember } = createUseCase({ existingMember: null });

    const result = await useCase.execute({
      currentUser: authUser,
      invitationId: 'invitation-1',
    });

    expect(addMember).toHaveBeenCalledWith({
      groupId: 'group-1',
      userId: 'user-1',
      role: 'MEMBER',
    });
    expect(result.member).toEqual(newMember);
    expect(result.invitation).toEqual(acceptedInvitation);
  });

  it('reuses existing member when user is already a member', async () => {
    const existingMember: GroupMember = {
      ...newMember,
      id: 'existing-member',
    };
    const { useCase, addMember } = createUseCase({
      existingMember,
    });

    const result = await useCase.execute({
      currentUser: authUser,
      invitationId: 'invitation-1',
    });

    expect(addMember).not.toHaveBeenCalled();
    expect(result.member).toEqual(existingMember);
  });

  it('marks invitation accepted and returns invitation + member', async () => {
    const { useCase, markAccepted } = createUseCase();

    await useCase.execute({
      currentUser: authUser,
      invitationId: 'invitation-1',
    });

    expect(markAccepted).toHaveBeenCalledWith('invitation-1', expect.any(Date));
  });
});

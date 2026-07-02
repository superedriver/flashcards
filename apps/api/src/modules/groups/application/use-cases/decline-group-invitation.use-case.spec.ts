import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { GroupInvitation } from '../../domain/types';
import { DeclineGroupInvitationUseCase } from './decline-group-invitation.use-case';

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

const declinedInvitation: GroupInvitation = {
  ...pendingInvitation,
  status: 'DECLINED',
  declinedAt: new Date('2026-06-01T00:00:00.000Z'),
};

function createUseCase(options?: {
  user?: SafeUser | null;
  invitation?: GroupInvitation | null;
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
  const markDeclined = jest.fn().mockResolvedValue(declinedInvitation);

  const useCase = new DeclineGroupInvitationUseCase(
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
      markAccepted: jest.fn(),
      markDeclined,
    },
  );

  return { useCase, markDeclined };
}

describe('DeclineGroupInvitationUseCase', () => {
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
      invitation: { ...pendingInvitation, status: 'ACCEPTED' },
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

  it('marks invitation declined and returns updated invitation', async () => {
    const { useCase, markDeclined } = createUseCase();

    const result = await useCase.execute({
      currentUser: authUser,
      invitationId: 'invitation-1',
    });

    expect(markDeclined).toHaveBeenCalledWith('invitation-1', expect.any(Date));
    expect(result).toEqual(declinedInvitation);
  });
});

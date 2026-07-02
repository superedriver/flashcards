import { ErrorCodes } from '../../../../common/errors';
import { AuthUser, SafeUser } from '../../../auth/domain/types';
import { GroupInvitation } from '../../domain/types';
import { MyGroupInvitationsUseCase } from './my-group-invitations.use-case';

const authUser: AuthUser = {
  id: 'user-1',
  email: 'User@Example.COM',
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

const invitations: GroupInvitation[] = [
  {
    id: 'invitation-1',
    groupId: 'group-1',
    email: 'user@example.com',
    invitedById: 'owner-1',
    status: 'PENDING',
    expiresAt: new Date('2026-07-01T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    acceptedAt: null,
    declinedAt: null,
  },
];

function createUseCase(options?: { user?: SafeUser | null }) {
  const findById = jest
    .fn()
    .mockResolvedValue(options?.user === undefined ? safeUser : options.user);
  const findPendingForEmail = jest.fn().mockResolvedValue(invitations);

  const useCase = new MyGroupInvitationsUseCase(
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
      findPendingForEmail,
      findPendingByGroupAndEmail: jest.fn(),
      markAccepted: jest.fn(),
      markDeclined: jest.fn(),
    },
  );

  return { useCase, findPendingForEmail };
}

describe('MyGroupInvitationsUseCase', () => {
  it('throws USER_BLOCKED when user is blocked', async () => {
    const { useCase } = createUseCase({
      user: { ...safeUser, blockedAt: new Date('2026-06-01T00:00:00.000Z') },
    });

    await expect(
      useCase.execute({ currentUser: authUser }),
    ).rejects.toMatchObject({ code: ErrorCodes.USER_BLOCKED });
  });

  it('returns pending invitations for normalized current user email', async () => {
    const { useCase, findPendingForEmail } = createUseCase();

    await expect(useCase.execute({ currentUser: authUser })).resolves.toEqual(
      invitations,
    );
    expect(findPendingForEmail).toHaveBeenCalledWith('user@example.com');
  });
});

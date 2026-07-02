import { toGroupInvitation } from './group-invitation.mapper';

const prismaInvitation = {
  id: 'invitation-1',
  groupId: 'group-1',
  email: 'invitee@example.com',
  invitedById: 'user-1',
  status: 'PENDING',
  expiresAt: new Date('2026-07-01T00:00:00.000Z'),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  acceptedAt: null,
  declinedAt: null,
};

describe('group-invitation.mapper', () => {
  it('toGroupInvitation maps status, email, expiry, and timestamps', () => {
    expect(toGroupInvitation(prismaInvitation)).toEqual({
      id: 'invitation-1',
      groupId: 'group-1',
      email: 'invitee@example.com',
      invitedById: 'user-1',
      status: 'PENDING',
      expiresAt: prismaInvitation.expiresAt,
      createdAt: prismaInvitation.createdAt,
      updatedAt: prismaInvitation.updatedAt,
      acceptedAt: null,
      declinedAt: null,
    });
  });

  it('toGroupInvitation casts status to domain enum', () => {
    expect(
      toGroupInvitation({ ...prismaInvitation, status: 'ACCEPTED' }).status,
    ).toBe('ACCEPTED');
  });
});

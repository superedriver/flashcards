import { GroupInvitation } from '../../domain/types';

export const GROUP_INVITATION_REPOSITORY = Symbol(
  'GROUP_INVITATION_REPOSITORY',
);

export type CreateGroupInvitationInput = {
  groupId: string;
  email: string;
  invitedById: string;
  expiresAt: Date;
};

export type GroupInvitationRepositoryPort = {
  create(input: CreateGroupInvitationInput): Promise<GroupInvitation>;
  findById(invitationId: string): Promise<GroupInvitation | null>;
  findPendingForEmail(email: string): Promise<GroupInvitation[]>;
  findPendingByGroupAndEmail(input: {
    groupId: string;
    email: string;
  }): Promise<GroupInvitation | null>;
  markAccepted(
    invitationId: string,
    acceptedAt: Date,
  ): Promise<GroupInvitation>;
  markDeclined(
    invitationId: string,
    declinedAt: Date,
  ): Promise<GroupInvitation>;
};

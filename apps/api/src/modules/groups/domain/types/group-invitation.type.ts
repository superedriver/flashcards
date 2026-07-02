import { GroupInvitationStatus } from './group-invitation-status.type';

export type GroupInvitation = {
  id: string;
  groupId: string;
  email: string;
  invitedById: string;
  status: GroupInvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt: Date | null;
  declinedAt: Date | null;
};

import { GroupInvitation, GroupInvitationStatus } from '../../domain/types';

type PrismaGroupInvitationRecord = {
  id: string;
  groupId: string;
  email: string;
  invitedById: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt: Date | null;
  declinedAt: Date | null;
};

export function toGroupInvitation(
  invitation: PrismaGroupInvitationRecord,
): GroupInvitation {
  return {
    id: invitation.id,
    groupId: invitation.groupId,
    email: invitation.email,
    invitedById: invitation.invitedById,
    status: invitation.status as GroupInvitationStatus,
    expiresAt: invitation.expiresAt,
    createdAt: invitation.createdAt,
    updatedAt: invitation.updatedAt,
    acceptedAt: invitation.acceptedAt,
    declinedAt: invitation.declinedAt,
  };
}

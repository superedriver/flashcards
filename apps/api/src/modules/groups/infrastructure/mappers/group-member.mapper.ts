import { GroupMember, GroupRole } from '../../domain/types';

type PrismaGroupMemberRecord = {
  id: string;
  groupId: string;
  userId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toGroupMember(member: PrismaGroupMemberRecord): GroupMember {
  return {
    id: member.id,
    groupId: member.groupId,
    userId: member.userId,
    role: member.role as GroupRole,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

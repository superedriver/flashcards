import { GroupRole } from './group-role.type';

export type Group = {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type GroupMemberPreview = {
  userId: string;
  initials: string;
};

export type GroupWithMyRole = Group & {
  myRole: GroupRole;
  memberCount: number;
  membersPreview: GroupMemberPreview[];
};

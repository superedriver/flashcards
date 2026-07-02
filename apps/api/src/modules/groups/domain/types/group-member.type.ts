import { GroupRole } from './group-role.type';

export type GroupMember = {
  id: string;
  groupId: string;
  userId: string;
  role: GroupRole;
  createdAt: Date;
  updatedAt: Date;
};

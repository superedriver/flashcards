import {
  Group,
  GroupMember,
  GroupRole,
  GroupWithMyRole,
} from '../../domain/types';

export const GROUP_REPOSITORY = Symbol('GROUP_REPOSITORY');

export type CreateGroupInput = {
  name: string;
  description?: string | null;
  createdById: string;
};

export type GroupRepositoryPort = {
  create(input: CreateGroupInput): Promise<Group>;
  addMember(input: {
    groupId: string;
    userId: string;
    role: GroupRole;
  }): Promise<GroupMember>;
  findById(groupId: string): Promise<Group | null>;
  findMember(input: {
    groupId: string;
    userId: string;
  }): Promise<GroupMember | null>;
  findGroupsForUser(userId: string): Promise<GroupWithMyRole[]>;
  findMembers(groupId: string): Promise<GroupMember[]>;
};

import { AdminUserSummary } from '../../domain/types';

export const ADMIN_USER_REPOSITORY = Symbol('ADMIN_USER_REPOSITORY');

export type AdminSearchUsersInput = {
  query?: string | null;
  limit: number;
  offset: number;
};

export type AdminSearchUsersResult = {
  items: AdminUserSummary[];
  total: number;
};

export type AdminUserRepositoryPort = {
  searchUsers(input: AdminSearchUsersInput): Promise<AdminSearchUsersResult>;
  findById(userId: string): Promise<AdminUserSummary | null>;
  blockUser(userId: string, blockedAt: Date): Promise<AdminUserSummary>;
  unblockUser(userId: string): Promise<AdminUserSummary>;
};

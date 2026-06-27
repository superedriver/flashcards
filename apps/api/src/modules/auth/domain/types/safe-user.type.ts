import { UserRole } from './user-role.type';

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: Date | null;
  blockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

import { UserRole } from '../../../auth/domain/types';

export type AdminUserSummary = {
  id: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: Date | null;
  blockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

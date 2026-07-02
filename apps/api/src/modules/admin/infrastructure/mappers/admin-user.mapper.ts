import { UserRole } from '../../../auth/domain/types';
import { AdminUserSummary } from '../../domain/types';

type PrismaAdminUserRecord = {
  id: string;
  email: string;
  role: string;
  emailVerifiedAt: Date | null;
  blockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toAdminUserSummary(
  user: PrismaAdminUserRecord,
): AdminUserSummary {
  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    emailVerifiedAt: user.emailVerifiedAt,
    blockedAt: user.blockedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

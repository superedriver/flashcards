import { UserWithPassword } from '../../application/ports/user-repository.port';
import { SafeUser, UserRole } from '../../domain/types';

type PrismaUserRecord = {
  id: string;
  email: string;
  passwordHash: string | null;
  role: string;
  emailVerifiedAt: Date | null;
  blockedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toSafeUser(user: PrismaUserRecord): SafeUser {
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

export function toUserWithPassword(user: PrismaUserRecord): UserWithPassword {
  return {
    ...toSafeUser(user),
    passwordHash: user.passwordHash,
  };
}

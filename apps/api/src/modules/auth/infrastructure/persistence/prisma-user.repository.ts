import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import {
  CreateUserInput,
  UserRepositoryPort,
  UserWithPassword,
} from '../../application/ports/user-repository.port';
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

function toSafeUser(user: PrismaUserRecord): SafeUser {
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

function toUserWithPassword(user: PrismaUserRecord): UserWithPassword {
  return {
    ...toSafeUser(user),
    passwordHash: user.passwordHash,
  };
}

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user ? toSafeUser(user) : null;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    return user ? toUserWithPassword(user) : null;
  }

  async create(input: CreateUserInput): Promise<SafeUser> {
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        profile: { create: {} },
        settings: { create: {} },
      },
    });

    return toSafeUser(user);
  }
}

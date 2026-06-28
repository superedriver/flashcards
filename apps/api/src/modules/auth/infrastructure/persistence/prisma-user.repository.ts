import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateUserInput,
  UserRepositoryPort,
  UserWithPassword,
} from '../../application/ports/user-repository.port';
import { SafeUser } from '../../domain/types';
import { toSafeUser, toUserWithPassword } from '../mappers/user.mapper';

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

  async markEmailVerified(userId: string, verifiedAt: Date): Promise<SafeUser> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: verifiedAt },
    });

    return toSafeUser(user);
  }

  async updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }
}

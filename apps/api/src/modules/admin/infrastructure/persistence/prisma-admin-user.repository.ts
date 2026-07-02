import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  AdminSearchUsersInput,
  AdminSearchUsersResult,
  AdminUserRepositoryPort,
} from '../../application/ports/admin-user-repository.port';
import { AdminUserSummary } from '../../domain/types';
import { toAdminUserSummary } from '../mappers/admin-user.mapper';

const MAX_LIMIT = 50;
const MIN_OFFSET = 0;

@Injectable()
export class PrismaAdminUserRepository implements AdminUserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsers(
    input: AdminSearchUsersInput,
  ): Promise<AdminSearchUsersResult> {
    const limit = Math.min(MAX_LIMIT, input.limit);
    const offset = Math.max(MIN_OFFSET, input.offset);
    const where = {
      deletedAt: null,
      ...(input.query
        ? {
            email: {
              contains: input.query,
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map(toAdminUserSummary),
      total,
    };
  }

  async findById(userId: string): Promise<AdminUserSummary | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    return user ? toAdminUserSummary(user) : null;
  }

  async blockUser(userId: string, blockedAt: Date): Promise<AdminUserSummary> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { blockedAt },
    });

    return toAdminUserSummary(user);
  }

  async unblockUser(userId: string): Promise<AdminUserSummary> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { blockedAt: null },
    });

    return toAdminUserSummary(user);
  }
}

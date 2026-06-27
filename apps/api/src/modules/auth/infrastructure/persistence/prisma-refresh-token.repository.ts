import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateRefreshTokenInput,
  RefreshTokenRecord,
  RefreshTokenRepositoryPort,
} from '../../application/ports/refresh-token-repository.port';
import { toRefreshTokenRecord } from '../mappers/refresh-token.mapper';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateRefreshTokenInput): Promise<RefreshTokenRecord> {
    const token = await this.prisma.refreshToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        rotatedFromTokenId: input.rotatedFromTokenId ?? null,
        userAgent: input.userAgent ?? null,
        ipAddress: input.ipAddress ?? null,
      },
    });

    return toRefreshTokenRecord(token);
  }

  async findActiveByHash(
    tokenHash: string,
  ): Promise<RefreshTokenRecord | null> {
    const token = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    return token ? toRefreshTokenRecord(token) : null;
  }

  async revokeById(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }
}

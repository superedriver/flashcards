import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateEmailVerificationTokenInput,
  EmailVerificationTokenRecord,
  EmailVerificationTokenRepositoryPort,
} from '../../application/ports/email-verification-token-repository.port';

@Injectable()
export class PrismaEmailVerificationTokenRepository implements EmailVerificationTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    input: CreateEmailVerificationTokenInput,
  ): Promise<EmailVerificationTokenRecord> {
    const token = await this.prisma.emailVerificationToken.create({
      data: {
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
      },
    });

    return this.toRecord(token);
  }

  async findValidByHash(
    tokenHash: string,
  ): Promise<EmailVerificationTokenRecord | null> {
    const token = await this.prisma.emailVerificationToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    return token ? this.toRecord(token) : null;
  }

  async markUsed(id: string): Promise<void> {
    await this.prisma.emailVerificationToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async revokeActiveForUser(userId: string): Promise<void> {
    await this.prisma.emailVerificationToken.updateMany({
      where: {
        userId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });
  }

  private toRecord(token: {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
  }): EmailVerificationTokenRecord {
    return {
      id: token.id,
      userId: token.userId,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
      usedAt: token.usedAt,
      createdAt: token.createdAt,
    };
  }
}

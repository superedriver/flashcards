import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import { BlockedIdentityRepositoryPort } from '../../application/ports/blocked-identity-repository.port';

@Injectable()
export class PrismaBlockedIdentityRepository implements BlockedIdentityRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async upsertByEmail(email: string): Promise<void> {
    const normalizedEmail = normalizeBlockedEmail(email);

    await this.prisma.blockedIdentity.upsert({
      where: { email: normalizedEmail },
      create: { email: normalizedEmail },
      update: {},
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const identity = await this.prisma.blockedIdentity.findUnique({
      where: { email: normalizeBlockedEmail(email) },
      select: { id: true },
    });

    return identity !== null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.prisma.blockedIdentity.deleteMany({
      where: { email: normalizeBlockedEmail(email) },
    });
  }
}

function normalizeBlockedEmail(email: string): string {
  return email.trim().toLowerCase();
}

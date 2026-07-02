import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  PushTokenRepositoryPort,
  RegisterPushTokenInput,
} from '../../application/ports/push-token-repository.port';
import { PushToken } from '../../domain/types';
import { toPushToken } from '../mappers/push-token.mapper';

@Injectable()
export class PrismaPushTokenRepository implements PushTokenRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async register(input: RegisterPushTokenInput): Promise<PushToken> {
    const record = await this.prisma.pushToken.upsert({
      where: {
        userId_token: {
          userId: input.userId,
          token: input.token,
        },
      },
      create: {
        userId: input.userId,
        token: input.token,
        provider: 'EXPO',
        deviceId: input.deviceId ?? null,
        platform: input.platform ?? null,
        disabledAt: null,
      },
      update: {
        provider: 'EXPO',
        deviceId: input.deviceId ?? null,
        platform: input.platform ?? null,
        disabledAt: null,
      },
    });

    return toPushToken(record);
  }

  async findActiveByUserId(userId: string): Promise<PushToken[]> {
    const records = await this.prisma.pushToken.findMany({
      where: {
        userId,
        disabledAt: null,
      },
    });

    return records.map(toPushToken);
  }

  async findActiveForUsers(userIds: string[]): Promise<PushToken[]> {
    if (userIds.length === 0) {
      return [];
    }

    const records = await this.prisma.pushToken.findMany({
      where: {
        userId: { in: userIds },
        disabledAt: null,
      },
    });

    return records.map(toPushToken);
  }

  async disable(input: { userId: string; token: string }): Promise<void> {
    await this.prisma.pushToken.updateMany({
      where: {
        userId: input.userId,
        token: input.token,
        disabledAt: null,
      },
      data: {
        disabledAt: new Date(),
      },
    });
  }

  async markUsed(tokenId: string, usedAt: Date): Promise<void> {
    await this.prisma.pushToken.update({
      where: { id: tokenId },
      data: { lastUsedAt: usedAt },
    });
  }
}

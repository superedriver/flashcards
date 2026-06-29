import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  UpdateUserProfileInput,
  UserProfileRepositoryPort,
} from '../../application/ports/user-profile-repository.port';
import { UserProfile } from '../../domain/types';
import { toUserProfile } from '../mappers/user-profile.mapper';

@Injectable()
export class PrismaUserProfileRepository implements UserProfileRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserProfile | null> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    return profile ? toUserProfile(profile) : null;
  }

  async createForUser(userId: string): Promise<UserProfile> {
    const profile = await this.prisma.userProfile.create({
      data: { userId },
    });

    return toUserProfile(profile);
  }

  async update(input: UpdateUserProfileInput): Promise<UserProfile> {
    const data: {
      displayName?: string | null;
      avatarUrl?: string | null;
    } = {};

    if (input.displayName !== undefined) {
      data.displayName = input.displayName;
    }

    if (input.avatarUrl !== undefined) {
      data.avatarUrl = input.avatarUrl;
    }

    const profile = await this.prisma.userProfile.update({
      where: { userId: input.userId },
      data,
    });

    return toUserProfile(profile);
  }
}

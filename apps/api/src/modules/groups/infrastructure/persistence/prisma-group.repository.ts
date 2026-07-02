import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateGroupInput,
  GroupRepositoryPort,
} from '../../application/ports/group-repository.port';
import {
  Group,
  GroupMember,
  GroupRole,
  GroupWithMyRole,
} from '../../domain/types';
import { toGroup } from '../mappers/group.mapper';
import { toGroupMember } from '../mappers/group-member.mapper';

@Injectable()
export class PrismaGroupRepository implements GroupRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateGroupInput): Promise<Group> {
    const group = await this.prisma.group.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        createdById: input.createdById,
      },
    });

    return toGroup(group);
  }

  async addMember(input: {
    groupId: string;
    userId: string;
    role: GroupRole;
  }): Promise<GroupMember> {
    const member = await this.prisma.groupMember.create({
      data: {
        groupId: input.groupId,
        userId: input.userId,
        role: input.role,
      },
    });

    return toGroupMember(member);
  }

  async findById(groupId: string): Promise<Group | null> {
    const group = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        deletedAt: null,
      },
    });

    return group ? toGroup(group) : null;
  }

  async findMember(input: {
    groupId: string;
    userId: string;
  }): Promise<GroupMember | null> {
    const member = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: input.groupId,
          userId: input.userId,
        },
      },
    });

    return member ? toGroupMember(member) : null;
  }

  async findGroupsForUser(userId: string): Promise<GroupWithMyRole[]> {
    const memberships = await this.prisma.groupMember.findMany({
      where: {
        userId,
        group: {
          deletedAt: null,
        },
      },
      include: {
        group: true,
      },
      orderBy: {
        group: {
          updatedAt: 'desc',
        },
      },
    });

    return memberships.map((membership) => ({
      ...toGroup(membership.group),
      myRole: membership.role,
    }));
  }

  async findMembers(groupId: string): Promise<GroupMember[]> {
    const members = await this.prisma.groupMember.findMany({
      where: {
        groupId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return members.map(toGroupMember);
  }
}

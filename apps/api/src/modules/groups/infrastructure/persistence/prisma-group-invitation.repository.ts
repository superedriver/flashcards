import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma';
import {
  CreateGroupInvitationInput,
  GroupInvitationRepositoryPort,
} from '../../application/ports/group-invitation-repository.port';
import { GroupInvitation } from '../../domain/types';
import { normalizeGroupEmail } from '../../domain/utils/normalize-group-email';
import { toGroupInvitation } from '../mappers/group-invitation.mapper';

@Injectable()
export class PrismaGroupInvitationRepository implements GroupInvitationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateGroupInvitationInput): Promise<GroupInvitation> {
    const email = normalizeGroupEmail(input.email);

    const invitation = await this.prisma.groupInvitation.create({
      data: {
        groupId: input.groupId,
        email,
        invitedById: input.invitedById,
        expiresAt: input.expiresAt,
      },
    });

    return toGroupInvitation(invitation);
  }

  async findById(invitationId: string): Promise<GroupInvitation | null> {
    const invitation = await this.prisma.groupInvitation.findUnique({
      where: {
        id: invitationId,
      },
    });

    return invitation ? toGroupInvitation(invitation) : null;
  }

  async findPendingForEmail(email: string): Promise<GroupInvitation[]> {
    const normalizedEmail = normalizeGroupEmail(email);

    const invitations = await this.prisma.groupInvitation.findMany({
      where: {
        email: normalizedEmail,
        status: 'PENDING',
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return invitations.map(toGroupInvitation);
  }

  async findPendingByGroupAndEmail(input: {
    groupId: string;
    email: string;
  }): Promise<GroupInvitation | null> {
    const normalizedEmail = normalizeGroupEmail(input.email);

    const invitation = await this.prisma.groupInvitation.findFirst({
      where: {
        groupId: input.groupId,
        email: normalizedEmail,
        status: 'PENDING',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return invitation ? toGroupInvitation(invitation) : null;
  }

  async markAccepted(
    invitationId: string,
    acceptedAt: Date,
  ): Promise<GroupInvitation> {
    const invitation = await this.prisma.groupInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: 'ACCEPTED',
        acceptedAt,
      },
    });

    return toGroupInvitation(invitation);
  }

  async markDeclined(
    invitationId: string,
    declinedAt: Date,
  ): Promise<GroupInvitation> {
    const invitation = await this.prisma.groupInvitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: 'DECLINED',
        declinedAt,
      },
    });

    return toGroupInvitation(invitation);
  }
}

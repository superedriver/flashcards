import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { normalizeGroupEmail } from '../../domain/utils/normalize-group-email';
import { GroupInvitation, GroupMember } from '../../domain/types';
import {
  GROUP_INVITATION_REPOSITORY,
  GroupInvitationRepositoryPort,
} from '../ports/group-invitation-repository.port';
import {
  GROUP_REPOSITORY,
  GroupRepositoryPort,
} from '../ports/group-repository.port';

export type AcceptGroupInvitationUseCaseInput = {
  currentUser: AuthUser;
  invitationId: string;
};

export type AcceptGroupInvitationUseCaseResult = {
  invitation: GroupInvitation;
  member: GroupMember;
};

@Injectable()
export class AcceptGroupInvitationUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(GROUP_INVITATION_REPOSITORY)
    private readonly groupInvitationRepository: GroupInvitationRepositoryPort,
    @Inject(GROUP_REPOSITORY)
    private readonly groupRepository: GroupRepositoryPort,
  ) {}

  async execute(
    input: AcceptGroupInvitationUseCaseInput,
  ): Promise<AcceptGroupInvitationUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const invitation = await this.groupInvitationRepository.findById(
      input.invitationId,
    );

    if (!invitation) {
      throw new ApplicationError(
        ErrorCodes.GROUP_INVITATION_NOT_FOUND,
        'Group invitation not found',
      );
    }

    if (invitation.status !== 'PENDING') {
      throw new ApplicationError(
        ErrorCodes.GROUP_INVITATION_INVALID,
        'Group invitation is not pending',
      );
    }

    if (invitation.expiresAt <= new Date()) {
      throw new ApplicationError(
        ErrorCodes.GROUP_INVITATION_INVALID,
        'Group invitation has expired',
      );
    }

    const userEmail = normalizeGroupEmail(input.currentUser.email);

    if (invitation.email !== userEmail) {
      throw new ApplicationError(
        ErrorCodes.GROUP_INVITATION_INVALID,
        'Group invitation email does not match',
      );
    }

    const group = await this.groupRepository.findById(invitation.groupId);

    if (!group) {
      throw new ApplicationError(ErrorCodes.GROUP_NOT_FOUND, 'Group not found');
    }

    let member = await this.groupRepository.findMember({
      groupId: invitation.groupId,
      userId: input.currentUser.id,
    });

    if (!member) {
      member = await this.groupRepository.addMember({
        groupId: invitation.groupId,
        userId: input.currentUser.id,
        role: 'MEMBER',
      });
    }

    const acceptedInvitation =
      await this.groupInvitationRepository.markAccepted(
        invitation.id,
        new Date(),
      );

    return {
      invitation: acceptedInvitation,
      member,
    };
  }
}

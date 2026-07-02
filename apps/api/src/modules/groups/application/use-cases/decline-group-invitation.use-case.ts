import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { normalizeGroupEmail } from '../../domain/utils/normalize-group-email';
import { GroupInvitation } from '../../domain/types';
import {
  GROUP_INVITATION_REPOSITORY,
  GroupInvitationRepositoryPort,
} from '../ports/group-invitation-repository.port';

export type DeclineGroupInvitationUseCaseInput = {
  currentUser: AuthUser;
  invitationId: string;
};

export type DeclineGroupInvitationUseCaseResult = GroupInvitation;

@Injectable()
export class DeclineGroupInvitationUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(GROUP_INVITATION_REPOSITORY)
    private readonly groupInvitationRepository: GroupInvitationRepositoryPort,
  ) {}

  async execute(
    input: DeclineGroupInvitationUseCaseInput,
  ): Promise<DeclineGroupInvitationUseCaseResult> {
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

    const userEmail = normalizeGroupEmail(input.currentUser.email);

    if (invitation.email !== userEmail) {
      throw new ApplicationError(
        ErrorCodes.GROUP_INVITATION_INVALID,
        'Group invitation email does not match',
      );
    }

    return this.groupInvitationRepository.markDeclined(
      invitation.id,
      new Date(),
    );
  }
}

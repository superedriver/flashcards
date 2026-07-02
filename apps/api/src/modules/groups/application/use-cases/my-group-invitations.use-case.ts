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

export type MyGroupInvitationsUseCaseInput = {
  currentUser: AuthUser;
};

export type MyGroupInvitationsUseCaseResult = GroupInvitation[];

@Injectable()
export class MyGroupInvitationsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(GROUP_INVITATION_REPOSITORY)
    private readonly groupInvitationRepository: GroupInvitationRepositoryPort,
  ) {}

  async execute(
    input: MyGroupInvitationsUseCaseInput,
  ): Promise<MyGroupInvitationsUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    const email = normalizeGroupEmail(input.currentUser.email);

    return this.groupInvitationRepository.findPendingForEmail(email);
  }
}

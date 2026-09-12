import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  BLOCKED_IDENTITY_REPOSITORY,
  BlockedIdentityRepositoryPort,
} from '../../../auth/application/ports/blocked-identity-repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { AdminPermissionService } from '../../domain/services/admin-permission.service';
import { AdminUserSummary } from '../../domain/types';
import {
  ADMIN_USER_REPOSITORY,
  AdminUserRepositoryPort,
} from '../ports/admin-user-repository.port';

export type UnblockUserUseCaseInput = {
  currentUser: AuthUser;
  userId: string;
};

export type UnblockUserUseCaseResult = AdminUserSummary;

@Injectable()
export class UnblockUserUseCase {
  private readonly adminPermissionService = new AdminPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly adminUserRepository: AdminUserRepositoryPort,
    @Inject(BLOCKED_IDENTITY_REPOSITORY)
    private readonly blockedIdentityRepository: BlockedIdentityRepositoryPort,
  ) {}

  async execute(
    input: UnblockUserUseCaseInput,
  ): Promise<UnblockUserUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    if (!this.adminPermissionService.canManageUsers(input.currentUser)) {
      throw new ApplicationError(ErrorCodes.FORBIDDEN, 'Forbidden');
    }

    const targetUser = await this.adminUserRepository.findById(input.userId);

    if (!targetUser) {
      throw new ApplicationError(ErrorCodes.NOT_FOUND, 'User not found');
    }

    const unblockedUser = await this.adminUserRepository.unblockUser(
      input.userId,
    );

    await this.blockedIdentityRepository.deleteByEmail(targetUser.email);

    return unblockedUser;
  }
}

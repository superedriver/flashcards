import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepositoryPort,
} from '../../../auth/application/ports/refresh-token-repository.port';
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

export type BlockUserUseCaseInput = {
  currentUser: AuthUser;
  userId: string;
};

export type BlockUserUseCaseResult = AdminUserSummary;

@Injectable()
export class BlockUserUseCase {
  private readonly adminPermissionService = new AdminPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly adminUserRepository: AdminUserRepositoryPort,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(input: BlockUserUseCaseInput): Promise<BlockUserUseCaseResult> {
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

    if (input.currentUser.id === input.userId) {
      throw new ApplicationError(
        ErrorCodes.VALIDATION_ERROR,
        'Cannot block yourself',
      );
    }

    const targetUser = await this.adminUserRepository.findById(input.userId);

    if (!targetUser) {
      throw new ApplicationError(ErrorCodes.NOT_FOUND, 'User not found');
    }

    const blockedUser = await this.adminUserRepository.blockUser(
      input.userId,
      new Date(),
    );

    await this.refreshTokenRepository.revokeAllForUser(input.userId);

    return blockedUser;
  }
}

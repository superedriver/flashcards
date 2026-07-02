import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
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

export type AdminSearchUsersUseCaseInput = {
  currentUser: AuthUser;
  query?: string | null;
  limit?: number;
  offset?: number;
};

export type AdminSearchUsersUseCaseResult = {
  items: AdminUserSummary[];
  total: number;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MIN_LIMIT = 1;
const DEFAULT_OFFSET = 0;

@Injectable()
export class AdminSearchUsersUseCase {
  private readonly adminPermissionService = new AdminPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ADMIN_USER_REPOSITORY)
    private readonly adminUserRepository: AdminUserRepositoryPort,
  ) {}

  async execute(
    input: AdminSearchUsersUseCaseInput,
  ): Promise<AdminSearchUsersUseCaseResult> {
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

    const query = this.normalizeQuery(input.query);
    const limit = this.normalizeLimit(input.limit);
    const offset = this.normalizeOffset(input.offset);

    return this.adminUserRepository.searchUsers({
      query,
      limit,
      offset,
    });
  }

  private normalizeQuery(query?: string | null): string | null {
    if (query == null) {
      return null;
    }

    const trimmed = query.trim();

    return trimmed.length > 0 ? trimmed : null;
  }

  private normalizeLimit(limit?: number): number {
    const value = limit ?? DEFAULT_LIMIT;

    return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, value));
  }

  private normalizeOffset(offset?: number): number {
    const value = offset ?? DEFAULT_OFFSET;

    return Math.max(DEFAULT_OFFSET, value);
  }
}

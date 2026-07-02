import { Inject, Injectable } from '@nestjs/common';
import { ApplicationError, ErrorCodes } from '../../../../common/errors';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../auth/application/ports/user-repository.port';
import { AuthUser } from '../../../auth/domain/types';
import { AdminPermissionService } from '../../domain/services/admin-permission.service';
import { AdminDashboardStats } from '../../domain/types';
import {
  ADMIN_ANALYTICS_REPOSITORY,
  AdminAnalyticsRepositoryPort,
} from '../ports/admin-analytics-repository.port';

export type AdminDashboardStatsUseCaseInput = {
  currentUser: AuthUser;
};

export type AdminDashboardStatsUseCaseResult = AdminDashboardStats;

@Injectable()
export class AdminDashboardStatsUseCase {
  private readonly adminPermissionService = new AdminPermissionService();

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject(ADMIN_ANALYTICS_REPOSITORY)
    private readonly adminAnalyticsRepository: AdminAnalyticsRepositoryPort,
  ) {}

  async execute(
    input: AdminDashboardStatsUseCaseInput,
  ): Promise<AdminDashboardStatsUseCaseResult> {
    const user = await this.userRepository.findById(input.currentUser.id);

    if (!user) {
      throw new ApplicationError(ErrorCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (user.blockedAt !== null) {
      throw new ApplicationError(ErrorCodes.USER_BLOCKED, 'User is blocked');
    }

    if (!this.adminPermissionService.canAccessAdmin(input.currentUser)) {
      throw new ApplicationError(ErrorCodes.FORBIDDEN, 'Forbidden');
    }

    return this.adminAnalyticsRepository.getDashboardStats({
      now: new Date(),
    });
  }
}

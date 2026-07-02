import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ADMIN_ANALYTICS_REPOSITORY } from './application/ports/admin-analytics-repository.port';
import { ADMIN_DECK_REPOSITORY } from './application/ports/admin-deck-repository.port';
import { ADMIN_USER_REPOSITORY } from './application/ports/admin-user-repository.port';
import { AdminDashboardStatsUseCase } from './application/use-cases/admin-dashboard-stats.use-case';
import { AdminSearchUsersUseCase } from './application/use-cases/admin-search-users.use-case';
import { BlockUserUseCase } from './application/use-cases/block-user.use-case';
import { ModerateDeckUseCase } from './application/use-cases/moderate-deck.use-case';
import { ModerationQueueUseCase } from './application/use-cases/moderation-queue.use-case';
import { SetOfficialDeckUseCase } from './application/use-cases/set-official-deck.use-case';
import { UnblockUserUseCase } from './application/use-cases/unblock-user.use-case';
import { PrismaAdminAnalyticsRepository } from './infrastructure/persistence/prisma-admin-analytics.repository';
import { PrismaAdminDeckRepository } from './infrastructure/persistence/prisma-admin-deck.repository';
import { PrismaAdminUserRepository } from './infrastructure/persistence/prisma-admin-user.repository';
import { AdminResolver } from './presentation/graphql/resolvers/admin.resolver';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: ADMIN_USER_REPOSITORY,
      useClass: PrismaAdminUserRepository,
    },
    {
      provide: ADMIN_DECK_REPOSITORY,
      useClass: PrismaAdminDeckRepository,
    },
    {
      provide: ADMIN_ANALYTICS_REPOSITORY,
      useClass: PrismaAdminAnalyticsRepository,
    },
    AdminDashboardStatsUseCase,
    AdminSearchUsersUseCase,
    BlockUserUseCase,
    UnblockUserUseCase,
    ModerationQueueUseCase,
    ModerateDeckUseCase,
    SetOfficialDeckUseCase,
    AdminResolver,
  ],
  exports: [
    ADMIN_USER_REPOSITORY,
    ADMIN_DECK_REPOSITORY,
    ADMIN_ANALYTICS_REPOSITORY,
    AdminDashboardStatsUseCase,
    AdminSearchUsersUseCase,
    BlockUserUseCase,
    UnblockUserUseCase,
    ModerationQueueUseCase,
    ModerateDeckUseCase,
    SetOfficialDeckUseCase,
  ],
})
export class AdminModule {}

import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from '../../../../auth/domain/types';
import { CurrentUser } from '../../../../auth/presentation/graphql/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../../../auth/presentation/graphql/guards/gql-auth.guard';
import { UserRole } from '../../../../auth/presentation/graphql/types/user-role.type';
import { DeckModerationStatus } from '../../../../decks/presentation/graphql/types/deck-moderation-status.type';
import { DeckVisibility } from '../../../../decks/presentation/graphql/types/deck-visibility.type';
import { AdminDashboardStatsUseCase } from '../../../application/use-cases/admin-dashboard-stats.use-case';
import { AdminSearchUsersUseCase } from '../../../application/use-cases/admin-search-users.use-case';
import { BlockUserUseCase } from '../../../application/use-cases/block-user.use-case';
import { ModerateDeckUseCase } from '../../../application/use-cases/moderate-deck.use-case';
import { ModerationQueueUseCase } from '../../../application/use-cases/moderation-queue.use-case';
import { SetOfficialDeckUseCase } from '../../../application/use-cases/set-official-deck.use-case';
import { UnblockUserUseCase } from '../../../application/use-cases/unblock-user.use-case';
import {
  AdminUserSummary as AdminUserSummaryDomain,
  ModerationDeck as ModerationDeckDomain,
} from '../../../domain/types';
import { AdminSearchUsersInput } from '../inputs/admin-search-users.input';
import { ModerationQueueInput } from '../inputs/moderation-queue.input';
import { AdminDashboardStatsType } from '../types/admin-dashboard-stats.type';
import { AdminUserSearchResultType } from '../types/admin-user-search-result.type';
import { AdminUserSummaryType } from '../types/admin-user-summary.type';
import { ModerationDeckType } from '../types/moderation-deck.type';
import { ModerationQueueResultType } from '../types/moderation-queue-result.type';

@Resolver()
export class AdminResolver {
  constructor(
    private readonly adminDashboardStatsUseCase: AdminDashboardStatsUseCase,
    private readonly adminSearchUsersUseCase: AdminSearchUsersUseCase,
    private readonly blockUserUseCase: BlockUserUseCase,
    private readonly unblockUserUseCase: UnblockUserUseCase,
    private readonly moderationQueueUseCase: ModerationQueueUseCase,
    private readonly moderateDeckUseCase: ModerateDeckUseCase,
    private readonly setOfficialDeckUseCase: SetOfficialDeckUseCase,
  ) {}

  @Query(() => AdminDashboardStatsType)
  @UseGuards(GqlAuthGuard)
  async adminDashboardStats(
    @CurrentUser() user: AuthUser,
  ): Promise<AdminDashboardStatsType> {
    return this.adminDashboardStatsUseCase.execute({ currentUser: user });
  }

  @Query(() => AdminUserSearchResultType)
  @UseGuards(GqlAuthGuard)
  async adminSearchUsers(
    @CurrentUser() user: AuthUser,
    @Args('input', { nullable: true }) input?: AdminSearchUsersInput,
  ): Promise<AdminUserSearchResultType> {
    const result = await this.adminSearchUsersUseCase.execute({
      currentUser: user,
      query: input?.query,
      limit: input?.limit,
      offset: input?.offset,
    });

    return {
      items: result.items.map(toAdminUserSummaryType),
      total: result.total,
    };
  }

  @Mutation(() => AdminUserSummaryType)
  @UseGuards(GqlAuthGuard)
  async blockUser(
    @CurrentUser() user: AuthUser,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<AdminUserSummaryType> {
    const result = await this.blockUserUseCase.execute({
      currentUser: user,
      userId,
    });

    return toAdminUserSummaryType(result);
  }

  @Mutation(() => AdminUserSummaryType)
  @UseGuards(GqlAuthGuard)
  async unblockUser(
    @CurrentUser() user: AuthUser,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<AdminUserSummaryType> {
    const result = await this.unblockUserUseCase.execute({
      currentUser: user,
      userId,
    });

    return toAdminUserSummaryType(result);
  }

  @Query(() => ModerationQueueResultType)
  @UseGuards(GqlAuthGuard)
  async moderationQueue(
    @CurrentUser() user: AuthUser,
    @Args('input', { nullable: true }) input?: ModerationQueueInput,
  ): Promise<ModerationQueueResultType> {
    const result = await this.moderationQueueUseCase.execute({
      currentUser: user,
      status: input?.status,
      limit: input?.limit,
      offset: input?.offset,
    });

    return {
      items: result.items.map(toModerationDeckType),
      total: result.total,
    };
  }

  @Mutation(() => ModerationDeckType)
  @UseGuards(GqlAuthGuard)
  async approveDeck(
    @CurrentUser() user: AuthUser,
    @Args('deckId', { type: () => ID }) deckId: string,
  ): Promise<ModerationDeckType> {
    const result = await this.moderateDeckUseCase.execute({
      currentUser: user,
      deckId,
      action: 'APPROVE',
    });

    return toModerationDeckType(result);
  }

  @Mutation(() => ModerationDeckType)
  @UseGuards(GqlAuthGuard)
  async rejectDeck(
    @CurrentUser() user: AuthUser,
    @Args('deckId', { type: () => ID }) deckId: string,
  ): Promise<ModerationDeckType> {
    const result = await this.moderateDeckUseCase.execute({
      currentUser: user,
      deckId,
      action: 'REJECT',
    });

    return toModerationDeckType(result);
  }

  @Mutation(() => ModerationDeckType)
  @UseGuards(GqlAuthGuard)
  async hideDeck(
    @CurrentUser() user: AuthUser,
    @Args('deckId', { type: () => ID }) deckId: string,
  ): Promise<ModerationDeckType> {
    const result = await this.moderateDeckUseCase.execute({
      currentUser: user,
      deckId,
      action: 'HIDE',
    });

    return toModerationDeckType(result);
  }

  @Mutation(() => ModerationDeckType)
  @UseGuards(GqlAuthGuard)
  async setOfficialDeck(
    @CurrentUser() user: AuthUser,
    @Args('deckId', { type: () => ID }) deckId: string,
    @Args('isOfficial') isOfficial: boolean,
  ): Promise<ModerationDeckType> {
    const result = await this.setOfficialDeckUseCase.execute({
      currentUser: user,
      deckId,
      isOfficial,
    });

    return toModerationDeckType(result);
  }
}

function toAdminUserSummaryType(
  user: AdminUserSummaryDomain,
): AdminUserSummaryType {
  return {
    id: user.id,
    email: user.email,
    role: user.role as UserRole,
    emailVerifiedAt: user.emailVerifiedAt,
    blockedAt: user.blockedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toModerationDeckType(deck: ModerationDeckDomain): ModerationDeckType {
  return {
    id: deck.id,
    ownerId: deck.ownerId,
    ownerEmail: deck.ownerEmail,
    title: deck.title,
    description: deck.description,
    visibility: deck.visibility as DeckVisibility,
    moderationStatus: deck.moderationStatus as DeckModerationStatus,
    isOfficial: deck.isOfficial,
    sourceDeckId: deck.sourceDeckId,
    cardCount: deck.cardCount,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
  };
}

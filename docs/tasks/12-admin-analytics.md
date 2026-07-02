# EPIC-12 Admin & Analytics

## Epic Goal

Implement backend admin, moderation, and basic analytics features for Flashcards.

This epic covers:

```txt
- admin-only user management
- moderator/admin deck moderation
- official deck flagging
- basic platform analytics
- safe admin GraphQL outputs
- role-based access checks
```

This epic must follow:

```txt
docs/domain/permissions.md
docs/security/security-checklist.md
```

## Epic Status

DONE

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/auth-token-strategy.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/02-auth.md
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
docs/tasks/07-srs-lessons.md
```

## Epic Prerequisites

EPIC-11 should be complete.

Expected state:

```txt
- Auth works.
- User roles exist.
- GqlAuthGuard exists.
- CurrentUser decorator exists.
- Deck/Card schema exists.
- Public deck publishing exists.
- Lessons/SRS schema exists.
- User blockedAt exists.
```

## Epic Rules

```txt
1. Follow docs/domain/permissions.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Backend is the source of truth for admin permissions.
4. Frontend admin UI is not security.
5. ADMIN can block/unblock users.
6. ADMIN can set/unset official deck flag.
7. MODERATOR can approve/reject/hide public decks.
8. MODERATOR cannot block users.
9. MODERATOR cannot set official deck flag.
10. Admin outputs must not expose passwordHash or token hashes.
11. Do not put business logic in GraphQL resolvers.
12. Do not access Prisma directly from GraphQL resolvers.
```

## Role Policy

Roles:

```txt
USER
MODERATOR
ADMIN
```

ADMIN can:

```txt
- view admin dashboard stats
- search users with safe fields
- block users
- unblock users
- approve public decks
- reject public decks
- hide public decks
- set deck official
- unset deck official
```

MODERATOR can:

```txt
- view moderation queue
- approve public decks
- reject public decks
- hide public decks
```

MODERATOR cannot:

```txt
- block users
- unblock users
- set deck official
- unset deck official
- change user roles
```

USER cannot access admin operations.

## MVP Analytics Scope

Basic analytics should include:

```txt
- total users
- total decks
- total public decks
- total cards
- total study sessions
- total reviews
- users created in last 7 days
- decks created in last 7 days
- reviews submitted in last 7 days
```

No external analytics provider is required in this epic.

## Epic Summary

```md
- [x] TASK-12.01 Add admin module skeleton
- [x] TASK-12.02 Add admin domain types
- [x] TASK-12.03 Add admin permission service
- [x] TASK-12.04 Add admin repository ports
- [x] TASK-12.05 Add Prisma admin user repository
- [x] TASK-12.06 Add Prisma admin deck repository
- [x] TASK-12.07 Add Prisma analytics repository
- [x] TASK-12.08 Add admin GraphQL types and inputs
- [x] TASK-12.09 Add AdminDashboardStatsUseCase
- [x] TASK-12.10 Add adminDashboardStats query
- [x] TASK-12.11 Add AdminSearchUsersUseCase
- [x] TASK-12.12 Add adminSearchUsers query
- [x] TASK-12.13 Add BlockUserUseCase
- [x] TASK-12.14 Add blockUser mutation
- [x] TASK-12.15 Add UnblockUserUseCase
- [x] TASK-12.16 Add unblockUser mutation
- [x] TASK-12.17 Add ModerationQueueUseCase
- [x] TASK-12.18 Add moderationQueue query
- [x] TASK-12.19 Add ModerateDeckUseCase
- [x] TASK-12.20 Add approve/reject/hide deck mutations
- [x] TASK-12.21 Add SetOfficialDeckUseCase
- [x] TASK-12.22 Add setOfficialDeck mutation
- [x] TASK-12.23 Add admin and analytics final checks
- [x] TASK-12.24 Add admin unit tests
```

---

# TASK-12.01 Add admin module skeleton

## Status

DONE

## Context

Admin and moderation features should live in a dedicated backend module.

## Goal

Create admin module folder structure.

## Files to Create

```txt
apps/api/src/modules/admin/admin.module.ts

apps/api/src/modules/admin/domain/.gitkeep
apps/api/src/modules/admin/domain/types/.gitkeep
apps/api/src/modules/admin/domain/services/.gitkeep

apps/api/src/modules/admin/application/.gitkeep
apps/api/src/modules/admin/application/ports/.gitkeep
apps/api/src/modules/admin/application/use-cases/.gitkeep

apps/api/src/modules/admin/infrastructure/.gitkeep
apps/api/src/modules/admin/infrastructure/persistence/.gitkeep
apps/api/src/modules/admin/infrastructure/mappers/.gitkeep

apps/api/src/modules/admin/presentation/.gitkeep
apps/api/src/modules/admin/presentation/graphql/.gitkeep
apps/api/src/modules/admin/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/admin/presentation/graphql/types/.gitkeep
apps/api/src/modules/admin/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `AdminModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class AdminModule {}
```

Import `AdminModule` into `AppModule`.

## Acceptance Criteria

```txt
- AdminModule exists.
- AdminModule is imported into AppModule.
- Folder structure exists.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add admin module skeleton
```

---

# TASK-12.02 Add admin domain types

## Status

DONE

## Context

Admin use cases need framework-independent types.

## Goal

Add admin domain types.

## Files to Create

```txt
apps/api/src/modules/admin/domain/types/admin-user-summary.type.ts
apps/api/src/modules/admin/domain/types/admin-dashboard-stats.type.ts
apps/api/src/modules/admin/domain/types/moderation-deck.type.ts
apps/api/src/modules/admin/domain/types/index.ts
```

## Requirements

Create `AdminUserSummary`:

```ts
import { UserRole } from '../../../auth/domain/types'

export type AdminUserSummary = {
  id: string
  email: string
  role: UserRole
  emailVerifiedAt: Date | null
  blockedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
```

Create `AdminDashboardStats`:

```ts
export type AdminDashboardStats = {
  totalUsers: number
  totalDecks: number
  totalPublicDecks: number
  totalCards: number
  totalStudySessions: number
  totalReviews: number
  usersCreatedLast7Days: number
  decksCreatedLast7Days: number
  reviewsSubmittedLast7Days: number
}
```

Create `ModerationDeck`:

```ts
import { Deck } from '../../../decks/domain/types'

export type ModerationDeck = Deck & {
  ownerEmail: string
  cardCount: number
}
```

## Security Requirements

```txt
- Do not include passwordHash.
- Do not include refresh token hashes.
- Do not include verification/reset token hashes.
- Do not include raw push tokens.
```

## Architecture Constraints

```txt
- Types must not import Prisma.
- Types must not import GraphQL decorators.
- Types must not import NestJS.
```

## Acceptance Criteria

```txt
- AdminUserSummary type exists.
- AdminDashboardStats type exists.
- ModerationDeck type exists.
- Types are framework-independent.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add admin domain types
```

---

# TASK-12.03 Add admin permission service

## Status

DONE

## Context

Admin permissions must be centralized and follow `docs/domain/permissions.md`.

## Goal

Add admin permission service.

## Files to Create

```txt
apps/api/src/modules/admin/domain/services/admin-permission.service.ts
```

## Requirements

Create `AdminPermissionService`:

```ts
import { AuthUser } from '../../../auth/domain/types'

export class AdminPermissionService {
  canAccessAdmin(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN'
  }

  canModerateDecks(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN' || user?.role === 'MODERATOR'
  }

  canManageUsers(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN'
  }

  canSetOfficialDeck(user: AuthUser | null): boolean {
    return user?.role === 'ADMIN'
  }
}
```

Rules:

```txt
- ADMIN can access all admin/moderation operations.
- MODERATOR can moderate decks only.
- USER cannot access admin/moderation operations.
- Null user is denied.
```

## Security Requirements

```txt
- Deny by default.
- Do not trust frontend role visibility.
```

## Architecture Constraints

```txt
- Service must not import Prisma.
- Service must not import GraphQL decorators.
- Service must not import NestJS.
```

## Acceptance Criteria

```txt
- AdminPermissionService exists.
- ADMIN permissions work.
- MODERATOR permissions are limited.
- USER is denied.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add admin permission service
```

---

# TASK-12.04 Add admin repository ports

## Status

DONE

## Context

Admin use cases must depend on repository ports, not Prisma.

## Goal

Add repository ports for admin users, admin decks, and analytics.

## Files to Create

```txt
apps/api/src/modules/admin/application/ports/admin-user-repository.port.ts
apps/api/src/modules/admin/application/ports/admin-deck-repository.port.ts
apps/api/src/modules/admin/application/ports/admin-analytics-repository.port.ts
```

## Requirements

Create `AdminUserRepositoryPort`:

```ts
import { AdminUserSummary } from '../../domain/types'

export const ADMIN_USER_REPOSITORY = Symbol('ADMIN_USER_REPOSITORY')

export type AdminSearchUsersInput = {
  query?: string | null
  limit: number
  offset: number
}

export type AdminSearchUsersResult = {
  items: AdminUserSummary[]
  total: number
}

export type AdminUserRepositoryPort = {
  searchUsers(input: AdminSearchUsersInput): Promise<AdminSearchUsersResult>
  findById(userId: string): Promise<AdminUserSummary | null>
  blockUser(userId: string, blockedAt: Date): Promise<AdminUserSummary>
  unblockUser(userId: string): Promise<AdminUserSummary>
}
```

Create `AdminDeckRepositoryPort`:

```ts
import { DeckModerationStatus } from '../../../decks/domain/types'
import { ModerationDeck } from '../../domain/types'

export const ADMIN_DECK_REPOSITORY = Symbol('ADMIN_DECK_REPOSITORY')

export type ModerationQueueInput = {
  status?: DeckModerationStatus | null
  limit: number
  offset: number
}

export type ModerationQueueResult = {
  items: ModerationDeck[]
  total: number
}

export type AdminDeckRepositoryPort = {
  moderationQueue(input: ModerationQueueInput): Promise<ModerationQueueResult>
  setModerationStatus(input: {
    deckId: string
    status: DeckModerationStatus
  }): Promise<ModerationDeck>
  setOfficial(input: { deckId: string; isOfficial: boolean }): Promise<ModerationDeck>
}
```

Create `AdminAnalyticsRepositoryPort`:

```ts
import { AdminDashboardStats } from '../../domain/types'

export const ADMIN_ANALYTICS_REPOSITORY = Symbol('ADMIN_ANALYTICS_REPOSITORY')

export type AdminAnalyticsRepositoryPort = {
  getDashboardStats(input: { now: Date }): Promise<AdminDashboardStats>
}
```

## Security Requirements

```txt
- Repository ports must not expose passwordHash.
- Repository ports must not expose token hashes.
- Use cases enforce role permissions.
```

## Architecture Constraints

```txt
- Ports must not import Prisma.
- Ports must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- AdminUserRepositoryPort exists.
- AdminDeckRepositoryPort exists.
- AdminAnalyticsRepositoryPort exists.
- Ports are framework-independent.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add admin repository ports
```

---

# TASK-12.05 Add Prisma admin user repository

## Status

DONE

## Context

Admin user management needs safe user persistence access.

## Goal

Add Prisma implementation of `AdminUserRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/admin/infrastructure/persistence/prisma-admin-user.repository.ts
apps/api/src/modules/admin/infrastructure/mappers/admin-user.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Implement:

```txt
searchUsers
findById
blockUser
unblockUser
```

`searchUsers` behavior:

```txt
- optional query searches email with case-insensitive contains
- order by createdAt descending
- limit max 50
- offset min 0
```

`blockUser`:

```txt
blockedAt = provided blockedAt
```

`unblockUser`:

```txt
blockedAt = null
```

Mapper must return `AdminUserSummary` only.

## Security Requirements

```txt
- Do not return passwordHash.
- Do not return refresh token hashes.
- Do not return reset/verification token hashes.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on AdminUserRepositoryPort.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaAdminUserRepository exists.
- Admin user mapper exists.
- Provider is registered.
- Sensitive fields are excluded.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add Prisma admin user repository
```

---

# TASK-12.06 Add Prisma admin deck repository

## Status

DONE

## Context

Moderation needs deck persistence access with safe moderation data.

## Goal

Add Prisma implementation of `AdminDeckRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/admin/infrastructure/persistence/prisma-admin-deck.repository.ts
apps/api/src/modules/admin/infrastructure/mappers/moderation-deck.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Implement:

```txt
moderationQueue
setModerationStatus
setOfficial
```

`moderationQueue` behavior:

```txt
- exclude deleted decks
- optional status filter
- include owner email
- include card count
- order by updatedAt descending
- limit max 50
- offset min 0
```

`setModerationStatus` allowed statuses:

```txt
APPROVED
REJECTED
HIDDEN
```

`setOfficial`:

```txt
isOfficial = provided boolean
```

Mapper returns `ModerationDeck`.

## Security Requirements

```txt
- Repository does not decide moderator/admin permissions.
- Use cases enforce permissions.
- Do not expose owner sensitive fields beyond safe email.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on AdminDeckRepositoryPort.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaAdminDeckRepository exists.
- Moderation deck mapper exists.
- Provider is registered.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add Prisma admin deck repository
```

---

# TASK-12.07 Add Prisma analytics repository

## Status

DONE

## Context

Admin dashboard needs platform-level counts.

## Goal

Add Prisma implementation of `AdminAnalyticsRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/admin/infrastructure/persistence/prisma-admin-analytics.repository.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Implement:

```txt
getDashboardStats
```

Stats:

```txt
totalUsers
totalDecks
totalPublicDecks
totalCards
totalStudySessions
totalReviews
usersCreatedLast7Days
decksCreatedLast7Days
reviewsSubmittedLast7Days
```

Counting rules:

```txt
- totalDecks excludes deleted decks
- totalPublicDecks counts PUBLIC + APPROVED + non-deleted decks
- totalCards excludes deleted cards
- createdLast7Days uses now - 7 days
```

## Security Requirements

```txt
- Do not return user-specific private data.
- Aggregate counts only.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on AdminAnalyticsRepositoryPort.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaAdminAnalyticsRepository exists.
- Dashboard stats are implemented.
- Provider is registered.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add Prisma analytics repository
```

---

# TASK-12.08 Add admin GraphQL types and inputs

## Status

DONE

## Context

GraphQL needs safe admin outputs and inputs.

## Goal

Add admin GraphQL types and inputs.

## Files to Create

```txt
apps/api/src/modules/admin/presentation/graphql/types/admin-user-summary.type.ts
apps/api/src/modules/admin/presentation/graphql/types/admin-dashboard-stats.type.ts
apps/api/src/modules/admin/presentation/graphql/types/moderation-deck.type.ts
apps/api/src/modules/admin/presentation/graphql/types/admin-user-search-result.type.ts
apps/api/src/modules/admin/presentation/graphql/types/moderation-queue-result.type.ts

apps/api/src/modules/admin/presentation/graphql/inputs/admin-search-users.input.ts
apps/api/src/modules/admin/presentation/graphql/inputs/moderation-queue.input.ts
```

## Requirements

`AdminUserSummaryType`:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
updatedAt
```

`AdminDashboardStatsType`:

```txt
totalUsers
totalDecks
totalPublicDecks
totalCards
totalStudySessions
totalReviews
usersCreatedLast7Days
decksCreatedLast7Days
reviewsSubmittedLast7Days
```

`ModerationDeckType`:

```txt
id
ownerId
ownerEmail
title
description
visibility
moderationStatus
isOfficial
sourceDeckId
cardCount
createdAt
updatedAt
```

Search result types:

```txt
AdminUserSearchResultType:
- items
- total

ModerationQueueResultType:
- items
- total
```

Inputs:

```txt
AdminSearchUsersInput:
- query optional nullable
- limit optional
- offset optional

ModerationQueueInput:
- status optional nullable
- limit optional
- offset optional
```

## Security Requirements

GraphQL types must not expose:

```txt
passwordHash
refreshTokenHash
emailVerificationTokenHash
passwordResetTokenHash
push token values
```

## Acceptance Criteria

```txt
- Admin GraphQL types exist.
- Admin GraphQL inputs exist.
- Sensitive fields are excluded.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(admin): add admin GraphQL types
```

---

# TASK-12.09 Add AdminDashboardStatsUseCase

## Status

DONE

## Context

Admins need dashboard-level aggregate stats.

## Goal

Add `AdminDashboardStatsUseCase`.

## Files to Create

```txt
apps/api/src/modules/admin/application/use-cases/admin-dashboard-stats.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Input:

```ts
export type AdminDashboardStatsUseCaseInput = {
  currentUser: AuthUser
}
```

Output:

```ts
export type AdminDashboardStatsUseCaseResult = AdminDashboardStats
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Check AdminPermissionService.canAccessAdmin.
3. If forbidden, throw FORBIDDEN.
4. Load dashboard stats.
5. Return stats.
```

## Security Requirements

```txt
- ADMIN only.
- MODERATOR cannot access dashboard stats unless policy changes.
- USER cannot access dashboard stats.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- AdminDashboardStatsUseCase exists.
- ADMIN can access stats.
- MODERATOR is rejected.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add dashboard stats use case
```

---

# TASK-12.10 Add adminDashboardStats query

## Status

DONE

## Context

Frontend admin UI needs dashboard stats.

## Goal

Add protected `adminDashboardStats` query.

## Files to Create

```txt
apps/api/src/modules/admin/presentation/graphql/resolvers/admin.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Add query:

```graphql
adminDashboardStats: AdminDashboardStatsType!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call AdminDashboardStatsUseCase
- return stats
```

Resolver must not:

```txt
- query Prisma
- calculate stats directly
- check roles directly
```

## Acceptance Criteria

```txt
- adminDashboardStats query exists.
- Query requires auth.
- ADMIN can access.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add dashboard stats query
```

---

# TASK-12.11 Add AdminSearchUsersUseCase

## Status

DONE

## Context

Admins need to search users safely.

## Goal

Add `AdminSearchUsersUseCase`.

## Files to Create

```txt
apps/api/src/modules/admin/application/use-cases/admin-search-users.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Input:

```ts
export type AdminSearchUsersUseCaseInput = {
  currentUser: AuthUser
  query?: string | null
  limit?: number
  offset?: number
}
```

Output:

```ts
export type AdminSearchUsersUseCaseResult = {
  items: AdminUserSummary[]
  total: number
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Check AdminPermissionService.canManageUsers.
3. If forbidden, throw FORBIDDEN.
4. Normalize query.
5. Clamp limit.
6. Normalize offset.
7. Search users.
8. Return safe user summaries.
```

Limit rules:

```txt
default limit = 20
max limit = 50
min limit = 1
```

## Security Requirements

```txt
- ADMIN only.
- Do not expose passwordHash.
- Do not expose token hashes.
```

## Acceptance Criteria

```txt
- AdminSearchUsersUseCase exists.
- ADMIN can search users.
- MODERATOR is rejected.
- USER is rejected.
- Sensitive fields are excluded.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add user search use case
```

---

# TASK-12.12 Add adminSearchUsers query

## Status

DONE

## Context

Frontend admin UI needs user search.

## Goal

Add protected `adminSearchUsers` query.

## Files to Modify

```txt
apps/api/src/modules/admin/presentation/graphql/resolvers/admin.resolver.ts
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Add query:

```graphql
adminSearchUsers(input: AdminSearchUsersInput): AdminUserSearchResultType!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call AdminSearchUsersUseCase
- return safe user summaries
```

Resolver must not:

```txt
- query Prisma
- check roles directly
```

## Acceptance Criteria

```txt
- adminSearchUsers query exists.
- Query requires auth.
- ADMIN can search users.
- MODERATOR/USER are rejected.
- Sensitive fields are not returned.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add user search query
```

---

# TASK-12.13 Add BlockUserUseCase

## Status

DONE

## Context

Admins need to block abusive or unsafe users.

Blocked users cannot login, refresh, or use protected operations.

## Goal

Add `BlockUserUseCase`.

## Files to Create

```txt
apps/api/src/modules/admin/application/use-cases/block-user.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Input:

```ts
export type BlockUserUseCaseInput = {
  currentUser: AuthUser
  userId: string
}
```

Output:

```ts
export type BlockUserUseCaseResult = AdminUserSummary
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Check AdminPermissionService.canManageUsers.
3. If forbidden, throw FORBIDDEN.
4. Prevent admin from blocking self.
5. Load target user.
6. If target missing, throw USER_NOT_FOUND.
7. Set blockedAt.
8. Revoke all active refresh tokens for target user.
9. Return safe user summary.
```

## Security Requirements

```txt
- ADMIN only.
- MODERATOR cannot block.
- USER cannot block.
- Blocking revokes refresh tokens.
- Blocked users cannot refresh/login/use protected ops.
```

## Architecture Constraints

```txt
- Use case depends on admin user repository and refresh token repository.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- BlockUserUseCase exists.
- ADMIN can block user.
- MODERATOR is rejected.
- USER is rejected.
- Self-block is rejected.
- Refresh tokens are revoked.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add block user use case
```

---

# TASK-12.14 Add blockUser mutation

## Status

DONE

## Context

Frontend admin UI needs a mutation to block users.

## Goal

Add protected `blockUser` mutation.

## Files to Modify

```txt
apps/api/src/modules/admin/presentation/graphql/resolvers/admin.resolver.ts
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Add mutation:

```graphql
blockUser(userId: ID!): AdminUserSummaryType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call BlockUserUseCase
- return safe user summary
```

Resolver must not:

```txt
- query Prisma
- check roles directly
- revoke tokens directly
```

## Acceptance Criteria

```txt
- blockUser mutation exists.
- Mutation requires auth.
- ADMIN can block user.
- MODERATOR/USER are rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add block user mutation
```

---

# TASK-12.15 Add UnblockUserUseCase

## Status

DONE

## Context

Admins need to unblock users.

## Goal

Add `UnblockUserUseCase`.

## Files to Create

```txt
apps/api/src/modules/admin/application/use-cases/unblock-user.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Input:

```ts
export type UnblockUserUseCaseInput = {
  currentUser: AuthUser
  userId: string
}
```

Output:

```ts
export type UnblockUserUseCaseResult = AdminUserSummary
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Check AdminPermissionService.canManageUsers.
3. If forbidden, throw FORBIDDEN.
4. Load target user.
5. If target missing, throw USER_NOT_FOUND.
6. Set blockedAt to null.
7. Return safe user summary.
```

## Security Requirements

```txt
- ADMIN only.
- MODERATOR cannot unblock.
- USER cannot unblock.
```

## Acceptance Criteria

```txt
- UnblockUserUseCase exists.
- ADMIN can unblock user.
- MODERATOR is rejected.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add unblock user use case
```

---

# TASK-12.16 Add unblockUser mutation

## Status

DONE

## Context

Frontend admin UI needs a mutation to unblock users.

## Goal

Add protected `unblockUser` mutation.

## Files to Modify

```txt
apps/api/src/modules/admin/presentation/graphql/resolvers/admin.resolver.ts
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Add mutation:

```graphql
unblockUser(userId: ID!): AdminUserSummaryType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call UnblockUserUseCase
- return safe user summary
```

Resolver must not:

```txt
- query Prisma
- check roles directly
```

## Acceptance Criteria

```txt
- unblockUser mutation exists.
- Mutation requires auth.
- ADMIN can unblock user.
- MODERATOR/USER are rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add unblock user mutation
```

---

# TASK-12.17 Add ModerationQueueUseCase

## Status

DONE

## Context

Moderators/admins need to view decks requiring moderation.

## Goal

Add `ModerationQueueUseCase`.

## Files to Create

```txt
apps/api/src/modules/admin/application/use-cases/moderation-queue.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Input:

```ts
export type ModerationQueueUseCaseInput = {
  currentUser: AuthUser
  status?: DeckModerationStatus | null
  limit?: number
  offset?: number
}
```

Output:

```ts
export type ModerationQueueUseCaseResult = {
  items: ModerationDeck[]
  total: number
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Check AdminPermissionService.canModerateDecks.
3. If forbidden, throw FORBIDDEN.
4. Normalize status.
5. Clamp limit.
6. Normalize offset.
7. Load moderation queue.
8. Return result.
```

Limit rules:

```txt
default limit = 20
max limit = 50
min limit = 1
```

Allowed status filters:

```txt
PENDING
APPROVED
REJECTED
HIDDEN
```

## Security Requirements

```txt
- ADMIN or MODERATOR only.
- USER cannot access moderation queue.
```

## Acceptance Criteria

```txt
- ModerationQueueUseCase exists.
- ADMIN can access queue.
- MODERATOR can access queue.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add moderation queue use case
```

---

# TASK-12.18 Add moderationQueue query

## Status

DONE

## Context

Frontend moderation UI needs a moderation queue.

## Goal

Add protected `moderationQueue` query.

## Files to Modify

```txt
apps/api/src/modules/admin/presentation/graphql/resolvers/admin.resolver.ts
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Add query:

```graphql
moderationQueue(input: ModerationQueueInput): ModerationQueueResultType!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call ModerationQueueUseCase
- return moderation decks
```

Resolver must not:

```txt
- query Prisma
- check roles directly
```

## Acceptance Criteria

```txt
- moderationQueue query exists.
- Query requires auth.
- ADMIN/MODERATOR can access.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add moderation queue query
```

---

# TASK-12.19 Add ModerateDeckUseCase

## Status

DONE

## Context

Admins and moderators need to approve, reject, or hide public decks.

## Goal

Add `ModerateDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/admin/application/use-cases/moderate-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Input:

```ts
export type ModerateDeckAction = 'APPROVE' | 'REJECT' | 'HIDE'

export type ModerateDeckUseCaseInput = {
  currentUser: AuthUser
  deckId: string
  action: ModerateDeckAction
}
```

Output:

```ts
export type ModerateDeckUseCaseResult = ModerationDeck
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Check AdminPermissionService.canModerateDecks.
3. If forbidden, throw FORBIDDEN.
4. Map action to moderationStatus.
5. Update deck moderation status.
6. Return moderation deck.
```

Action mapping:

```txt
APPROVE -> APPROVED
REJECT  -> REJECTED
HIDE    -> HIDDEN
```

## Security Requirements

```txt
- ADMIN or MODERATOR only.
- USER cannot moderate decks.
- MODERATOR can moderate decks.
```

## Acceptance Criteria

```txt
- ModerateDeckUseCase exists.
- ADMIN can approve/reject/hide.
- MODERATOR can approve/reject/hide.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add deck moderation use case
```

---

# TASK-12.20 Add approve/reject/hide deck mutations

## Status

DONE

## Context

Frontend moderation UI needs mutations for deck moderation actions.

## Goal

Add protected moderation mutations.

## Files to Modify

```txt
apps/api/src/modules/admin/presentation/graphql/resolvers/admin.resolver.ts
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Add mutations:

```graphql
approveDeck(deckId: ID!): ModerationDeckType!
rejectDeck(deckId: ID!): ModerationDeckType!
hideDeck(deckId: ID!): ModerationDeckType!
```

Each mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call ModerateDeckUseCase with proper action
- return moderation deck
```

Resolver must not:

```txt
- query Prisma
- check roles directly
- update moderation status directly
```

## Acceptance Criteria

```txt
- approveDeck mutation exists.
- rejectDeck mutation exists.
- hideDeck mutation exists.
- ADMIN/MODERATOR can use them.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add deck moderation mutations
```

---

# TASK-12.21 Add SetOfficialDeckUseCase

## Status

DONE

## Context

Admins can mark high-quality decks as official.

Moderators cannot set official decks.

## Goal

Add `SetOfficialDeckUseCase`.

## Files to Create

```txt
apps/api/src/modules/admin/application/use-cases/set-official-deck.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Input:

```ts
export type SetOfficialDeckUseCaseInput = {
  currentUser: AuthUser
  deckId: string
  isOfficial: boolean
}
```

Output:

```ts
export type SetOfficialDeckUseCaseResult = ModerationDeck
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Check AdminPermissionService.canSetOfficialDeck.
3. If forbidden, throw FORBIDDEN.
4. Set deck isOfficial value.
5. Return moderation deck.
```

## Security Requirements

```txt
- ADMIN only.
- MODERATOR cannot set official deck.
- USER cannot set official deck.
```

## Acceptance Criteria

```txt
- SetOfficialDeckUseCase exists.
- ADMIN can set/unset official deck.
- MODERATOR is rejected.
- USER is rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add official deck use case
```

---

# TASK-12.22 Add setOfficialDeck mutation

## Status

DONE

## Context

Frontend admin UI needs a mutation to set/unset official decks.

## Goal

Add protected `setOfficialDeck` mutation.

## Files to Modify

```txt
apps/api/src/modules/admin/presentation/graphql/resolvers/admin.resolver.ts
apps/api/src/modules/admin/admin.module.ts
```

## Requirements

Add mutation:

```graphql
setOfficialDeck(deckId: ID!, isOfficial: Boolean!): ModerationDeckType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call SetOfficialDeckUseCase
- return moderation deck
```

Resolver must not:

```txt
- query Prisma
- check roles directly
- update isOfficial directly
```

## Acceptance Criteria

```txt
- setOfficialDeck mutation exists.
- Mutation requires auth.
- ADMIN can set/unset official.
- MODERATOR/USER are rejected.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(admin): add official deck mutation
```

---

# TASK-12.23 Add admin and analytics final checks

## Status

DONE

## Context

Admin features are high-risk and must be verified carefully.

## Goal

Run final checks for admin, moderation, and analytics.

## Manual GraphQL Checks

Verify:

```txt
- adminDashboardStats requires auth
- adminDashboardStats works for ADMIN
- adminDashboardStats rejects MODERATOR
- adminDashboardStats rejects USER
- adminSearchUsers works for ADMIN
- adminSearchUsers rejects MODERATOR
- blockUser works for ADMIN
- blockUser rejects MODERATOR
- blockUser rejects USER
- blockUser revokes target refresh tokens
- blocked user cannot refresh/login/use protected operations
- unblockUser works for ADMIN
- moderationQueue works for ADMIN
- moderationQueue works for MODERATOR
- moderationQueue rejects USER
- approveDeck works for ADMIN
- approveDeck works for MODERATOR
- rejectDeck works for ADMIN/MODERATOR
- hideDeck works for ADMIN/MODERATOR
- setOfficialDeck works for ADMIN
- setOfficialDeck rejects MODERATOR
```

## Security Checks

Verify:

```txt
- passwordHash is never exposed.
- refresh token hashes are never exposed.
- reset/verification token hashes are never exposed.
- push tokens are never exposed.
- Resolvers do not access Prisma directly.
- Role checks are in use cases/services, not frontend.
- MODERATOR cannot block users.
- MODERATOR cannot set official decks.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
```

## Do Not Do

```txt
- Do not move to frontend foundation until admin checks pass.
- Do not expose sensitive fields for admin convenience.
- Do not rely on frontend role hiding for security.
```

## Acceptance Criteria

```txt
- Admin dashboard stats work.
- Admin user search works.
- User blocking works.
- User unblocking works.
- Deck moderation works.
- Official deck setting works.
- Role permissions are correct.
- Sensitive fields are not exposed.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(admin): finalize admin and analytics
```

---

# TASK-12.24 Add admin unit tests

## Status

DONE

## Context

Admin, moderation, and analytics features are role-sensitive and security-critical. Manual GraphQL checks in TASK-12.23 are not enough to prevent regressions in ADMIN/MODERATOR/USER permission boundaries, user blocking rules, refresh token revocation, moderation actions, and safe admin output mapping.

`AdminPermissionService`, admin use cases, and mappers can be tested quickly without database, GraphQL, or Prisma.

## Goal

Add unit tests for EPIC-12 admin permission service, use cases, and mappers.

## Related Documents

```txt
docs/domain/permissions.md
docs/security/security-checklist.md
docs/backend-clean-architecture.md
docs/tasks/12-admin-analytics.md
docs/tasks/02-auth.md
docs/tasks/06-public-decks.md
```

## Files to Create

```txt
apps/api/src/modules/admin/domain/services/admin-permission.service.spec.ts
apps/api/src/modules/admin/application/use-cases/admin-dashboard-stats.use-case.spec.ts
apps/api/src/modules/admin/application/use-cases/admin-search-users.use-case.spec.ts
apps/api/src/modules/admin/application/use-cases/block-user.use-case.spec.ts
apps/api/src/modules/admin/application/use-cases/unblock-user.use-case.spec.ts
apps/api/src/modules/admin/application/use-cases/moderation-queue.use-case.spec.ts
apps/api/src/modules/admin/application/use-cases/moderate-deck.use-case.spec.ts
apps/api/src/modules/admin/application/use-cases/set-official-deck.use-case.spec.ts
apps/api/src/modules/admin/infrastructure/mappers/admin-user.mapper.spec.ts
apps/api/src/modules/admin/infrastructure/mappers/moderation-deck.mapper.spec.ts
```

## Requirements

Use Jest and co-located `*.spec.ts` files.

Mock all ports in use case tests. Do not use Prisma, database, or running GraphQL server.

Follow existing EPIC-05/07/10/11 use case test style (mocked repository ports, `jest.fn()`, helper factories for domain objects).

Do not test GraphQL resolvers in this task.

Do not test Prisma repositories in this task.

### AdminPermissionService

Cover:

```txt
- canAccessAdmin returns true for ADMIN
- canAccessAdmin returns false for MODERATOR
- canAccessAdmin returns false for USER
- canAccessAdmin returns false for null user
- canModerateDecks returns true for ADMIN
- canModerateDecks returns true for MODERATOR
- canModerateDecks returns false for USER
- canModerateDecks returns false for null user
- canManageUsers returns true for ADMIN
- canManageUsers returns false for MODERATOR
- canManageUsers returns false for USER
- canManageUsers returns false for null user
- canSetOfficialDeck returns true for ADMIN
- canSetOfficialDeck returns false for MODERATOR
- canSetOfficialDeck returns false for USER
- canSetOfficialDeck returns false for null user
```

### AdminDashboardStatsUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws FORBIDDEN for MODERATOR
- throws FORBIDDEN for USER
- loads dashboard stats for ADMIN via AdminAnalyticsRepositoryPort
- returns stats from repository
```

### AdminSearchUsersUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws FORBIDDEN for MODERATOR
- throws FORBIDDEN for USER
- normalizes blank query to null
- clamps limit (default 20, min 1, max 50)
- normalizes offset (default 0, min 0)
- searches users via AdminUserRepositoryPort.searchUsers
- returns safe user summaries without sensitive fields
```

### BlockUserUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws FORBIDDEN for MODERATOR
- throws FORBIDDEN for USER
- throws VALIDATION_ERROR when admin blocks self
- throws NOT_FOUND when target user is missing
- blocks target user via AdminUserRepositoryPort.blockUser
- revokes all refresh tokens for target user
- returns safe AdminUserSummary
```

### UnblockUserUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws FORBIDDEN for MODERATOR
- throws FORBIDDEN for USER
- throws NOT_FOUND when target user is missing
- unblocks target user via AdminUserRepositoryPort.unblockUser
- returns safe AdminUserSummary
- does not call RefreshTokenRepositoryPort
```

### ModerationQueueUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws FORBIDDEN for USER
- allows ADMIN access
- allows MODERATOR access
- normalizes invalid status filter to null
- clamps limit (default 20, min 1, max 50)
- normalizes offset (default 0, min 0)
- loads queue via AdminDeckRepositoryPort.moderationQueue
- returns moderation decks with ownerEmail and cardCount
```

### ModerateDeckUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws FORBIDDEN for USER
- allows ADMIN to approve/reject/hide
- allows MODERATOR to approve/reject/hide
- maps APPROVE to APPROVED status
- maps REJECT to REJECTED status
- maps HIDE to HIDDEN status
- throws DECK_NOT_FOUND when repository update fails
- returns ModerationDeck from repository
```

### SetOfficialDeckUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws FORBIDDEN for MODERATOR
- throws FORBIDDEN for USER
- sets isOfficial true for ADMIN
- sets isOfficial false for ADMIN
- throws DECK_NOT_FOUND when repository update fails
- returns ModerationDeck from repository
```

### admin-user.mapper

Cover:

```txt
- toAdminUserSummary maps all safe fields from Prisma record
- toAdminUserSummary casts role to UserRole enum
- mapper output does not include passwordHash or token fields
```

### moderation-deck.mapper

Cover:

```txt
- toModerationDeck maps deck fields from Prisma record
- toModerationDeck maps ownerEmail from joined owner
- toModerationDeck maps cardCount from _count.cards
- toModerationDeck casts visibility and moderationStatus enums
```

## Security Requirements

```txt
- Tests must assert MODERATOR cannot access dashboard stats.
- Tests must assert MODERATOR cannot search/block/unblock users.
- Tests must assert MODERATOR cannot set official decks.
- Tests must assert USER cannot access any admin use case.
- Tests must assert blockUser revokes refresh tokens for target user only.
- Tests must assert admin outputs do not include passwordHash or token hashes.
- Tests must assert unblockUser does not revoke refresh tokens.
```

## Architecture Constraints

```txt
- Unit tests only in this task.
- Mock ports; do not import Prisma client in use case tests.
- Do not test GraphQL resolvers in this task.
- Do not test Prisma repositories in this task.
- Do not add e2e tests in this task.
- Keep tests focused on business rules, not NestJS module wiring.
```

## Do Not Do

```txt
- Do not add integration tests with database.
- Do not add GraphQL e2e tests.
- Do not refactor use cases unless required to make them testable.
- Do not continue to EPIC-13 until this task passes.
```

## Acceptance Criteria

```txt
- AdminPermissionService unit tests exist and pass.
- All EPIC-12 admin use case unit tests exist and pass.
- Admin mapper unit tests exist and pass.
- Tests run without database.
- pnpm --filter @flashcards/api test passes.
- API builds.
- format check and lint pass.
```

## Commands to Run

```bash
CI=true pnpm --filter @flashcards/api test -- --watchman=false
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-12.24 Add admin unit tests
```

---

## Epic Completion Criteria

EPIC-12 is complete when:

```txt
- AdminModule exists.
- Admin domain types exist.
- AdminPermissionService exists.
- Admin repository ports exist.
- Prisma admin user repository exists.
- Prisma admin deck repository exists.
- Prisma analytics repository exists.
- Admin GraphQL types exist.
- AdminDashboardStatsUseCase exists.
- adminDashboardStats query works.
- AdminSearchUsersUseCase exists.
- adminSearchUsers query works.
- BlockUserUseCase exists.
- blockUser mutation works.
- UnblockUserUseCase exists.
- unblockUser mutation works.
- ModerationQueueUseCase exists.
- moderationQueue query works.
- ModerateDeckUseCase exists.
- approveDeck/rejectDeck/hideDeck mutations work.
- SetOfficialDeckUseCase exists.
- setOfficialDeck mutation works.
- ADMIN permissions are enforced.
- MODERATOR permissions are limited to moderation.
- sensitive fields are not exposed.
- implementation follows docs/domain/permissions.md.
- implementation follows docs/security/security-checklist.md.
- Admin unit tests exist and pass (TASK-12.24).
```

After EPIC-12 is complete (including TASK-12.24), move to:

```txt
docs/tasks/13-frontend-foundation.md
```

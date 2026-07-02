# EPIC-11 Notifications

## Epic Goal

Implement backend notification support for Flashcards.

This epic covers:

```txt
- push token registration
- push token removal
- user notification settings integration
- due card reminder job
- Expo push notification provider
- mock notification provider for local development
- internal scheduled job endpoint
```

Frontend notification permission UI is handled in:

```txt
docs/tasks/18-frontend-profile-settings-notifications.md
```

Deployment cron configuration is handled in:

```txt
docs/tasks/20-deployment-mvp.md
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
docs/domain/lesson-flow.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/04-user-profile-settings.md
docs/tasks/07-srs-lessons.md
```

## Epic Prerequisites

EPIC-07 should be complete.

Expected state:

```txt
- Auth works.
- GqlAuthGuard exists.
- CurrentUser decorator exists.
- UserSettings model exists.
- CardReviewState model exists.
- Deck/Card schema exists.
- Lessons and deck learning stats work.
- Backend config foundation exists.
```

## Epic Rules

```txt
1. Follow docs/security/security-checklist.md exactly.
2. Backend is the source of truth for notification sending.
3. Users can manage only their own push tokens.
4. Push tokens must not be exposed to other users.
5. Push provider calls happen only on backend.
6. Internal cron endpoint must require INTERNAL_JOB_SECRET.
7. Reminder job must respect user notification settings.
8. Do not put business logic in GraphQL resolvers.
9. Do not access Prisma directly from GraphQL resolvers.
10. Do not log secrets or raw auth tokens.
```

## MVP Notification Policy

MVP supports:

```txt
- Expo push notifications
- one or more push tokens per user
- daily due-card reminder job
- user setting notificationsEnabled
- user setting reminderTime
- user setting timezone
```

MVP does not support:

```txt
- email reminders
- in-app notification inbox
- advanced notification preferences
- per-deck reminder settings
- notification history UI
```

## Reminder Rule

A user is eligible for a due-card reminder when:

```txt
notificationsEnabled = true
has at least one active push token
has at least one due card
current time matches user's reminderTime and timezone window
```

For MVP cron simplicity:

```txt
- Scheduled job may run hourly.
- Job checks users whose local reminderTime falls within the current hour.
```

## Epic Summary

```md
- [x] TASK-11.01 Add notification Prisma schema
- [x] TASK-11.02 Add notifications module skeleton
- [x] TASK-11.03 Add notification domain types
- [x] TASK-11.04 Add push token repository port
- [x] TASK-11.05 Add Prisma push token repository
- [x] TASK-11.06 Add notification provider port
- [x] TASK-11.07 Add mock notification provider
- [x] TASK-11.08 Add Expo notification provider
- [x] TASK-11.09 Add notification GraphQL types and inputs
- [x] TASK-11.10 Add RegisterPushTokenUseCase
- [x] TASK-11.11 Add registerPushToken mutation
- [x] TASK-11.12 Add RemovePushTokenUseCase
- [x] TASK-11.13 Add removePushToken mutation
- [x] TASK-11.14 Add SendDueCardRemindersUseCase
- [x] TASK-11.15 Add internal reminder job endpoint
- [x] TASK-11.16 Add notifications final checks
- [x] TASK-11.17 Add notifications unit tests
```

---

# TASK-11.01 Add notification Prisma schema

## Status

DONE

## Context

The backend needs to store user device push tokens.

Push tokens are user-specific and must not be visible to other users.

## Goal

Add push token persistence model.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add relation to `User`:

```prisma
pushTokens PushToken[]
```

Add enum:

```prisma
enum PushProvider {
  EXPO
}
```

Add model:

```prisma
model PushToken {
  id          String       @id @default(uuid())
  userId      String
  provider    PushProvider @default(EXPO)
  token       String
  deviceId    String?
  platform    String?
  disabledAt  DateTime?

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  lastUsedAt  DateTime?

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, token])
  @@index([userId])
  @@index([provider])
  @@index([disabledAt])
}
```

## Security Requirements

```txt
- Push tokens belong to one user.
- Push tokens must not be exposed to other users.
- Do not log push tokens in production.
```

## Architecture Constraints

```txt
- This task only changes persistence schema.
- Do not implement provider logic yet.
- Do not implement GraphQL yet.
```

## Acceptance Criteria

```txt
- PushProvider enum exists.
- PushToken model exists.
- User has pushTokens relation.
- Prisma schema validates.
- Prisma client generates.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(db): add push token schema
```

---

# TASK-11.02 Add notifications module skeleton

## Status

DONE

## Context

Notification code should live in a dedicated backend module.

## Goal

Create notifications module folder structure.

## Files to Create

```txt
apps/api/src/modules/notifications/notifications.module.ts

apps/api/src/modules/notifications/domain/.gitkeep
apps/api/src/modules/notifications/domain/types/.gitkeep
apps/api/src/modules/notifications/domain/services/.gitkeep

apps/api/src/modules/notifications/application/.gitkeep
apps/api/src/modules/notifications/application/ports/.gitkeep
apps/api/src/modules/notifications/application/use-cases/.gitkeep

apps/api/src/modules/notifications/infrastructure/.gitkeep
apps/api/src/modules/notifications/infrastructure/providers/.gitkeep
apps/api/src/modules/notifications/infrastructure/persistence/.gitkeep
apps/api/src/modules/notifications/infrastructure/mappers/.gitkeep

apps/api/src/modules/notifications/presentation/.gitkeep
apps/api/src/modules/notifications/presentation/graphql/.gitkeep
apps/api/src/modules/notifications/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/notifications/presentation/graphql/types/.gitkeep
apps/api/src/modules/notifications/presentation/graphql/resolvers/.gitkeep
apps/api/src/modules/notifications/presentation/http/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `NotificationsModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class NotificationsModule {}
```

Import `NotificationsModule` into `AppModule`.

## Acceptance Criteria

```txt
- NotificationsModule exists.
- NotificationsModule is imported into AppModule.
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
chore(notifications): add notifications module skeleton
```

---

# TASK-11.03 Add notification domain types

## Status

DONE

## Context

Notification use cases need framework-independent types.

## Goal

Add notification domain types.

## Files to Create

```txt
apps/api/src/modules/notifications/domain/types/push-provider.type.ts
apps/api/src/modules/notifications/domain/types/push-token.type.ts
apps/api/src/modules/notifications/domain/types/push-message.type.ts
apps/api/src/modules/notifications/domain/types/index.ts
```

## Requirements

Create `PushProvider`:

```ts
export type PushProvider = 'EXPO'
```

Create `PushToken`:

```ts
import { PushProvider } from './push-provider.type'

export type PushToken = {
  id: string
  userId: string
  provider: PushProvider
  token: string
  deviceId: string | null
  platform: string | null
  disabledAt: Date | null
  createdAt: Date
  updatedAt: Date
  lastUsedAt: Date | null
}
```

Create `PushMessage`:

```ts
export type PushMessage = {
  to: string
  title: string
  body: string
  data?: Record<string, string>
}
```

## Security Requirements

```txt
- PushToken type is backend-internal.
- Do not expose push tokens to other users.
- Do not include auth tokens in push message data.
```

## Architecture Constraints

```txt
- Types must not import Prisma.
- Types must not import GraphQL decorators.
- Types must not import NestJS.
```

## Acceptance Criteria

```txt
- PushProvider type exists.
- PushToken type exists.
- PushMessage type exists.
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
chore(notifications): add notification domain types
```

---

# TASK-11.04 Add push token repository port

## Status

DONE

## Context

Use cases must depend on repository ports, not Prisma.

## Goal

Add push token repository port.

## Files to Create

```txt
apps/api/src/modules/notifications/application/ports/push-token-repository.port.ts
```

## Requirements

Create port:

```ts
import { PushToken } from '../../domain/types'

export const PUSH_TOKEN_REPOSITORY = Symbol('PUSH_TOKEN_REPOSITORY')

export type RegisterPushTokenInput = {
  userId: string
  token: string
  deviceId?: string | null
  platform?: string | null
}

export type PushTokenRepositoryPort = {
  register(input: RegisterPushTokenInput): Promise<PushToken>
  findActiveByUserId(userId: string): Promise<PushToken[]>
  findActiveForUsers(userIds: string[]): Promise<PushToken[]>
  disable(input: { userId: string; token: string }): Promise<void>
  markUsed(tokenId: string, usedAt: Date): Promise<void>
}
```

## Security Requirements

```txt
- Repository port does not expose tokens to GraphQL.
- Use cases enforce token ownership.
```

## Architecture Constraints

```txt
- Port must not import Prisma.
- Port must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- PushTokenRepositoryPort exists.
- Port is framework-independent.
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
chore(notifications): add push token repository port
```

---

# TASK-11.05 Add Prisma push token repository

## Status

DONE

## Context

Push token persistence should be implemented through Prisma infrastructure.

## Goal

Add Prisma implementation of `PushTokenRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/notifications/infrastructure/persistence/prisma-push-token.repository.ts
apps/api/src/modules/notifications/infrastructure/mappers/push-token.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
```

## Requirements

Implement:

```txt
register
findActiveByUserId
findActiveForUsers
disable
markUsed
```

`register` behavior:

```txt
- upsert by userId + token
- provider = EXPO
- disabledAt = null
- update deviceId/platform if provided
```

`findActiveByUserId`:

```txt
- userId matches
- disabledAt = null
```

`disable`:

```txt
- userId matches
- token matches
- set disabledAt = now
```

## Security Requirements

```txt
- User can disable only own token.
- Do not log push token values.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on PushTokenRepositoryPort.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaPushTokenRepository exists.
- Mapper exists.
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
chore(notifications): add Prisma push token repository
```

---

# TASK-11.06 Add notification provider port

## Status

DONE

## Context

Push sending should be abstracted behind a provider port.

## Goal

Add notification provider port.

## Files to Create

```txt
apps/api/src/modules/notifications/application/ports/push-notification-provider.port.ts
```

## Requirements

Create port:

```ts
import { PushMessage } from '../../domain/types'

export const PUSH_NOTIFICATION_PROVIDER = Symbol('PUSH_NOTIFICATION_PROVIDER')

export type PushSendResult = {
  successCount: number
  failureCount: number
  invalidTokens: string[]
}

export type PushNotificationProviderPort = {
  send(messages: PushMessage[]): Promise<PushSendResult>
}
```

## Security Requirements

```txt
- Provider must not expose secrets.
- Push message data must not include auth tokens.
```

## Architecture Constraints

```txt
- Port lives in application layer.
- Port must not import Prisma.
- Port must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- PushNotificationProviderPort exists.
- PushSendResult exists.
- Port is framework-independent.
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
chore(notifications): add push provider port
```

---

# TASK-11.07 Add mock notification provider

## Status

DONE

## Context

Local development should work without sending real push notifications.

## Goal

Add mock push notification provider.

## Files to Create

```txt
apps/api/src/modules/notifications/infrastructure/providers/mock-push-notification.provider.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
```

## Requirements

Create `MockPushNotificationProvider` implementing `PushNotificationProviderPort`.

Behavior:

```txt
- log message count
- log safe title/body preview
- return all messages as successful
- do not call external service
```

Register it when:

```txt
PUSH_PROVIDER=mock
```

For early MVP, it is acceptable to register mock provider unconditionally until Expo provider is added.

## Security Requirements

```txt
- Do not log auth tokens.
- Do not log secrets.
- Do not log full push token values.
```

## Acceptance Criteria

```txt
- Mock provider exists.
- Mock provider implements port.
- Provider can be registered.
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
chore(notifications): add mock push provider
```

---

# TASK-11.08 Add Expo notification provider

## Status

DONE

## Context

Expo Notifications is the MVP push provider.

## Goal

Add Expo push notification provider.

## Files to Create

```txt
apps/api/src/modules/notifications/infrastructure/providers/expo-push-notification.provider.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
apps/api/src/config/app.config.ts
apps/api/package.json
```

## Requirements

Install Expo server SDK:

```bash
pnpm --filter @flashcards/api add expo-server-sdk
```

Create `ExpoPushNotificationProvider` implementing `PushNotificationProviderPort`.

Provider must:

```txt
1. Validate Expo push token format where possible.
2. Chunk messages using Expo SDK.
3. Send notifications.
4. Return success/failure counts.
5. Return invalid tokens when provider says token is invalid.
```

Provider selection:

```txt
PUSH_PROVIDER=mock -> MockPushNotificationProvider
PUSH_PROVIDER=expo -> ExpoPushNotificationProvider
```

## Security Requirements

```txt
- Do not put access/refresh tokens in push data.
- Do not log full push tokens.
- Do not log secrets.
```

## Architecture Constraints

```txt
- Expo provider lives in infrastructure.
- Use cases depend on PushNotificationProviderPort.
- No GraphQL decorators in provider.
```

## Acceptance Criteria

```txt
- Expo provider exists.
- Provider uses expo-server-sdk.
- Provider selection supports mock/expo.
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
feat(notifications): add Expo push provider
```

---

# TASK-11.09 Add notification GraphQL types and inputs

## Status

DONE

## Context

GraphQL needs safe inputs and outputs for registering and removing push tokens.

## Goal

Add notification GraphQL types and inputs.

## Files to Create

```txt
apps/api/src/modules/notifications/presentation/graphql/inputs/register-push-token.input.ts
apps/api/src/modules/notifications/presentation/graphql/inputs/remove-push-token.input.ts
apps/api/src/modules/notifications/presentation/graphql/types/register-push-token-payload.type.ts
```

## Requirements

Inputs:

```txt
RegisterPushTokenInput:
- token
- deviceId optional nullable
- platform optional nullable

RemovePushTokenInput:
- token
```

Payload:

```txt
RegisterPushTokenPayloadType:
- success
```

Do not expose push token values in payload.

## Security Requirements

```txt
- Do not return push token values.
- User manages only own tokens.
```

## Acceptance Criteria

```txt
- RegisterPushTokenInput exists.
- RemovePushTokenInput exists.
- RegisterPushTokenPayloadType exists.
- Push token value is not returned.
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
chore(notifications): add notification GraphQL types
```

---

# TASK-11.10 Add RegisterPushTokenUseCase

## Status

DONE

## Context

Frontend needs to register device push tokens after notification permission is granted.

## Goal

Add `RegisterPushTokenUseCase`.

## Files to Create

```txt
apps/api/src/modules/notifications/application/use-cases/register-push-token.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
```

## Requirements

Input:

```ts
export type RegisterPushTokenUseCaseInput = {
  currentUser: AuthUser
  token: string
  deviceId?: string | null
  platform?: string | null
}
```

Output:

```ts
export type RegisterPushTokenUseCaseResult = {
  success: boolean
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Validate token is not empty.
4. Validate platform length if provided.
5. Validate deviceId length if provided.
6. Register token for current user.
7. Return success.
```

Validation:

```txt
token:
- required
- max 500 characters

deviceId:
- optional
- max 200 characters

platform:
- optional
- max 50 characters
```

## Security Requirements

```txt
- User can register only own token.
- Do not log token.
- Do not return token in output.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- RegisterPushTokenUseCase exists.
- Authenticated user can register push token.
- Blocked user cannot register token.
- Token is not returned.
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
feat(notifications): add register push token use case
```

---

# TASK-11.11 Add registerPushToken mutation

## Status

DONE

## Context

Frontend needs a mutation to register push tokens.

## Goal

Add protected `registerPushToken` mutation.

## Files to Create

```txt
apps/api/src/modules/notifications/presentation/graphql/resolvers/notifications.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
```

## Requirements

Add mutation:

```graphql
registerPushToken(input: RegisterPushTokenInput!): RegisterPushTokenPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call RegisterPushTokenUseCase
- return success payload
```

Resolver must not:

```txt
- query Prisma
- log push token
```

## Security Requirements

```txt
- Must require auth.
- User can register only own push token.
- Do not return token value.
```

## Acceptance Criteria

```txt
- registerPushToken mutation exists.
- Mutation requires auth.
- Token is registered for current user.
- Token value is not returned.
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
feat(notifications): add register push token mutation
```

---

# TASK-11.12 Add RemovePushTokenUseCase

## Status

DONE

## Context

Users need to remove or disable their own push tokens.

This is used on logout, disabling notifications, or device token invalidation.

## Goal

Add `RemovePushTokenUseCase`.

## Files to Create

```txt
apps/api/src/modules/notifications/application/use-cases/remove-push-token.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
```

## Requirements

Input:

```ts
export type RemovePushTokenUseCaseInput = {
  currentUser: AuthUser
  token: string
}
```

Output:

```ts
export type RemovePushTokenUseCaseResult = {
  success: boolean
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Validate token is not empty.
4. Disable token for current user.
5. Return success.
```

Recommended behavior:

```txt
- idempotent
- if token does not exist for user, return success
```

## Security Requirements

```txt
- User can remove only own token.
- Do not reveal whether token belongs to another user.
- Do not log token.
```

## Architecture Constraints

```txt
- Use case depends on PushTokenRepositoryPort.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- RemovePushTokenUseCase exists.
- User can remove own token.
- Missing token returns success.
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
feat(notifications): add remove push token use case
```

---

# TASK-11.13 Add removePushToken mutation

## Status

DONE

## Context

Frontend needs a mutation to remove push tokens.

## Goal

Add protected `removePushToken` mutation.

## Files to Modify

```txt
apps/api/src/modules/notifications/presentation/graphql/resolvers/notifications.resolver.ts
apps/api/src/modules/notifications/notifications.module.ts
```

## Requirements

Add mutation:

```graphql
removePushToken(input: RemovePushTokenInput!): Boolean!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call RemovePushTokenUseCase
- return success boolean
```

Resolver must not:

```txt
- query Prisma
- log token
```

## Security Requirements

```txt
- Must require auth.
- User can remove only own token.
- Do not return token value.
```

## Acceptance Criteria

```txt
- removePushToken mutation exists.
- Mutation requires auth.
- Current user's token is disabled.
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
feat(notifications): add remove push token mutation
```

---

# TASK-11.14 Add SendDueCardRemindersUseCase

## Status

DONE

## Context

The system should remind users when they have due cards.

This use case is executed by an internal scheduled job.

## Goal

Add `SendDueCardRemindersUseCase`.

## Files to Create

```txt
apps/api/src/modules/notifications/application/use-cases/send-due-card-reminders.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
```

## Requirements

Input:

```ts
export type SendDueCardRemindersUseCaseInput = {
  now: Date
}
```

Output:

```ts
export type SendDueCardRemindersUseCaseResult = {
  checkedUsers: number
  notifiedUsers: number
  sentMessages: number
  failedMessages: number
}
```

Use case must:

```txt
1. Find users with notificationsEnabled = true.
2. Match users whose local reminderTime falls within current job window.
3. Check due cards for each user.
4. Load active push tokens for eligible users.
5. Send push messages through PushNotificationProviderPort.
6. Disable invalid push tokens if provider returns invalid tokens.
7. Return summary.
```

Message content:

```txt
title: Time to review
body: You have cards due for review.
```

Push data:

```txt
type = DUE_CARDS_REMINDER
```

Must not include:

```txt
- access token
- refresh token
- password
- sensitive user data
```

## Timezone Rule

Use user's settings:

```txt
timezone
reminderTime
```

For MVP:

```txt
- job may run hourly
- notify users whose local reminder hour matches now
```

## Security Requirements

```txt
- Internal use case only.
- Do not expose push tokens.
- Do not include secrets in push data.
- Do not log full push tokens.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
- Provider handles sending.
```

## Acceptance Criteria

```txt
- SendDueCardRemindersUseCase exists.
- User settings are respected.
- Due card check is user-specific.
- Push provider is used.
- Invalid tokens are disabled.
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
feat(notifications): add due card reminder use case
```

---

# TASK-11.15 Add internal reminder job endpoint

## Status

DONE

## Context

Render Free does not provide reliable always-on background workers.

MVP can use an HTTP endpoint called by GitHub Actions cron or another scheduler.

The endpoint must be protected by an internal job secret.

## Goal

Add internal HTTP endpoint to run due-card reminders.

## Files to Create

```txt
apps/api/src/modules/notifications/presentation/http/internal-notifications.controller.ts
apps/api/src/common/guards/internal-job.guard.ts
```

## Files to Modify

```txt
apps/api/src/modules/notifications/notifications.module.ts
apps/api/src/config/app.config.ts
apps/api/.env.example
```

## Requirements

Create endpoint:

```txt
POST /internal/jobs/due-card-reminders
```

Endpoint must:

```txt
- require x-internal-job-secret header
- compare with INTERNAL_JOB_SECRET
- call SendDueCardRemindersUseCase
- return job summary
```

Header:

```txt
x-internal-job-secret: <secret>
```

Update `.env.example` if needed:

```env
INTERNAL_JOB_SECRET="replace-with-dev-internal-job-secret"
```

## Security Requirements

```txt
- Endpoint must not be public without secret.
- Reject missing or invalid secret.
- Do not log secret.
- Do not accept secret from query params.
```

## Architecture Constraints

```txt
- HTTP controller delegates to use case.
- Controller must not query Prisma.
- Controller must not send push directly.
```

## Acceptance Criteria

```txt
- Internal endpoint exists.
- Missing secret is rejected.
- Invalid secret is rejected.
- Valid secret runs reminder use case.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

Manual test:

```bash
curl -X POST http://localhost:3000/internal/jobs/due-card-reminders \
  -H "x-internal-job-secret: replace-with-dev-internal-job-secret"
```

## Expected Commit Message

```txt
feat(notifications): add internal reminder job endpoint
```

---

# TASK-11.16 Add notifications final checks

## Status

DONE

## Context

Notifications involve user devices and internal job security.

## Goal

Run final checks for notifications.

## Manual GraphQL Checks

Verify:

```txt
- registerPushToken requires auth
- registerPushToken registers token for current user
- registerPushToken does not return token value
- removePushToken requires auth
- removePushToken disables current user's token
- user cannot remove another user's token
```

## Internal Job Checks

Verify:

```txt
- due-card reminder endpoint rejects missing secret
- due-card reminder endpoint rejects invalid secret
- due-card reminder endpoint works with valid secret
- job respects notificationsEnabled
- job respects reminderTime/timezone
- job sends only when user has due cards
- job does not include auth tokens in push data
```

## Security Checks

Verify:

```txt
- Push tokens are not logged.
- Push tokens are not exposed through GraphQL.
- INTERNAL_JOB_SECRET is not logged.
- INTERNAL_JOB_SECRET is not accepted via query string.
- Resolvers do not access Prisma directly.
- Internal controller does not access Prisma directly.
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
- Do not move to admin analytics until notification checks pass.
- Do not expose push tokens for frontend convenience.
- Do not leave internal job endpoint unprotected.
```

## Acceptance Criteria

```txt
- Push token registration works.
- Push token removal works.
- Due-card reminder job works.
- Internal endpoint is protected.
- Push tokens are not exposed.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(notifications): finalize notifications
```

---

# TASK-11.17 Add notifications unit tests

## Status

DONE

## Context

Push tokens and due-card reminders are security-sensitive. Manual GraphQL and internal job checks in TASK-11.16 are not enough to prevent regressions in token ownership, validation rules, reminder eligibility (timezone/hour/due count), invalid token cleanup, and internal job secret protection.

Use cases, providers, mapper, and `InternalJobGuard` can be tested quickly without database, GraphQL, Prisma, or real Expo push API calls.

## Goal

Add unit tests for EPIC-11 notification use cases, push providers, mapper, and internal job guard.

## Related Documents

```txt
docs/security/security-checklist.md
docs/backend-clean-architecture.md
docs/tasks/11-notifications.md
docs/tasks/04-user-profile-settings.md
docs/tasks/07-srs-lessons.md
```

## Files to Create

```txt
apps/api/src/modules/notifications/application/use-cases/register-push-token.use-case.spec.ts
apps/api/src/modules/notifications/application/use-cases/remove-push-token.use-case.spec.ts
apps/api/src/modules/notifications/application/use-cases/send-due-card-reminders.use-case.spec.ts
apps/api/src/modules/notifications/infrastructure/providers/mock-push-notification.provider.spec.ts
apps/api/src/modules/notifications/infrastructure/providers/expo-push-notification.provider.spec.ts
apps/api/src/modules/notifications/infrastructure/mappers/push-token.mapper.spec.ts
apps/api/src/common/guards/internal-job.guard.spec.ts
```

## Requirements

Use Jest and co-located `*.spec.ts` files.

Mock all ports in use case tests. Do not use Prisma, database, running GraphQL server, or real Expo push API.

Follow existing EPIC-05/07/09/10 use case test style (mocked repository ports, `jest.fn()`, helper factories for domain objects).

Do not test GraphQL resolvers in this task.

Do not test Prisma repositories in this task.

Do not test `InternalNotificationsController` HTTP wiring in this task.

### RegisterPushTokenUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws VALIDATION_ERROR when token is empty/whitespace
- throws VALIDATION_ERROR when token exceeds 500 characters
- throws VALIDATION_ERROR when deviceId exceeds 200 characters
- throws VALIDATION_ERROR when platform exceeds 50 characters
- trims token, deviceId, and platform
- converts blank deviceId/platform to null
- registers token for current user via PushTokenRepositoryPort.register
- returns success true
```

### RemovePushTokenUseCase

Cover:

```txt
- throws UNAUTHORIZED when user is missing
- throws USER_BLOCKED when user is blocked
- throws VALIDATION_ERROR when token is empty/whitespace
- trims token before disable
- disables token for current user only via PushTokenRepositoryPort.disable
- returns success true
```

### SendDueCardRemindersUseCase

Cover:

```txt
- returns zero notified/sent counts when no users match reminder hour
- skips users whose local hour does not match reminderTime/timezone
- includes users whose local hour matches reminderTime/timezone
- skips users with zero due cards
- notifies users with due cards and active push tokens
- skips users with due cards but no active push tokens
- builds push messages with DUE_CARDS_REMINDER data type only
- does not include auth tokens or secrets in push message data
- sends messages through PushNotificationProviderPort
- disables invalid tokens returned by provider
- marks sent tokens as used via PushTokenRepositoryPort.markUsed
- aggregates checkedUsers, notifiedUsers, sentMessages, failedMessages correctly
- handles provider failures without throwing when send returns failures
```

Use fixed `Date` inputs and explicit timezone/reminderTime settings in test fixtures.

### MockPushNotificationProvider

Cover:

```txt
- returns successCount equal to message count
- returns zero failureCount and empty invalidTokens
- handles empty message array
```

### ExpoPushNotificationProvider

Cover:

```txt
- treats non-Expo tokens as invalid without calling Expo send API
- returns invalidTokens for malformed token values
- maps valid Expo tokens and aggregates ticket success/failure counts
- collects DeviceNotRegistered tokens as invalidTokens
- handles Expo chunk send errors by counting failures without throwing
```

Mock `expo-server-sdk` (`Expo.isExpoPushToken`, `chunkPushNotifications`, `sendPushNotificationsAsync`). Do not call real Expo API.

### push-token.mapper

Cover:

```txt
- toPushToken maps all fields from Prisma record
- toPushToken casts provider to PushProvider enum
```

### InternalJobGuard

Cover:

```txt
- throws UnauthorizedException when header is missing
- throws UnauthorizedException when configured secret is empty
- throws UnauthorizedException when header does not match configured secret
- allows request when header matches configured secret
```

Mock `ConfigService` and HTTP request context. Do not accept secret via query string in tests.

## Security Requirements

```txt
- Tests must assert users can register/disable only their own tokens (repository called with currentUser.id).
- Tests must assert push message data does not include auth tokens or INTERNAL_JOB_SECRET.
- Tests must assert invalid Expo tokens are not sent to provider.
- Tests must assert InternalJobGuard rejects missing/invalid secrets.
- Tests must not log or assert raw push token values beyond what use cases require for repository calls.
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
- Do not call real Expo push API.
- Do not refactor use cases unless required to make them testable.
- Do not continue to EPIC-12 until this task passes.
```

## Acceptance Criteria

```txt
- RegisterPushTokenUseCase unit tests exist and pass.
- RemovePushTokenUseCase unit tests exist and pass.
- SendDueCardRemindersUseCase unit tests exist and pass.
- Mock and Expo push provider unit tests exist and pass.
- push-token.mapper unit tests exist and pass.
- InternalJobGuard unit tests exist and pass.
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
TASK-11.17 Add notifications unit tests
```

---

## Epic Completion Criteria

EPIC-11 is complete when:

```txt
- PushToken Prisma schema exists.
- NotificationsModule exists.
- Notification domain types exist.
- PushTokenRepositoryPort exists.
- Prisma push token repository exists.
- PushNotificationProviderPort exists.
- Mock push provider exists.
- Expo push provider exists.
- Notification GraphQL types exist.
- RegisterPushTokenUseCase exists.
- registerPushToken mutation works.
- RemovePushTokenUseCase exists.
- removePushToken mutation works.
- SendDueCardRemindersUseCase exists.
- Internal reminder job endpoint exists.
- Internal endpoint requires INTERNAL_JOB_SECRET.
- Due-card reminders respect user settings.
- Push tokens are not exposed.
- implementation follows docs/security/security-checklist.md.
- Notifications unit tests exist and pass (TASK-11.17).
```

After EPIC-11 is complete (including TASK-11.17), move to:

```txt
docs/tasks/12-admin-analytics.md
```

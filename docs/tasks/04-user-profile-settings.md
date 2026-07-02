# EPIC-04 User Profile & Settings

## Epic Goal

Implement backend user profile and user settings features.

This epic covers:

```txt
- viewing current user account data
- updating user profile
- updating user settings
- safe account output
- settings used later by lessons and notifications
```

This epic builds on backend auth from:

```txt
docs/tasks/02-auth.md
docs/tasks/03-email-verification-password-reset.md
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
docs/tasks/03-email-verification-password-reset.md
```

## Epic Prerequisites

EPIC-03 should be complete.

Expected state:

```txt
- AuthModule exists.
- GqlAuthGuard exists.
- CurrentUser decorator exists.
- User model exists.
- UserProfile model exists.
- UserSettings model exists.
- UserRepositoryPort exists.
- Prisma user repository exists.
- me query exists or can be extended.
```

## Epic Rules

```txt
1. Follow Clean Architecture.
2. Do not expose sensitive fields.
3. Do not return passwordHash.
4. Do not return token hashes.
5. Do not put business logic in GraphQL resolvers.
6. Do not access Prisma directly from GraphQL resolvers.
7. User can update only own profile/settings.
8. Backend remains source of truth.
```

## Domain Scope

Profile fields:

```txt
displayName
avatarUrl
```

Settings fields:

```txt
interfaceLocale
themePreference
notificationsEnabled
reminderTime
timezone
audioAutoplayEnabled
lessonSize
```

## Validation Rules

Profile:

```txt
displayName:
- optional
- max 80 characters

avatarUrl:
- optional
- valid URL if provided
- max 500 characters
```

Settings:

```txt
interfaceLocale:
- supported values for MVP: en, uk

themePreference:
- SYSTEM, LIGHT, DARK

notificationsEnabled:
- boolean

reminderTime:
- HH:mm format
- 00:00 to 23:59

timezone:
- required
- max 100 characters

audioAutoplayEnabled:
- boolean

lessonSize:
- integer
- min 5
- max 100
```

## Epic Summary

```md
- [x] TASK-04.01 Add account module skeleton
- [x] TASK-04.02 Add profile and settings domain types
- [x] TASK-04.03 Add profile and settings repository ports
- [x] TASK-04.04 Add Prisma profile repository
- [x] TASK-04.05 Add Prisma settings repository
- [x] TASK-04.06 Add GetMyAccountUseCase
- [x] TASK-04.07 Add account GraphQL types and inputs
- [x] TASK-04.08 Extend me query or add myAccount query
- [x] TASK-04.09 Add UpdateProfileUseCase
- [x] TASK-04.10 Add updateProfile mutation
- [x] TASK-04.11 Add UpdateSettingsUseCase
- [x] TASK-04.12 Add updateSettings mutation
- [x] TASK-04.13 Add user profile and settings final checks
- [x] TASK-04.14 Add account use case unit tests
```

---

# TASK-04.01 Add account module skeleton

## Status

DONE

## Context

Profile and settings are account-related features.

They can live in a dedicated `account` module or inside `users` module.

For this MVP, use `account` module to keep authenticated account operations clear.

## Goal

Create account module folder structure.

## Files to Create

```txt
apps/api/src/modules/account/account.module.ts

apps/api/src/modules/account/domain/.gitkeep
apps/api/src/modules/account/domain/types/.gitkeep

apps/api/src/modules/account/application/.gitkeep
apps/api/src/modules/account/application/ports/.gitkeep
apps/api/src/modules/account/application/use-cases/.gitkeep

apps/api/src/modules/account/infrastructure/.gitkeep
apps/api/src/modules/account/infrastructure/persistence/.gitkeep
apps/api/src/modules/account/infrastructure/mappers/.gitkeep

apps/api/src/modules/account/presentation/.gitkeep
apps/api/src/modules/account/presentation/graphql/.gitkeep
apps/api/src/modules/account/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/account/presentation/graphql/types/.gitkeep
apps/api/src/modules/account/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `AccountModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class AccountModule {}
```

Import `AccountModule` into `AppModule`.

## Architecture Constraints

```txt
- Keep module empty for now.
- Do not implement business logic in this task.
- Do not add GraphQL resolver yet.
```

## Do Not Do

```txt
- Do not add profile mutation yet.
- Do not add settings mutation yet.
- Do not modify Prisma schema.
```

## Acceptance Criteria

```txt
- AccountModule exists.
- AccountModule is imported into AppModule.
- Account folder structure exists.
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
TASK-04.01 Add account module skeleton
```

---

# TASK-04.02 Add profile and settings domain types

## Status

DONE

## Context

Profile and settings need framework-independent types.

## Goal

Add domain/application types for profile and settings.

## Files to Create

```txt
apps/api/src/modules/account/domain/types/user-profile.type.ts
apps/api/src/modules/account/domain/types/user-settings.type.ts
apps/api/src/modules/account/domain/types/theme-preference.type.ts
apps/api/src/modules/account/domain/types/my-account.type.ts
apps/api/src/modules/account/domain/types/index.ts
```

## Requirements

Create `ThemePreference`:

```ts
export type ThemePreference = 'SYSTEM' | 'LIGHT' | 'DARK'
```

Create `UserProfile`:

```ts
export type UserProfile = {
  id: string
  userId: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: Date
  updatedAt: Date
}
```

Create `UserSettings`:

```ts
import { ThemePreference } from './theme-preference.type'

export type UserSettings = {
  id: string
  userId: string
  interfaceLocale: string
  themePreference: ThemePreference
  notificationsEnabled: boolean
  reminderTime: string
  timezone: string
  audioAutoplayEnabled: boolean
  lessonSize: number
  createdAt: Date
  updatedAt: Date
}
```

Create `MyAccount`:

```ts
import { SafeUser } from '../../../auth/domain/types'
import { UserProfile } from './user-profile.type'
import { UserSettings } from './user-settings.type'

export type MyAccount = {
  user: SafeUser
  profile: UserProfile
  settings: UserSettings
}
```

## Security Requirements

```txt
- Do not include passwordHash.
- Do not include token hashes.
- Do not include raw push tokens.
```

## Architecture Constraints

```txt
- Types must not import Prisma.
- Types must not import GraphQL decorators.
- Types must not import NestJS.
```

## Do Not Do

```txt
- Do not add GraphQL types yet.
- Do not implement repositories yet.
```

## Acceptance Criteria

```txt
- UserProfile type exists.
- UserSettings type exists.
- ThemePreference type exists.
- MyAccount type exists.
- No sensitive fields are included.
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
TASK-04.02 Add profile and settings domain types
```

---

# TASK-04.03 Add profile and settings repository ports

## Status

DONE

## Context

Use cases must depend on repository ports, not Prisma.

## Goal

Add repository ports for user profile and user settings.

## Files to Create

```txt
apps/api/src/modules/account/application/ports/user-profile-repository.port.ts
apps/api/src/modules/account/application/ports/user-settings-repository.port.ts
```

## Requirements

Create `UserProfileRepositoryPort`:

```ts
import { UserProfile } from '../../domain/types'

export const USER_PROFILE_REPOSITORY = Symbol('USER_PROFILE_REPOSITORY')

export type UpdateUserProfileInput = {
  userId: string
  displayName?: string | null
  avatarUrl?: string | null
}

export type UserProfileRepositoryPort = {
  findByUserId(userId: string): Promise<UserProfile | null>
  createForUser(userId: string): Promise<UserProfile>
  update(input: UpdateUserProfileInput): Promise<UserProfile>
}
```

Create `UserSettingsRepositoryPort`:

```ts
import { ThemePreference, UserSettings } from '../../domain/types'

export const USER_SETTINGS_REPOSITORY = Symbol('USER_SETTINGS_REPOSITORY')

export type UpdateUserSettingsInput = {
  userId: string
  interfaceLocale?: string
  themePreference?: ThemePreference
  notificationsEnabled?: boolean
  reminderTime?: string
  timezone?: string
  audioAutoplayEnabled?: boolean
  lessonSize?: number
}

export type UserSettingsRepositoryPort = {
  findByUserId(userId: string): Promise<UserSettings | null>
  createForUser(userId: string): Promise<UserSettings>
  update(input: UpdateUserSettingsInput): Promise<UserSettings>
}
```

## Security Requirements

```txt
- Ports must not expose sensitive auth fields.
- Ports must not expose token hashes.
```

## Architecture Constraints

```txt
- Ports live in application layer.
- Ports must not import Prisma.
- Ports must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement Prisma repositories yet.
- Do not implement use cases yet.
```

## Acceptance Criteria

```txt
- UserProfileRepositoryPort exists.
- UserSettingsRepositoryPort exists.
- Ports do not import Prisma.
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
TASK-04.03 Add profile and settings repository ports
```

---

# TASK-04.04 Add Prisma profile repository

## Status

DONE

## Context

Profile persistence should be implemented through Prisma infrastructure.

## Goal

Add Prisma implementation of `UserProfileRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/account/infrastructure/persistence/prisma-user-profile.repository.ts
apps/api/src/modules/account/infrastructure/mappers/user-profile.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/account/account.module.ts
```

## Requirements

Implement:

```txt
findByUserId
createForUser
update
```

Mapper:

```txt
toUserProfile(prismaProfile): UserProfile
```

Update should update only allowed profile fields:

```txt
displayName
avatarUrl
```

## Security Requirements

```txt
- Do not expose user passwordHash.
- Do not expose token hashes.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on UserProfileRepositoryPort.
- Resolver must not use repository directly.
```

## Do Not Do

```txt
- Do not implement GraphQL resolver yet.
- Do not add avatar upload.
```

## Acceptance Criteria

```txt
- PrismaUserProfileRepository exists.
- Repository implements UserProfileRepositoryPort.
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
TASK-04.04 Add Prisma profile repository
```

---

# TASK-04.05 Add Prisma settings repository

## Status

DONE

## Context

Settings persistence should be implemented through Prisma infrastructure.

## Goal

Add Prisma implementation of `UserSettingsRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/account/infrastructure/persistence/prisma-user-settings.repository.ts
apps/api/src/modules/account/infrastructure/mappers/user-settings.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/account/account.module.ts
```

## Requirements

Implement:

```txt
findByUserId
createForUser
update
```

Mapper:

```txt
toUserSettings(prismaSettings): UserSettings
```

Update should update only allowed settings fields:

```txt
interfaceLocale
themePreference
notificationsEnabled
reminderTime
timezone
audioAutoplayEnabled
lessonSize
```

## Security Requirements

```txt
- Do not expose user passwordHash.
- Do not expose token hashes.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on UserSettingsRepositoryPort.
- Resolver must not use repository directly.
```

## Do Not Do

```txt
- Do not implement GraphQL resolver yet.
- Do not implement notifications backend here.
```

## Acceptance Criteria

```txt
- PrismaUserSettingsRepository exists.
- Repository implements UserSettingsRepositoryPort.
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
TASK-04.05 Add Prisma settings repository
```

---

# TASK-04.06 Add GetMyAccountUseCase

## Status

DONE

## Context

Frontend needs complete current account data: safe user, profile, and settings.

## Goal

Add `GetMyAccountUseCase`.

## Files to Create

```txt
apps/api/src/modules/account/application/use-cases/get-my-account.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/account/account.module.ts
```

## Requirements

Input:

```ts
export type GetMyAccountInput = {
  userId: string
}
```

Output:

```ts
export type GetMyAccountResult = MyAccount
```

Use case must:

```txt
1. Load user by id through UserRepositoryPort.
2. Reject if user missing.
3. Reject if user blocked.
4. Load profile by user id.
5. Create profile if missing.
6. Load settings by user id.
7. Create settings if missing.
8. Return MyAccount.
```

## Security Requirements

```txt
- Return SafeUser only.
- Do not return passwordHash.
- Do not return token hashes.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement resolver in this task.
- Do not update data in this task except creating missing profile/settings.
```

## Acceptance Criteria

```txt
- GetMyAccountUseCase exists.
- Missing profile/settings are created.
- Blocked user is rejected.
- Safe account data is returned.
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
TASK-04.06 Add GetMyAccountUseCase
```

---

# TASK-04.07 Add account GraphQL types and inputs

## Status

DONE

## Context

GraphQL needs types and inputs for account/profile/settings.

## Goal

Add GraphQL account types and inputs.

## Files to Create

```txt
apps/api/src/modules/account/presentation/graphql/types/user-profile.type.ts
apps/api/src/modules/account/presentation/graphql/types/user-settings.type.ts
apps/api/src/modules/account/presentation/graphql/types/my-account.type.ts
apps/api/src/modules/account/presentation/graphql/types/theme-preference.type.ts

apps/api/src/modules/account/presentation/graphql/inputs/update-profile.input.ts
apps/api/src/modules/account/presentation/graphql/inputs/update-settings.input.ts
```

## Requirements

GraphQL types:

```txt
UserProfileType:
- id
- userId
- displayName
- avatarUrl
- createdAt
- updatedAt

UserSettingsType:
- id
- userId
- interfaceLocale
- themePreference
- notificationsEnabled
- reminderTime
- timezone
- audioAutoplayEnabled
- lessonSize
- createdAt
- updatedAt

MyAccountType:
- user
- profile
- settings
```

Inputs:

```txt
UpdateProfileInput:
- displayName optional nullable
- avatarUrl optional nullable

UpdateSettingsInput:
- interfaceLocale optional
- themePreference optional
- notificationsEnabled optional
- reminderTime optional
- timezone optional
- audioAutoplayEnabled optional
- lessonSize optional
```

## Security Requirements

```txt
- Do not expose passwordHash.
- Do not expose token hashes.
- Do not expose raw push tokens.
```

## Architecture Constraints

```txt
- GraphQL types live in presentation layer.
- GraphQL types should not contain business logic.
```

## Do Not Do

```txt
- Do not add resolver yet.
- Do not validate business rules inside GraphQL type classes.
```

## Acceptance Criteria

```txt
- UserProfileType exists.
- UserSettingsType exists.
- MyAccountType exists.
- UpdateProfileInput exists.
- UpdateSettingsInput exists.
- Sensitive fields are not exposed.
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
TASK-04.07 Add account GraphQL types and inputs
```

---

# TASK-04.08 Extend me query or add myAccount query

## Status

DONE

## Context

Frontend needs one query to fetch current account data.

Existing auth `me` query may return only safe user.

For profile/settings, add a dedicated `myAccount` query.

## Goal

Add protected `myAccount` query.

## Files to Create

```txt
apps/api/src/modules/account/presentation/graphql/resolvers/account.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/account/account.module.ts
```

## Requirements

Add query:

```graphql
myAccount: MyAccountType!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call GetMyAccountUseCase
- return user, profile, settings
```

Resolver must not:

```txt
- query Prisma
- create profile/settings directly
- contain business logic
```

## Security Requirements

```txt
- Query requires auth.
- Return safe user only.
- Do not return passwordHash.
- Do not return token hashes.
```

## Architecture Constraints

```txt
- Resolver delegates to use case.
- Business logic stays in GetMyAccountUseCase.
```

## Acceptance Criteria

```txt
- myAccount query exists.
- Query requires auth.
- Query returns safe user, profile, settings.
- Sensitive fields are not exposed.
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
TASK-04.08 Extend me query or add myAccount query
```

---

# TASK-04.09 Add UpdateProfileUseCase

## Status

DONE

## Context

Users need to update their own profile.

## Goal

Add `UpdateProfileUseCase`.

## Files to Create

```txt
apps/api/src/modules/account/application/use-cases/update-profile.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/account/account.module.ts
```

## Requirements

Input:

```ts
export type UpdateProfileInput = {
  userId: string
  displayName?: string | null
  avatarUrl?: string | null
}
```

Output:

```ts
export type UpdateProfileResult = UserProfile
```

Use case must:

```txt
1. Validate user exists.
2. Reject blocked user.
3. Validate displayName.
4. Validate avatarUrl.
5. Create profile if missing.
6. Update own profile.
7. Return updated profile.
```

Validation:

```txt
displayName:
- optional
- trim if provided
- max 80 characters

avatarUrl:
- optional
- trim if provided
- must be valid URL if provided
- max 500 characters
```

## Security Requirements

```txt
- User can update only own profile.
- userId must come from authenticated current user.
- Do not allow updating another user's profile.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not add avatar file upload.
- Do not implement resolver in this task.
```

## Acceptance Criteria

```txt
- UpdateProfileUseCase exists.
- displayName validation works.
- avatarUrl validation works.
- User updates own profile only.
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
TASK-04.09 Add UpdateProfileUseCase
```

---

# TASK-04.10 Add updateProfile mutation

## Status

DONE

## Context

Frontend needs a mutation to update profile.

## Goal

Add protected `updateProfile` mutation.

## Files to Modify

```txt
apps/api/src/modules/account/presentation/graphql/resolvers/account.resolver.ts
apps/api/src/modules/account/account.module.ts
```

## Requirements

Add mutation:

```graphql
updateProfile(input: UpdateProfileInput!): UserProfileType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call UpdateProfileUseCase
- return updated profile
```

Resolver must not:

```txt
- query Prisma
- validate business rules directly
- allow userId input
```

Important:

```txt
userId must come from CurrentUser, not from GraphQL input.
```

## Security Requirements

```txt
- User updates only own profile.
- Do not expose sensitive user fields.
```

## Acceptance Criteria

```txt
- updateProfile mutation exists.
- Mutation requires auth.
- User can update own profile.
- userId is not accepted from input.
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
TASK-04.10 Add updateProfile mutation
```

---

# TASK-04.11 Add UpdateSettingsUseCase

## Status

DONE

## Context

Users need to update their own settings.

These settings are used by frontend preferences, lessons, and notifications.

## Goal

Add `UpdateSettingsUseCase`.

## Files to Create

```txt
apps/api/src/modules/account/application/use-cases/update-settings.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/account/account.module.ts
```

## Requirements

Input:

```ts
export type UpdateSettingsInput = {
  userId: string
  interfaceLocale?: string
  themePreference?: 'SYSTEM' | 'LIGHT' | 'DARK'
  notificationsEnabled?: boolean
  reminderTime?: string
  timezone?: string
  audioAutoplayEnabled?: boolean
  lessonSize?: number
}
```

Output:

```ts
export type UpdateSettingsResult = UserSettings
```

Use case must:

```txt
1. Validate user exists.
2. Reject blocked user.
3. Validate each provided setting.
4. Create settings if missing.
5. Update own settings.
6. Return updated settings.
```

Validation:

```txt
interfaceLocale:
- supported values for MVP: en, uk

themePreference:
- SYSTEM, LIGHT, DARK

reminderTime:
- HH:mm format
- 00:00 to 23:59

timezone:
- required if provided
- max 100 characters

lessonSize:
- integer
- min 5
- max 100
```

## Security Requirements

```txt
- User can update only own settings.
- userId must come from authenticated current user.
- Do not allow updating another user's settings.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement notification sending here.
- Do not implement resolver in this task.
```

## Acceptance Criteria

```txt
- UpdateSettingsUseCase exists.
- Settings validation works.
- User updates own settings only.
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
TASK-04.11 Add UpdateSettingsUseCase
```

---

# TASK-04.12 Add updateSettings mutation

## Status

DONE

## Context

Frontend needs a mutation to update settings.

## Goal

Add protected `updateSettings` mutation.

## Files to Modify

```txt
apps/api/src/modules/account/presentation/graphql/resolvers/account.resolver.ts
apps/api/src/modules/account/account.module.ts
```

## Requirements

Add mutation:

```graphql
updateSettings(input: UpdateSettingsInput!): UserSettingsType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call UpdateSettingsUseCase
- return updated settings
```

Resolver must not:

```txt
- query Prisma
- validate business rules directly
- allow userId input
```

Important:

```txt
userId must come from CurrentUser, not from GraphQL input.
```

## Security Requirements

```txt
- User updates only own settings.
- Do not expose sensitive fields.
```

## Acceptance Criteria

```txt
- updateSettings mutation exists.
- Mutation requires auth.
- User can update own settings.
- userId is not accepted from input.
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
TASK-04.12 Add updateSettings mutation
```

---

# TASK-04.13 Add user profile and settings final checks

## Status

DONE

## Context

Profile/settings are part of authenticated account management.

## Goal

Run final checks for this epic.

## Manual GraphQL Checks

Verify:

```txt
- myAccount requires auth
- myAccount returns safe user, profile, settings
- updateProfile requires auth
- updateProfile updates displayName
- updateProfile updates avatarUrl
- updateProfile rejects invalid avatarUrl
- updateSettings requires auth
- updateSettings updates locale/theme/lessonSize
- updateSettings rejects invalid lessonSize
- updateSettings rejects invalid reminderTime
- blocked user cannot update account
```

## Security Checks

Verify:

```txt
- passwordHash is never returned
- token hashes are never returned
- userId is not accepted from updateProfile input
- userId is not accepted from updateSettings input
- user can update only own account
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
- Do not move to deck/card implementation until checks pass.
- Do not add automated tests in this task (see TASK-04.14).
- Do not expose sensitive fields for frontend convenience.
```

## Acceptance Criteria

```txt
- myAccount works.
- updateProfile works.
- updateSettings works.
- Invalid inputs are rejected.
- Sensitive fields are not exposed.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
TASK-04.13 Add user profile and settings final checks
```

---

# TASK-04.14 Add account use case unit tests

## Status

DONE

## Context

Profile and settings are part of authenticated account management. Manual GraphQL checks in TASK-04.13 are not enough to prevent regressions in validation, blocked-user handling, and create-if-missing behavior.

Use cases depend on ports, so they can be tested quickly without database or GraphQL.

## Goal

Add unit tests for EPIC-04 account use cases and mappers.

## Related Documents

```txt
docs/domain/permissions.md
docs/security/security-checklist.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/src/modules/account/application/use-cases/get-my-account.use-case.spec.ts
apps/api/src/modules/account/application/use-cases/update-profile.use-case.spec.ts
apps/api/src/modules/account/application/use-cases/update-settings.use-case.spec.ts
apps/api/src/modules/account/infrastructure/mappers/user-profile.mapper.spec.ts
apps/api/src/modules/account/infrastructure/mappers/user-settings.mapper.spec.ts
```

## Requirements

Use Jest and co-located `*.spec.ts` files.

Mock all ports. Do not use Prisma, database, or running GraphQL server.

### GetMyAccountUseCase

Cover:

```txt
- rejects missing user with UNAUTHORIZED
- rejects blocked user with USER_BLOCKED
- creates profile when missing
- creates settings when missing
- returns MyAccount with user, profile, and settings when both already exist
- does not create profile/settings when they already exist
```

### UpdateProfileUseCase

Cover:

```txt
- rejects missing user with UNAUTHORIZED
- rejects blocked user with USER_BLOCKED
- trims displayName and updates profile
- empty displayName after trim becomes null
- rejects displayName longer than 80 with VALIDATION_ERROR
- updates avatarUrl with valid http/https URL
- rejects invalid avatarUrl with VALIDATION_ERROR
- rejects avatarUrl longer than 500 with VALIDATION_ERROR
- creates profile when missing, then updates
- returns updated profile
- updates only provided fields
```

### UpdateSettingsUseCase

Cover:

```txt
- rejects missing user with UNAUTHORIZED
- rejects blocked user with USER_BLOCKED
- accepts supported interfaceLocale values en and uk
- rejects unsupported interfaceLocale with VALIDATION_ERROR
- accepts themePreference SYSTEM, LIGHT, DARK
- rejects invalid reminderTime with VALIDATION_ERROR
- accepts valid reminderTime in HH:mm format
- rejects empty timezone with VALIDATION_ERROR
- rejects timezone longer than 100 with VALIDATION_ERROR
- rejects lessonSize below 5 or above 100 with VALIDATION_ERROR
- rejects non-integer lessonSize with VALIDATION_ERROR
- updates notificationsEnabled and audioAutoplayEnabled booleans
- creates settings when missing, then updates
- returns updated settings
- updates only provided fields
```

### Mappers

Cover:

```txt
- toUserProfile maps all fields from Prisma record
- toUserSettings maps all fields from Prisma record
- toUserSettings casts themePreference to ThemePreference
```

## Security Requirements

```txt
- Tests must not use real production credentials.
- Tests must assert blocked users cannot update profile or settings.
- Tests must assert userId comes from use case input only (resolver responsibility stays outside tests).
- Tests must not expose passwordHash or token hashes.
```

## Architecture Constraints

```txt
- Unit tests only in this task.
- Mock ports; do not import Prisma client in use case tests.
- Do not test GraphQL resolvers in this task.
- Do not test Prisma repositories in this task.
- Do not add e2e tests in this task.
- Keep tests focused on business rules, not NestJS wiring.
```

## Do Not Do

```txt
- Do not add integration tests with database.
- Do not add GraphQL e2e tests.
- Do not refactor use cases unless required to make them testable.
- Do not continue to EPIC-05 until this task passes.
```

## Acceptance Criteria

```txt
- GetMyAccountUseCase tests exist and pass.
- UpdateProfileUseCase tests exist and pass.
- UpdateSettingsUseCase tests exist and pass.
- Mapper tests exist and pass.
- Tests run without database.
- pnpm --filter @flashcards/api test passes.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-04.14 Add account use case unit tests
```

---

## Epic Completion Criteria

EPIC-04 is complete when:

```txt
- AccountModule exists.
- Profile domain types exist.
- Settings domain types exist.
- Profile repository port exists.
- Settings repository port exists.
- Prisma profile repository exists.
- Prisma settings repository exists.
- GetMyAccountUseCase exists.
- myAccount query works.
- UpdateProfileUseCase exists.
- updateProfile mutation works.
- UpdateSettingsUseCase exists.
- updateSettings mutation works.
- User can update only own profile/settings.
- Sensitive fields are not exposed.
- Account use case unit tests exist and pass.
- implementation follows docs/domain/permissions.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/05-decks-cards.md
```

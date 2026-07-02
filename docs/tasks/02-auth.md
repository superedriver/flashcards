# EPIC-02 Auth

## Epic Goal

Implement backend authentication for Flashcards.

This epic covers:

```txt
- user registration
- email/password login
- access token creation
- refresh token creation
- refresh token hashing
- refresh token rotation
- logout
- current user query
- GraphQL auth guard
- safe user output
```

Email verification and password reset are handled in:

```txt
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
docs/tasks/01-backend-foundation.md
```

## Epic Prerequisites

EPIC-01 should be complete.

Expected state:

```txt
- apps/api exists.
- GraphQL foundation exists.
- ConfigModule foundation exists.
- Prisma infrastructure exists.
- Initial auth Prisma schema exists.
- User model exists.
- RefreshToken model exists.
- UserProfile model exists.
- UserSettings model exists.
- Common error foundation exists.
```

## Epic Rules

```txt
1. Follow docs/domain/auth-token-strategy.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Follow Clean Architecture.
4. Do not put business logic in GraphQL resolvers.
5. Do not access Prisma directly from GraphQL resolvers.
6. Do not store raw refresh tokens in the database.
7. Store only refresh token hashes.
8. Do not log access tokens.
9. Do not log refresh tokens.
10. Do not return passwordHash through GraphQL.
11. Do not return tokenHash through GraphQL.
12. Do not use localStorage assumptions in backend.
```

## Auth Strategy

Access token:

```txt
- JWT
- short-lived
- returned to client
- sent in Authorization header
```

Refresh token:

```txt
- random opaque token
- long-lived
- stored as hash in database
- raw token returned to client
- rotated on every refresh
- revoked on logout
```

Password hashing:

```txt
- Argon2
```

Refresh token hashing:

```txt
- SHA-256
```

## Clean Architecture Target Structure

Auth module should use this structure:

```txt
apps/api/src/modules/auth/
  domain/
    entities/
    types/
    services/
  application/
    ports/
    use-cases/
  infrastructure/
    crypto/
    jwt/
    persistence/
    mappers/
  presentation/
    graphql/
      decorators/
      guards/
      inputs/
      types/
      resolvers/
```

## Epic Summary

```md
- [x] TASK-02.01 Add auth module skeleton
- [x] TASK-02.02 Add auth domain types and safe user model
- [x] TASK-02.03 Add password hasher port and Argon2 implementation
- [x] TASK-02.04 Add token generator and token hasher ports
- [x] TASK-02.05 Add access token service
- [x] TASK-02.06 Add auth repository ports
- [x] TASK-02.07 Add Prisma user repository
- [x] TASK-02.08 Add Prisma refresh token repository
- [x] TASK-02.09 Add auth mappers
- [x] TASK-02.10 Add RegisterUserUseCase
- [x] TASK-02.11 Add auth GraphQL types and inputs
- [x] TASK-02.12 Add register mutation
- [x] TASK-02.13 Add LoginUseCase
- [x] TASK-02.14 Add login mutation
- [x] TASK-02.15 Add CurrentUser decorator and GraphQL auth guard
- [x] TASK-02.16 Add me query
- [x] TASK-02.17 Add RefreshTokenUseCase
- [x] TASK-02.18 Add refreshToken mutation
- [x] TASK-02.19 Add LogoutUseCase
- [x] TASK-02.20 Add logout mutation
- [x] TASK-02.21 Add auth final checks
- [x] TASK-02.22 Add auth use case unit tests
```

---

# TASK-02.01 Add auth module skeleton

## Status

DONE

## Context

Auth should be implemented as a backend feature module using Clean Architecture.

## Goal

Create auth module folder structure and register `AuthModule`.

## Files to Create

```txt
apps/api/src/modules/auth/auth.module.ts

apps/api/src/modules/auth/domain/.gitkeep
apps/api/src/modules/auth/domain/entities/.gitkeep
apps/api/src/modules/auth/domain/types/.gitkeep
apps/api/src/modules/auth/domain/services/.gitkeep

apps/api/src/modules/auth/application/.gitkeep
apps/api/src/modules/auth/application/ports/.gitkeep
apps/api/src/modules/auth/application/use-cases/.gitkeep

apps/api/src/modules/auth/infrastructure/.gitkeep
apps/api/src/modules/auth/infrastructure/crypto/.gitkeep
apps/api/src/modules/auth/infrastructure/jwt/.gitkeep
apps/api/src/modules/auth/infrastructure/persistence/.gitkeep
apps/api/src/modules/auth/infrastructure/mappers/.gitkeep

apps/api/src/modules/auth/presentation/.gitkeep
apps/api/src/modules/auth/presentation/graphql/.gitkeep
apps/api/src/modules/auth/presentation/graphql/decorators/.gitkeep
apps/api/src/modules/auth/presentation/graphql/guards/.gitkeep
apps/api/src/modules/auth/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/auth/presentation/graphql/types/.gitkeep
apps/api/src/modules/auth/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `AuthModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class AuthModule {}
```

Import `AuthModule` into `AppModule`.

## Architecture Constraints

```txt
- Keep module empty for now.
- Do not implement auth logic in this task.
- Do not create resolvers yet.
```

## Do Not Do

```txt
- Do not add register mutation yet.
- Do not add login mutation yet.
- Do not add JWT logic yet.
- Do not query Prisma.
```

## Acceptance Criteria

```txt
- AuthModule exists.
- AuthModule is imported into AppModule.
- Auth folder structure exists.
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
TASK-02.01 Add auth module skeleton
```

---

# TASK-02.02 Add auth domain types and safe user model

## Status

DONE

## Context

Auth needs safe user types that never expose password hashes or token hashes.

## Goal

Create auth domain/application types for safe user output and current authenticated user.

## Files to Create

```txt
apps/api/src/modules/auth/domain/types/user-role.type.ts
apps/api/src/modules/auth/domain/types/safe-user.type.ts
apps/api/src/modules/auth/domain/types/auth-user.type.ts
apps/api/src/modules/auth/domain/types/auth-tokens.type.ts
apps/api/src/modules/auth/domain/types/index.ts
```

## Requirements

Create `UserRole` type:

```ts
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN'
```

Create `SafeUser` type:

```ts
import { UserRole } from './user-role.type'

export type SafeUser = {
  id: string
  email: string
  role: UserRole
  emailVerifiedAt: Date | null
  blockedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
```

Create `AuthUser` type:

```ts
import { UserRole } from './user-role.type'

export type AuthUser = {
  id: string
  email: string
  role: UserRole
}
```

Create `AuthTokens` type:

```ts
export type AuthTokens = {
  accessToken: string
  refreshToken: string
}
```

## Security Requirements

Safe user must not include:

```txt
passwordHash
refreshTokenHash
emailVerificationTokenHash
passwordResetTokenHash
```

## Architecture Constraints

```txt
- Types must not import Prisma.
- Types must not import GraphQL decorators.
- Types must not import NestJS.
```

## Do Not Do

```txt
- Do not create GraphQL types yet.
- Do not create Prisma mappers yet.
- Do not implement use cases yet.
```

## Acceptance Criteria

```txt
- UserRole type exists.
- SafeUser type exists.
- AuthUser type exists.
- AuthTokens type exists.
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
TASK-02.02 Add auth domain types and safe user model
```

---

# TASK-02.03 Add password hasher port and Argon2 implementation

## Status

DONE

## Context

Passwords must be hashed securely.

Flashcards uses Argon2 for user passwords.

## Goal

Add password hasher port and Argon2 implementation.

## Files to Create

```txt
apps/api/src/modules/auth/application/ports/password-hasher.port.ts
apps/api/src/modules/auth/infrastructure/crypto/argon2-password-hasher.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
apps/api/package.json
```

## Requirements

Install Argon2:

```bash
pnpm --filter @flashcards/api add argon2
```

Create port:

```ts
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER')

export type PasswordHasherPort = {
  hash(password: string): Promise<string>
  verify(hash: string, password: string): Promise<boolean>
}
```

Create implementation:

```ts
import * as argon2 from 'argon2'
import { PasswordHasherPort } from '../../application/ports/password-hasher.port'

export class Argon2PasswordHasher implements PasswordHasherPort {
  hash(password: string): Promise<string> {
    return argon2.hash(password)
  }

  verify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password)
  }
}
```

Register provider in `AuthModule`.

## Security Requirements

```txt
- Do not use SHA-256 for passwords.
- Do not log passwords.
- Do not log password hashes.
- Do not return passwordHash through GraphQL.
```

## Architecture Constraints

```txt
- Use case depends on PasswordHasherPort.
- Argon2 implementation lives in infrastructure.
```

## Do Not Do

```txt
- Do not implement registration yet.
- Do not implement login yet.
- Do not add token hashing here.
```

## Acceptance Criteria

```txt
- PasswordHasherPort exists.
- Argon2PasswordHasher exists.
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
TASK-02.03 Add password hasher port and Argon2 implementation
```

---

# TASK-02.04 Add token generator and token hasher ports

## Status

DONE

## Context

Refresh tokens must be random opaque tokens.

Raw refresh tokens must not be stored in the database.

Only token hashes are stored.

## Goal

Add token generator and token hasher ports with Node crypto implementations.

## Files to Create

```txt
apps/api/src/modules/auth/application/ports/token-generator.port.ts
apps/api/src/modules/auth/application/ports/token-hasher.port.ts
apps/api/src/modules/auth/infrastructure/crypto/node-token-generator.ts
apps/api/src/modules/auth/infrastructure/crypto/sha256-token-hasher.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Create token generator port:

```ts
export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR')

export type TokenGeneratorPort = {
  generateRefreshToken(): string
}
```

Create token hasher port:

```ts
export const TOKEN_HASHER = Symbol('TOKEN_HASHER')

export type TokenHasherPort = {
  hash(token: string): string
}
```

Create Node token generator:

```ts
import { randomBytes } from 'node:crypto'
import { TokenGeneratorPort } from '../../application/ports/token-generator.port'

export class NodeTokenGenerator implements TokenGeneratorPort {
  generateRefreshToken(): string {
    return randomBytes(32).toString('base64url')
  }
}
```

Create SHA-256 token hasher:

```ts
import { createHash } from 'node:crypto'
import { TokenHasherPort } from '../../application/ports/token-hasher.port'

export class Sha256TokenHasher implements TokenHasherPort {
  hash(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }
}
```

Register providers in `AuthModule`.

## Security Requirements

```txt
- Use crypto.randomBytes.
- Do not use Math.random.
- Do not store raw refresh tokens.
- Do not log raw refresh tokens.
- Do not log token hashes.
```

## Architecture Constraints

```txt
- Use cases depend on ports.
- Crypto implementations live in infrastructure.
```

## Do Not Do

```txt
- Do not implement refresh use case yet.
- Do not create JWT service yet.
```

## Acceptance Criteria

```txt
- TokenGeneratorPort exists.
- TokenHasherPort exists.
- NodeTokenGenerator exists.
- Sha256TokenHasher exists.
- Providers are registered.
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
TASK-02.04 Add token generator and token hasher ports
```

---

# TASK-02.05 Add access token service

## Status

DONE

## Context

Access tokens are short-lived JWTs.

They are used for GraphQL authentication.

## Goal

Add JWT access token service.

## Files to Create

```txt
apps/api/src/modules/auth/application/ports/access-token-service.port.ts
apps/api/src/modules/auth/infrastructure/jwt/jwt-access-token.service.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
apps/api/package.json
```

## Requirements

Install JWT package:

```bash
pnpm --filter @flashcards/api add @nestjs/jwt
```

Create port:

```ts
import { AuthUser } from '../../domain/types'

export const ACCESS_TOKEN_SERVICE = Symbol('ACCESS_TOKEN_SERVICE')

export type AccessTokenServicePort = {
  sign(user: AuthUser): Promise<string>
  verify(token: string): Promise<AuthUser>
}
```

Create implementation using `JwtService`.

Access token payload:

```ts
{
  sub: user.id,
  email: user.email,
  role: user.role
}
```

Verification should return:

```ts
{
  id: payload.sub,
  email: payload.email,
  role: payload.role
}
```

Recommended expiry:

```txt
15m
```

Read secret from config:

```txt
JWT_ACCESS_SECRET
```

Register `JwtModule` and provider in `AuthModule`.

## Security Requirements

```txt
- Do not hardcode production JWT secret.
- Do not log JWT.
- Access token must be short-lived.
```

## Architecture Constraints

```txt
- Use cases depend on AccessTokenServicePort.
- JWT implementation lives in infrastructure.
```

## Do Not Do

```txt
- Do not implement GraphQL guard yet.
- Do not implement login yet.
```

## Acceptance Criteria

```txt
- AccessTokenServicePort exists.
- JWT implementation exists.
- JWT secret comes from config.
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
TASK-02.05 Add access token service
```

---

# TASK-02.06 Add auth repository ports

## Status

DONE

## Context

Use cases must depend on repository ports, not Prisma directly.

## Goal

Add repository ports for users and refresh tokens.

## Files to Create

```txt
apps/api/src/modules/auth/application/ports/user-repository.port.ts
apps/api/src/modules/auth/application/ports/refresh-token-repository.port.ts
```

## Requirements

Create `UserRepositoryPort`:

```ts
import { SafeUser } from '../../domain/types'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')

export type UserWithPassword = SafeUser & {
  passwordHash: string | null
}

export type CreateUserInput = {
  email: string
  passwordHash: string
}

export type UserRepositoryPort = {
  findById(id: string): Promise<SafeUser | null>
  findByEmail(email: string): Promise<UserWithPassword | null>
  create(input: CreateUserInput): Promise<SafeUser>
}
```

Create `RefreshTokenRepositoryPort`:

```ts
export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY')

export type CreateRefreshTokenInput = {
  userId: string
  tokenHash: string
  expiresAt: Date
  rotatedFromTokenId?: string | null
  userAgent?: string | null
  ipAddress?: string | null
}

export type RefreshTokenRecord = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  revokedAt: Date | null
  createdAt: Date
}

export type RefreshTokenRepositoryPort = {
  create(input: CreateRefreshTokenInput): Promise<RefreshTokenRecord>
  findActiveByHash(tokenHash: string): Promise<RefreshTokenRecord | null>
  revokeById(id: string): Promise<void>
  revokeAllForUser(userId: string): Promise<void>
}
```

## Security Requirements

```txt
- Repository port may expose passwordHash only for auth verification.
- Repository port must not expose refresh token raw value.
- RefreshTokenRecord contains tokenHash internally only.
- GraphQL must never return tokenHash.
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
- UserRepositoryPort exists.
- RefreshTokenRepositoryPort exists.
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
TASK-02.06 Add auth repository ports
```

---

# TASK-02.07 Add Prisma user repository

## Status

DONE

## Context

The auth use cases need user persistence.

Prisma implementation must live in infrastructure.

## Goal

Add Prisma implementation of `UserRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/auth/infrastructure/persistence/prisma-user.repository.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Implement:

```txt
UserRepositoryPort.findById
UserRepositoryPort.findByEmail
UserRepositoryPort.create
```

When creating user, also create:

```txt
UserProfile
UserSettings
```

Recommended create behavior:

```txt
prisma.user.create({
  data: {
    email,
    passwordHash,
    profile: { create: {} },
    settings: { create: {} }
  }
})
```

Map Prisma user to `SafeUser`.

## Security Requirements

```txt
- findByEmail may return passwordHash for auth verification.
- create/findById must not expose passwordHash in SafeUser.
- Do not expose token hashes.
```

## Architecture Constraints

```txt
- Prisma repository lives in infrastructure.
- Use cases depend on UserRepositoryPort.
- Resolver must not use this repository directly.
```

## Do Not Do

```txt
- Do not implement register use case yet.
- Do not implement GraphQL resolver yet.
```

## Acceptance Criteria

```txt
- PrismaUserRepository exists.
- Repository implements UserRepositoryPort.
- Provider is registered.
- User create also creates profile/settings.
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
TASK-02.07 Add Prisma user repository
```

---

# TASK-02.08 Add Prisma refresh token repository

## Status

DONE

## Context

Refresh tokens must be stored as hashes and rotated/revoked.

## Goal

Add Prisma implementation of `RefreshTokenRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/auth/infrastructure/persistence/prisma-refresh-token.repository.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Implement:

```txt
create
findActiveByHash
revokeById
revokeAllForUser
```

`findActiveByHash` must return token only when:

```txt
revokedAt = null
expiresAt > now
```

`revokeById` should set:

```txt
revokedAt = new Date()
```

`revokeAllForUser` should revoke only active tokens.

## Security Requirements

```txt
- Store tokenHash only.
- Never store raw refresh token.
- Never log tokenHash.
- Never expose tokenHash through GraphQL.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on RefreshTokenRepositoryPort.
```

## Do Not Do

```txt
- Do not implement refresh use case yet.
- Do not implement logout use case yet.
```

## Acceptance Criteria

```txt
- PrismaRefreshTokenRepository exists.
- Repository implements RefreshTokenRepositoryPort.
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
TASK-02.08 Add Prisma refresh token repository
```

---

# TASK-02.09 Add auth mappers

## Status

DONE

## Context

Prisma models must be mapped to safe application/domain models.

## Goal

Add auth mappers.

## Files to Create

```txt
apps/api/src/modules/auth/infrastructure/mappers/user.mapper.ts
apps/api/src/modules/auth/infrastructure/mappers/refresh-token.mapper.ts
```

## Requirements

`user.mapper.ts` should export:

```ts
toSafeUser(prismaUser): SafeUser
toUserWithPassword(prismaUser): UserWithPassword
```

`refresh-token.mapper.ts` should export:

```ts
toRefreshTokenRecord(prismaRefreshToken): RefreshTokenRecord
```

## Security Requirements

```txt
- toSafeUser must never include passwordHash.
- GraphQL types must never receive passwordHash.
- tokenHash must never leave application/infrastructure auth internals.
```

## Architecture Constraints

```txt
- Mappers live in infrastructure.
- Mappers should not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement use cases.
- Do not implement resolvers.
```

## Acceptance Criteria

```txt
- User mapper exists.
- Refresh token mapper exists.
- Safe user mapper excludes sensitive fields.
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
TASK-02.09 Add auth mappers
```

---

# TASK-02.10 Add RegisterUserUseCase

## Status

DONE

## Context

Users need to register with email/password.

Registration should create user, hash password, create refresh token, and return safe auth payload.

Email verification sending is handled in EPIC-03.

## Goal

Implement `RegisterUserUseCase`.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/register-user.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```ts
export type RegisterUserInput = {
  email: string
  password: string
  userAgent?: string | null
  ipAddress?: string | null
}
```

Output:

```ts
export type RegisterUserResult = {
  user: SafeUser
  accessToken: string
  refreshToken: string
}
```

Use case must:

```txt
1. Normalize email.
2. Validate email format.
3. Validate password length.
4. Check existing user by email.
5. Throw USER_ALREADY_EXISTS if email exists.
6. Hash password with PasswordHasherPort.
7. Create user.
8. Generate raw refresh token.
9. Hash refresh token.
10. Store refresh token hash with expiry.
11. Sign access token.
12. Return safe user, access token, raw refresh token.
```

Recommended password rules:

```txt
min length = 8
max length = 128
```

Recommended refresh token expiry:

```txt
30 days
```

## Security Requirements

```txt
- Do not log password.
- Do not log refresh token.
- Do not store raw refresh token.
- Return SafeUser only.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not send verification email in this task.
- Do not implement resolver in this task.
```

## Acceptance Criteria

```txt
- RegisterUserUseCase exists.
- Password is hashed.
- Refresh token hash is stored.
- Raw refresh token is returned.
- Access token is returned.
- Safe user is returned.
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
TASK-02.10 Add RegisterUserUseCase
```

---

# TASK-02.11 Add auth GraphQL types and inputs

## Status

DONE

## Context

Auth GraphQL layer needs safe types and inputs.

## Goal

Add GraphQL inputs and output types for auth.

## Files to Create

```txt
apps/api/src/modules/auth/presentation/graphql/inputs/register.input.ts
apps/api/src/modules/auth/presentation/graphql/inputs/login.input.ts
apps/api/src/modules/auth/presentation/graphql/inputs/refresh-token.input.ts
apps/api/src/modules/auth/presentation/graphql/inputs/logout.input.ts

apps/api/src/modules/auth/presentation/graphql/types/user-role.type.ts
apps/api/src/modules/auth/presentation/graphql/types/safe-user.type.ts
apps/api/src/modules/auth/presentation/graphql/types/auth-payload.type.ts
```

## Requirements

Create GraphQL inputs:

```txt
RegisterInput:
- email
- password

LoginInput:
- email
- password

RefreshTokenInput:
- refreshToken

LogoutInput:
- refreshToken
```

Create `SafeUserType` with safe fields only:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
updatedAt
```

Create `AuthPayloadType`:

```txt
user
accessToken
refreshToken
```

## Security Requirements

GraphQL types must never expose:

```txt
passwordHash
refreshTokenHash
emailVerificationTokenHash
passwordResetTokenHash
```

## Architecture Constraints

```txt
- GraphQL types live in presentation layer.
- GraphQL types should map use case output safely.
```

## Do Not Do

```txt
- Do not add resolver yet.
- Do not add business logic in types.
```

## Acceptance Criteria

```txt
- RegisterInput exists.
- LoginInput exists.
- RefreshTokenInput exists.
- LogoutInput exists.
- SafeUserType exists.
- AuthPayloadType exists.
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
TASK-02.11 Add auth GraphQL types and inputs
```

---

# TASK-02.12 Add register mutation

## Status

DONE

## Context

GraphQL clients need a register mutation.

Resolver should only delegate to `RegisterUserUseCase`.

## Goal

Add register mutation.

## Files to Create

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Add mutation:

```graphql
register(input: RegisterInput!): AuthPayloadType!
```

Resolver must:

```txt
- accept RegisterInput
- call RegisterUserUseCase
- return AuthPayloadType
```

Resolver must not:

```txt
- hash passwords
- generate tokens
- access Prisma
- store refresh tokens
```

## Security Requirements

```txt
- Do not return passwordHash.
- Do not log password.
- Do not log tokens.
```

## Architecture Constraints

```txt
- Business logic stays in RegisterUserUseCase.
- Resolver delegates only.
```

## Acceptance Criteria

```txt
- register mutation exists.
- Register creates user.
- Register returns accessToken, refreshToken, safe user.
- API builds.
- GraphQL schema generates.
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
TASK-02.12 Add register mutation
```

---

# TASK-02.13 Add LoginUseCase

## Status

DONE

## Context

Users need to log in with email/password.

Login should verify credentials and issue fresh tokens.

## Goal

Implement `LoginUseCase`.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/login.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```ts
export type LoginInput = {
  email: string
  password: string
  userAgent?: string | null
  ipAddress?: string | null
}
```

Output:

```ts
export type LoginResult = {
  user: SafeUser
  accessToken: string
  refreshToken: string
}
```

Use case must:

```txt
1. Normalize email.
2. Find user by email.
3. If user missing, throw INVALID_CREDENTIALS.
4. If passwordHash missing, throw INVALID_CREDENTIALS.
5. If user blocked, throw USER_BLOCKED.
6. Verify password with PasswordHasherPort.
7. If invalid password, throw INVALID_CREDENTIALS.
8. Generate raw refresh token.
9. Hash refresh token.
10. Store refresh token hash with expiry.
11. Sign access token.
12. Return safe user, access token, raw refresh token.
```

MVP email verification policy:

```txt
- Unverified users may log in.
- emailVerifiedAt is returned.
- Frontend may show verification reminder later.
```

## Security Requirements

```txt
- Do not reveal whether email exists.
- Invalid email/password should use INVALID_CREDENTIALS.
- Do not log password.
- Do not log tokens.
- Do not store raw refresh token.
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
- Do not implement email verification policy changes here.
```

## Acceptance Criteria

```txt
- LoginUseCase exists.
- Valid credentials return auth payload.
- Invalid credentials fail generically.
- Blocked user cannot log in.
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
TASK-02.13 Add LoginUseCase
```

---

# TASK-02.14 Add login mutation

## Status

DONE

## Context

GraphQL clients need a login mutation.

Resolver should delegate to `LoginUseCase`.

## Goal

Add login mutation.

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Add mutation:

```graphql
login(input: LoginInput!): AuthPayloadType!
```

Resolver must:

```txt
- accept LoginInput
- call LoginUseCase
- return AuthPayloadType
```

Resolver must not:

```txt
- verify password
- generate tokens
- access Prisma
```

## Security Requirements

```txt
- Do not return passwordHash.
- Do not log password.
- Do not log tokens.
- Invalid credentials should not reveal whether email exists.
```

## Acceptance Criteria

```txt
- login mutation exists.
- Login returns accessToken, refreshToken, safe user.
- Blocked user cannot log in.
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
TASK-02.14 Add login mutation
```

---

# TASK-02.15 Add CurrentUser decorator and GraphQL auth guard

## Status

DONE

## Context

Protected GraphQL operations need current user context.

## Goal

Add GraphQL auth guard and `CurrentUser` decorator.

## Files to Create

```txt
apps/api/src/modules/auth/presentation/graphql/guards/gql-auth.guard.ts
apps/api/src/modules/auth/presentation/graphql/decorators/current-user.decorator.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Auth guard must:

```txt
1. Read Authorization header.
2. Extract Bearer token.
3. Verify access token using AccessTokenServicePort.
4. Attach AuthUser to GraphQL context/request.
5. Reject missing/invalid token with UNAUTHORIZED.
```

`CurrentUser` decorator should return authenticated user.

## Security Requirements

```txt
- Do not log access token.
- Do not expose JWT verification error details.
- Reject invalid tokens.
```

## Architecture Constraints

```txt
- Guard belongs to presentation layer.
- Guard may use access token service.
- Business permissions are not checked in guard.
```

## Do Not Do

```txt
- Do not implement role guard yet.
- Do not add admin logic.
- Do not query Prisma in guard unless needed for blocked user check.
```

## Acceptance Criteria

```txt
- GqlAuthGuard exists.
- CurrentUser decorator exists.
- Guard verifies JWT.
- Guard attaches AuthUser.
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
TASK-02.15 Add CurrentUser decorator and GraphQL auth guard
```

---

# TASK-02.16 Add me query

## Status

DONE

## Context

Frontend needs to fetch the current authenticated user.

## Goal

Add protected `me` query.

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
```

## Requirements

Add query:

```graphql
me: SafeUserType!
```

The query must:

```txt
- require GqlAuthGuard
- read CurrentUser
- load SafeUser by user id through UserRepositoryPort or use case
- return safe user
```

If user no longer exists or is blocked:

```txt
- reject request
```

Recommended: add `GetMeUseCase`.

## Security Requirements

```txt
- Do not return passwordHash.
- Do not return token hashes.
- Blocked user should not get protected data.
```

## Architecture Constraints

```txt
- Resolver must not access Prisma directly.
- Prefer GetMeUseCase for loading user.
```

## Acceptance Criteria

```txt
- me query exists.
- me requires auth.
- me returns safe user.
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
TASK-02.16 Add me query
```

---

# TASK-02.17 Add RefreshTokenUseCase

## Status

DONE

## Context

Refresh tokens allow users to get a new access token without logging in again.

Refresh token rotation is mandatory.

## Goal

Implement `RefreshTokenUseCase`.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/refresh-token.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```ts
export type RefreshTokenInput = {
  refreshToken: string
  userAgent?: string | null
  ipAddress?: string | null
}
```

Output:

```ts
export type RefreshTokenResult = {
  user: SafeUser
  accessToken: string
  refreshToken: string
}
```

Use case must:

```txt
1. Hash incoming raw refresh token.
2. Find active refresh token by hash.
3. If not found, reject.
4. Load user.
5. If user missing, reject.
6. If user blocked, reject.
7. Revoke old refresh token.
8. Generate new raw refresh token.
9. Hash new refresh token.
10. Store new refresh token hash.
11. Link rotatedFromTokenId if available.
12. Sign new access token.
13. Return safe user, new accessToken, new raw refreshToken.
```

## Security Requirements

```txt
- Rotate refresh token on every refresh.
- Old token must not be reusable.
- Do not log raw refresh token.
- Do not log token hash.
- Do not reveal why token failed.
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
- Do not store raw token.
```

## Acceptance Criteria

```txt
- RefreshTokenUseCase exists.
- Valid refresh token returns new tokens.
- Old refresh token is revoked.
- Old refresh token cannot be reused.
- Blocked user cannot refresh.
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
TASK-02.17 Add RefreshTokenUseCase
```

---

# TASK-02.18 Add refreshToken mutation

## Status

DONE

## Context

Frontend needs to refresh sessions.

## Goal

Add refreshToken mutation.

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Add mutation:

```graphql
refreshToken(input: RefreshTokenInput!): AuthPayloadType!
```

Resolver must:

```txt
- accept raw refresh token
- call RefreshTokenUseCase
- return AuthPayloadType
```

Resolver must not:

```txt
- hash token directly
- query Prisma
- sign JWT directly
```

## Security Requirements

```txt
- Do not log refresh token.
- Do not return token hash.
- Rotation must happen in use case.
```

## Acceptance Criteria

```txt
- refreshToken mutation exists.
- Valid refresh token returns new tokens.
- Old token cannot be reused.
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
TASK-02.18 Add refreshToken mutation
```

---

# TASK-02.19 Add LogoutUseCase

## Status

DONE

## Context

Logout should revoke the current refresh token.

Frontend must clear local tokens even if backend logout fails.

## Goal

Implement `LogoutUseCase`.

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/logout.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Input:

```ts
export type LogoutInput = {
  refreshToken: string
}
```

Output:

```ts
export type LogoutResult = {
  success: boolean
}
```

Use case must:

```txt
1. Hash raw refresh token.
2. Find active refresh token by hash.
3. If found, revoke it.
4. Return success.
```

Recommended behavior:

```txt
Logout is idempotent.
If token not found or already revoked, return success.
```

## Security Requirements

```txt
- Do not log refresh token.
- Do not log token hash.
- Do not expose token state details.
```

## Architecture Constraints

```txt
- Use case depends on RefreshTokenRepositoryPort and TokenHasherPort.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Do Not Do

```txt
- Do not implement resolver in this task.
- Do not clear frontend tokens here.
```

## Acceptance Criteria

```txt
- LogoutUseCase exists.
- Active token is revoked.
- Missing token does not leak details.
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
TASK-02.19 Add LogoutUseCase
```

---

# TASK-02.20 Add logout mutation

## Status

DONE

## Context

Frontend needs a logout mutation.

## Goal

Add logout mutation.

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/auth.module.ts
```

## Requirements

Add mutation:

```graphql
logout(input: LogoutInput!): Boolean!
```

Resolver must:

```txt
- accept LogoutInput
- call LogoutUseCase
- return success boolean
```

Resolver must not:

```txt
- hash token directly
- query Prisma
```

## Security Requirements

```txt
- Do not log refresh token.
- Do not reveal token state details.
```

## Acceptance Criteria

```txt
- logout mutation exists.
- Logout revokes refresh token.
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
TASK-02.20 Add logout mutation
```

---

# TASK-02.21 Add auth final checks

## Status

DONE

## Context

Auth is security-sensitive and must be checked carefully.

## Goal

Run final backend auth checks.

## Manual GraphQL Checks

Verify:

```txt
- register works
- register duplicate email fails
- login works
- login invalid password fails
- refreshToken works
- old refresh token cannot be reused
- logout works
- me works with valid access token
- me fails without token
- passwordHash is never returned
- tokenHash is never returned
```

## Security Checks

Verify:

```txt
- passwords are hashed with Argon2
- raw refresh tokens are not stored in database
- only tokenHash is stored
- refresh tokens rotate
- tokens are not logged
- access token secret comes from env/config
- blocked user cannot login or refresh
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
- Do not continue to email verification until auth checks pass.
- Do not add automated tests in this task (see TASK-02.22).
- Do not ignore token reuse bugs.
- Do not expose sensitive fields for convenience.
```

## Acceptance Criteria

```txt
- All auth operations work.
- Token rotation works.
- Sensitive fields are not exposed.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
TASK-02.21 Add auth final checks
```

---

# TASK-02.22 Add auth use case unit tests

## Status

DONE

## Context

Auth is security-sensitive. Manual GraphQL checks in TASK-02.21 are not enough to prevent regressions in validation, token handling, and error behavior.

Use cases depend on ports, so they can be tested quickly without database or GraphQL.

## Goal

Add unit tests for auth use cases and mappers.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/src/modules/auth/application/use-cases/register-user.use-case.spec.ts
apps/api/src/modules/auth/application/use-cases/login.use-case.spec.ts
apps/api/src/modules/auth/application/use-cases/refresh-token.use-case.spec.ts
apps/api/src/modules/auth/application/use-cases/logout.use-case.spec.ts
apps/api/src/modules/auth/infrastructure/mappers/user.mapper.spec.ts
apps/api/src/modules/auth/infrastructure/mappers/refresh-token.mapper.spec.ts
```

## Files to Modify

```txt
None
```

## Requirements

Use Jest and co-located `*.spec.ts` files.

Mock all ports. Do not use Prisma, database, or running GraphQL server.

### RegisterUserUseCase

Cover:

```txt
- normalizes email (trim + lowercase)
- rejects invalid email format with VALIDATION_ERROR
- rejects password shorter than 8 or longer than 128 with VALIDATION_ERROR
- rejects existing email with USER_ALREADY_EXISTS
- hashes password through PasswordHasherPort
- creates user through UserRepositoryPort
- stores refresh token hash, not raw refresh token
- returns SafeUser, accessToken, and raw refreshToken
```

### LoginUseCase

Cover:

```txt
- normalizes email
- rejects missing user with INVALID_CREDENTIALS
- rejects missing passwordHash with INVALID_CREDENTIALS
- rejects blocked user with USER_BLOCKED
- rejects invalid password with INVALID_CREDENTIALS
- stores refresh token hash, not raw refresh token
- returns SafeUser, accessToken, and raw refreshToken
```

### RefreshTokenUseCase

Cover:

```txt
- hashes incoming raw refresh token before lookup
- rejects unknown or inactive token
- rejects blocked user
- revokes old refresh token
- stores new refresh token hash with rotation metadata when applicable
- returns SafeUser, new accessToken, and new raw refreshToken
- old refresh token cannot succeed after rotation
```

### LogoutUseCase

Cover:

```txt
- hashes incoming raw refresh token before lookup
- revokes active refresh token
- returns success when token is missing or already revoked (idempotent)
```

### Mappers

Cover:

```txt
- toSafeUser excludes passwordHash
- toUserWithPassword includes passwordHash
- toRefreshTokenRecord maps refresh token fields correctly
```

## Security Requirements

```txt
- Tests must not use real passwords from production.
- Tests must not log tokens or password hashes.
- Tests must assert SafeUser output never includes passwordHash.
- Tests must assert raw refresh tokens are passed to repository only as hashes.
```

## Architecture Constraints

```txt
- Unit tests only in this task.
- Mock ports; do not import Prisma.
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
- Do not continue to EPIC-03 until this task passes.
```

## Acceptance Criteria

```txt
- RegisterUserUseCase tests exist and pass.
- LoginUseCase tests exist and pass.
- RefreshTokenUseCase tests exist and pass.
- LogoutUseCase tests exist and pass.
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
TASK-02.22 Add auth use case unit tests
```

---

## Epic Completion Criteria

EPIC-02 is complete when:

```txt
- AuthModule exists.
- Auth domain types exist.
- Password hasher port exists.
- Argon2 implementation exists.
- Token generator exists.
- Token hasher exists.
- JWT access token service exists.
- User repository port exists.
- Refresh token repository port exists.
- Prisma user repository exists.
- Prisma refresh token repository exists.
- RegisterUserUseCase exists.
- register mutation works.
- LoginUseCase exists.
- login mutation works.
- GqlAuthGuard exists.
- CurrentUser decorator exists.
- me query works.
- RefreshTokenUseCase exists.
- refreshToken mutation works.
- refresh token rotation works.
- LogoutUseCase exists.
- logout mutation works.
- auth use case unit tests pass.
- passwords are hashed.
- refresh tokens are stored only as hashes.
- sensitive fields are not exposed.
- auth follows docs/domain/auth-token-strategy.md.
- auth follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/03-email-verification-password-reset.md
```

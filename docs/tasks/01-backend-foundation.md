# EPIC-01 Backend Foundation

## Epic Goal

Create the NestJS backend foundation for Flashcards.

This epic prepares the API application for future auth, decks, cards, lessons, SRS, groups, notifications, admin, and deployment work.

It includes:

```txt
- NestJS API skeleton
- GraphQL foundation
- backend config foundation
- Prisma infrastructure
- initial database schema foundation
- error foundation
- backend scripts
```

This epic should not implement product features yet.

## Epic Status

TODO

## Related Documents

Cursor should read these documents before working on tasks in this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/00-repository.md
```

Future backend feature work must also follow:

```txt
docs/domain/auth-token-strategy.md
docs/domain/permissions.md
docs/domain/lesson-flow.md
docs/algorithms/sm-2.md
```

## Epic Prerequisites

EPIC-00 should be complete.

Expected state:

```txt
- pnpm workspace exists
- apps/ folder exists
- packages/ folder exists
- docs/ folder exists
- root TypeScript config exists
- root lint/format tooling exists
```

## Epic Rules

```txt
1. Follow Clean Architecture.
2. Do not put business logic in GraphQL resolvers.
3. Do not access Prisma directly from resolvers.
4. Do not put NestJS decorators in domain layer.
5. Do not expose sensitive fields through GraphQL.
6. Do not commit real secrets.
7. Do not add product features yet.
8. Keep backend foundation minimal and stable.
```

## Target Backend Structure

The backend app should live in:

```txt
apps/api
```

Target structure:

```txt
apps/api/
  prisma/
    schema.prisma
  prisma.config.ts
  src/
    common/
      errors/
    config/
    generated/
      prisma/
    infrastructure/
      prisma/
    modules/
      health/
```

Future feature module structure:

```txt
apps/api/src/modules/<feature>/
  domain/
  application/
  infrastructure/
  presentation/
    graphql/
```

## Epic Summary

```md
- [x] TASK-01.01 Create NestJS API app
- [x] TASK-01.02 Rename API package and connect it to workspace
- [x] TASK-01.03 Clean up default NestJS boilerplate
- [x] TASK-01.04 Add health endpoint
- [x] TASK-01.05 Align API TypeScript config with root config
- [x] TASK-01.06 Add GraphQL foundation
- [x] TASK-01.07 Add common error foundation
- [x] TASK-01.08 Add backend config foundation
- [x] TASK-01.09 Add Prisma infrastructure
- [x] TASK-01.10 Add initial Prisma schema foundation
- [x] TASK-01.11 Add backend environment examples
- [ ] TASK-01.12 Add backend project scripts
- [ ] TASK-01.13 Run backend foundation checks
```

---

# TASK-01.01 Create NestJS API app

## Status

DONE

## Context

The monorepo needs a backend API application.

The backend stack is:

```txt
NestJS
GraphQL
Prisma
PostgreSQL
Clean Architecture
```

This task creates the NestJS app only.

## Goal

Create the backend app under `apps/api`.

## Files to Create

```txt
apps/api/
```

## Requirements

From the repository root or from `apps/`, create a NestJS app named `api`.

Recommended command:

```bash
cd apps
nest new api
```

Choose:

```txt
pnpm
```

If Nest CLI is not installed:

```bash
pnpm add -g @nestjs/cli
```

After generation, make sure `apps/api` is part of the existing root monorepo.

## Important Git Warning

`nest new` may create a nested `.git` folder inside `apps/api`.

If it does, remove it:

```bash
rm -rf apps/api/.git
```

PowerShell:

```powershell
Remove-Item -Recurse -Force apps/api/.git
```

There must be only one Git repository: the root repository.

## Architecture Constraints

```txt
- API app must live under apps/api.
- Do not create a separate repository for API.
- Do not implement business modules yet.
```

## Do Not Do

```txt
- Do not add Prisma yet.
- Do not add GraphQL yet.
- Do not add auth yet.
- Do not add database models yet.
```

## Acceptance Criteria

```txt
- apps/api exists.
- apps/api is tracked by root Git repo.
- apps/api/.git does not exist.
- pnpm workspace can see the API package.
```

## Commands to Run

```bash
pnpm install
git status
```

## Expected Commit Message

```txt
chore(api): create NestJS API app
```

---

# TASK-01.02 Rename API package and connect it to workspace

## Status

DONE

## Context

The API package should use the monorepo package naming convention.

## Goal

Rename the API package to `@flashcards/api`.

## Files to Modify

```txt
apps/api/package.json
```

## Requirements

Update `apps/api/package.json`:

```json
{
  "name": "@flashcards/api"
}
```

Verify workspace filtering works:

```bash
pnpm --filter @flashcards/api exec node -v
```

## Architecture Constraints

```txt
- Package names should use @flashcards/* convention.
- Root scripts should reference @flashcards/api.
```

## Do Not Do

```txt
- Do not rename root package.
- Do not create backend modules yet.
```

## Acceptance Criteria

```txt
- apps/api/package.json name is @flashcards/api.
- pnpm --filter @flashcards/api works.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec node -v
pnpm install
```

## Expected Commit Message

```txt
chore(api): rename API workspace package
```

---

# TASK-01.03 Clean up default NestJS boilerplate

## Status

DONE

## Context

NestJS creates REST controller/service boilerplate.

Flashcards API will primarily use GraphQL. The default REST app controller/service should be removed.

Health endpoint will be added separately.

## Goal

Remove default NestJS boilerplate and keep `AppModule` minimal.

## Files to Delete

```txt
apps/api/src/app.controller.ts
apps/api/src/app.controller.spec.ts
apps/api/src/app.service.ts
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Delete default controller/service files.

Update `apps/api/src/app.module.ts` to:

```ts
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Architecture Constraints

```txt
- Do not keep unused REST boilerplate.
- Do not put product logic in AppModule.
- AppModule should only compose modules.
```

## Do Not Do

```txt
- Do not add auth.
- Do not add Prisma.
- Do not add GraphQL yet.
```

## Acceptance Criteria

```txt
- Default app.controller.ts is deleted.
- Default app.controller.spec.ts is deleted.
- Default app.service.ts is deleted.
- AppModule has no default controller/service.
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
chore(api): remove default NestJS boilerplate
```

---

# TASK-01.04 Add health endpoint

## Status

DONE

## Context

Deployment platforms need a health endpoint.

The MVP backend should expose:

```txt
GET /health
```

## Goal

Add a simple health module.

## Files to Create

```txt
apps/api/src/modules/health/health.controller.ts
apps/api/src/modules/health/health.module.ts
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `health.controller.ts`:

```ts
import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'flashcards-api',
      timestamp: new Date().toISOString(),
    }
  }
}
```

Create `health.module.ts`:

```ts
import { Module } from '@nestjs/common'
import { HealthController } from './health.controller'

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

Update `AppModule`:

```ts
import { Module } from '@nestjs/common'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Architecture Constraints

```txt
- Health endpoint may be REST.
- Health endpoint must not expose secrets.
- Health endpoint must not expose database credentials.
```

## Do Not Do

```txt
- Do not add detailed diagnostics yet.
- Do not expose env values.
- Do not expose database connection string.
```

## Acceptance Criteria

```txt
- GET /health returns status ok.
- API builds.
- No secrets are returned.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
curl http://localhost:3000/health
```

PowerShell:

```powershell
curl.exe http://localhost:3000/health
```

## Expected Commit Message

```txt
feat(api): add health endpoint
```

---

# TASK-01.05 Align API TypeScript config with root config

## Status

DONE

## Context

The API should extend the root TypeScript config but override options needed by NestJS.

## Goal

Update API TypeScript config.

## Files to Modify

```txt
apps/api/tsconfig.json
apps/api/tsconfig.build.json
```

## Requirements

Update `apps/api/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2022",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "strictPropertyInitialization": false,
    "types": ["node", "jest"]
  },
  "include": ["src/**/*.ts", "test/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Ensure `tsconfig.build.json` excludes tests and generated outputs where appropriate.

## Architecture Constraints

```txt
- API can override moduleResolution to node.
- Root config remains strict.
- Do not disable strict globally.
```

## Do Not Do

```txt
- Do not weaken root tsconfig.
- Do not remove strict mode.
```

## Acceptance Criteria

```txt
- API tsconfig extends root tsconfig.
- API builds successfully.
- TypeScript decorators work.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(api): align TypeScript config
```

---

# TASK-01.06 Add GraphQL foundation

## Status

DONE

## Context

Flashcards uses GraphQL API.

NestJS GraphQL should be configured with Apollo and code-first schema generation.

## Goal

Install and configure GraphQL foundation.

## Files to Modify

```txt
apps/api/src/app.module.ts
apps/api/package.json
```

## Requirements

Install dependencies:

```bash
pnpm --filter @flashcards/api add @nestjs/graphql @nestjs/apollo @apollo/server graphql
```

Update `AppModule` to import GraphQL module:

```ts
import { Module } from '@nestjs/common'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { HealthModule } from './modules/health/health.module'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Security Requirements

```txt
- GraphQL playground must not be enabled in production.
- GraphQL errors must not expose secrets or stack traces in production.
```

Full production error masking can be improved later, but playground must already be disabled in production.

## Architecture Constraints

```txt
- Use NestJS code-first GraphQL.
- Feature resolvers will be added in feature modules later.
- Do not add product resolvers in this task.
```

## Do Not Do

```txt
- Do not add auth resolvers yet.
- Do not add deck resolvers yet.
- Do not create schema-first .graphql files.
```

## Acceptance Criteria

```txt
- GraphQLModule is configured.
- API builds.
- /graphql endpoint is available.
- Playground is disabled in production.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
```

Open:

```txt
http://localhost:3000/graphql
```

## Expected Commit Message

```txt
chore(api): add GraphQL foundation
```

---

# TASK-01.07 Add common error foundation

## Status

DONE

## Context

Application/domain errors should be consistent across backend modules.

This foundation will be used by auth, decks, lessons, groups, admin, and deployment-related security checks.

## Goal

Add common error classes and error codes.

## Files to Create

```txt
apps/api/src/common/errors/error-codes.ts
apps/api/src/common/errors/domain-error.ts
apps/api/src/common/errors/application-error.ts
apps/api/src/common/errors/index.ts
```

## Requirements

Create `error-codes.ts` with initial codes:

```ts
export const ErrorCodes = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',

  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  USER_BLOCKED: 'USER_BLOCKED',

  DECK_NOT_FOUND: 'DECK_NOT_FOUND',
  DECK_FORBIDDEN: 'DECK_FORBIDDEN',
  CARD_NOT_FOUND: 'CARD_NOT_FOUND',
  CARD_FORBIDDEN: 'CARD_FORBIDDEN',

  LESSON_NOT_FOUND: 'LESSON_NOT_FOUND',
  LESSON_NOT_ACTIVE: 'LESSON_NOT_ACTIVE',
  LESSON_CARD_ALREADY_REVIEWED: 'LESSON_CARD_ALREADY_REVIEWED',
  INVALID_REVIEW_ANSWER: 'INVALID_REVIEW_ANSWER',

  GROUP_NOT_FOUND: 'GROUP_NOT_FOUND',
  GROUP_FORBIDDEN: 'GROUP_FORBIDDEN',
  GROUP_INVITATION_NOT_FOUND: 'GROUP_INVITATION_NOT_FOUND',
  GROUP_INVITATION_INVALID: 'GROUP_INVITATION_INVALID',

  ADMIN_FORBIDDEN: 'ADMIN_FORBIDDEN',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
```

Create `DomainError`:

```ts
import { ErrorCode } from './error-codes'

export class DomainError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'DomainError'
  }
}
```

Create `ApplicationError`:

```ts
import { ErrorCode } from './error-codes'

export class ApplicationError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'ApplicationError'
  }
}
```

Create barrel export.

## Security Requirements

```txt
- Errors must not include secrets.
- Errors must not include raw tokens.
- Errors must not include database connection strings.
```

## Architecture Constraints

```txt
- Domain/application errors should be framework-independent.
- Do not import NestJS exceptions into domain errors.
```

## Do Not Do

```txt
- Do not add global error filter yet unless needed.
- Do not expose stack traces in production.
```

## Acceptance Criteria

```txt
- Error codes exist.
- DomainError exists.
- ApplicationError exists.
- Errors do not depend on NestJS.
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
chore(api): add common error foundation
```

---

# TASK-01.08 Add backend config foundation

## Status

DONE

## Context

The backend needs centralized environment configuration.

Production config must fail fast when critical secrets are missing.

Security rules must follow:

```txt
docs/security/security-checklist.md
```

## Goal

Add ConfigModule and config files.

## Files to Create

```txt
apps/api/src/config/app.config.ts
apps/api/src/config/auth.config.ts
apps/api/src/config/database.config.ts
apps/api/src/config/email.config.ts
apps/api/src/config/ai.config.ts
apps/api/src/config/index.ts
```

## Files to Modify

```txt
apps/api/src/app.module.ts
apps/api/package.json
```

## Requirements

Install:

```bash
pnpm --filter @flashcards/api add @nestjs/config
```

Create helper utilities where useful:

```ts
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}
```

Production must require at least:

```txt
DATABASE_URL
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
APP_WEB_URL
CORS_ORIGIN
```

Development may use safe local defaults where appropriate.

Config files should not log secret values.

Update `AppModule`:

```ts
ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, authConfig, databaseConfig, emailConfig, aiConfig],
})
```

## Security Requirements

```txt
- Do not log secrets.
- Do not hardcode production secrets.
- Production startup must fail if critical env is missing.
```

## Architecture Constraints

```txt
- Config belongs in apps/api/src/config.
- Feature modules should consume config through ConfigService or typed config helpers.
```

## Do Not Do

```txt
- Do not add real secrets.
- Do not commit .env.
- Do not configure deployment yet.
```

## Acceptance Criteria

```txt
- @nestjs/config is installed.
- ConfigModule is global.
- Config files exist.
- Production critical env validation exists.
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
chore(api): add backend config foundation
```

---

# TASK-01.09 Add Prisma infrastructure

## Status

DONE

## Context

Flashcards uses Prisma 7 with PostgreSQL.

Prisma access must live in infrastructure, not resolvers.

In Prisma 7:

```txt
- DATABASE_URL is configured in prisma.config.ts (not in schema.prisma).
- Prisma Client is generated to a custom output path.
- PrismaClient requires a driver adapter (@prisma/adapter-pg for PostgreSQL).
```

## Goal

Add Prisma dependencies and infrastructure service.

## Files to Create

```txt
apps/api/prisma/schema.prisma
apps/api/prisma.config.ts
apps/api/src/infrastructure/prisma/prisma.module.ts
apps/api/src/infrastructure/prisma/prisma.service.ts
apps/api/src/infrastructure/prisma/index.ts
```

## Files to Modify

```txt
apps/api/src/app.module.ts
apps/api/package.json
.gitignore
.prettierignore
```

## Requirements

Install dependencies:

```bash
pnpm --filter @flashcards/api add @prisma/client @prisma/adapter-pg pg
pnpm --filter @flashcards/api add -D prisma dotenv @types/pg
```

Create `apps/api/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Create `apps/api/prisma.config.ts`:

```ts
import 'dotenv/config'
import { defineConfig } from 'prisma/config'
import { resolveEnv } from './src/config/env'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: resolveEnv(
      'DATABASE_URL',
      'postgresql://user:password@localhost:5432/flashcards?schema=public',
    ),
  },
})
```

Create `PrismaService`:

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../../generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool

  constructor(config: ConfigService) {
    const connectionString = config.getOrThrow<string>('database.url')
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    super({ adapter })
    this.pool = pool
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
    await this.pool.end()
  }
}
```

Create `PrismaModule`:

```ts
import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

Import `PrismaModule` in `AppModule`.

Ensure `build` runs `prisma generate` before `nest build`.

Ignore generated client output:

```txt
apps/api/src/generated/
```

## Architecture Constraints

```txt
- PrismaService belongs in infrastructure.
- Resolvers must not access PrismaService directly.
- Use cases should depend on repository ports, not Prisma.
- Prisma repositories will be added inside feature modules later.
- Import PrismaClient from generated output, not from @prisma/client.
```

## Security Requirements

```txt
- Do not log DATABASE_URL.
- Do not commit real DATABASE_URL.
- Do not commit generated Prisma client output.
```

## Do Not Do

```txt
- Do not create auth repositories yet.
- Do not query Prisma from resolvers.
- Do not add database seed yet.
```

## Acceptance Criteria

```txt
- Prisma 7 dependencies are installed.
- prisma.config.ts exists.
- schema.prisma exists.
- PrismaService uses PostgreSQL driver adapter.
- PrismaModule exists.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api prisma:generate
pnpm --filter @flashcards/api prisma:validate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(api): add Prisma infrastructure
```

---

# TASK-01.10 Add initial Prisma schema foundation

## Status

DONE

## Context

The database schema needs an initial foundation for auth and future feature relations.

This task creates the base auth-related models only.

Feature models for decks/cards/lessons/groups/etc. are added in later epics.

Token storage must follow:

```txt
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
```

## Goal

Add initial Prisma schema foundation.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Schema must use PostgreSQL.

Datasource and generator foundation (Prisma 7):

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

`DATABASE_URL` is configured in `apps/api/prisma.config.ts`, not in `schema.prisma`.

Add enums:

```prisma
enum UserRole {
  USER
  MODERATOR
  ADMIN
}

enum ThemePreference {
  SYSTEM
  LIGHT
  DARK
}
```

Add `User` model:

```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String?
  role              UserRole  @default(USER)
  emailVerifiedAt   DateTime?
  blockedAt         DateTime?

  termsAcceptedAt   DateTime?
  privacyAcceptedAt DateTime?

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?

  profile           UserProfile?
  settings          UserSettings?
  refreshTokens     RefreshToken[]
  emailVerificationTokens EmailVerificationToken[]
  passwordResetTokens     PasswordResetToken[]

  @@index([email])
  @@index([role])
  @@index([blockedAt])
}
```

Add `UserProfile` model:

```prisma
model UserProfile {
  id          String   @id @default(uuid())
  userId      String   @unique
  displayName String?
  avatarUrl   String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Add `UserSettings` model:

```prisma
model UserSettings {
  id                    String          @id @default(uuid())
  userId                String          @unique
  interfaceLocale       String          @default("en")
  themePreference       ThemePreference @default(SYSTEM)
  notificationsEnabled  Boolean         @default(false)
  reminderTime          String          @default("18:00")
  timezone              String          @default("UTC")
  audioAutoplayEnabled  Boolean         @default(false)
  lessonSize            Int             @default(20)

  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  user                  User            @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

Add `RefreshToken` model:

```prisma
model RefreshToken {
  id                 String    @id @default(uuid())
  userId             String
  tokenHash          String    @unique
  expiresAt          DateTime
  revokedAt          DateTime?
  rotatedFromTokenId String?
  userAgent          String?
  ipAddress          String?

  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  user               User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
  @@index([revokedAt])
}
```

Add `EmailVerificationToken` model:

```prisma
model EmailVerificationToken {
  id        String    @id @default(uuid())
  userId    String
  tokenHash String    @unique
  expiresAt DateTime
  usedAt    DateTime?

  createdAt DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}
```

Add `PasswordResetToken` model:

```prisma
model PasswordResetToken {
  id        String    @id @default(uuid())
  userId    String
  tokenHash String    @unique
  expiresAt DateTime
  usedAt    DateTime?

  createdAt DateTime  @default(now())

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}
```

## Security Requirements

```txt
- Store only token hashes.
- Do not add raw token fields.
- passwordHash must never be exposed through GraphQL.
- tokenHash fields must never be exposed through GraphQL.
```

## Architecture Constraints

```txt
- This task defines persistence only.
- No repositories yet.
- No GraphQL types yet.
```

## Do Not Do

```txt
- Do not add deck/card models yet.
- Do not add lesson models yet.
- Do not add group models yet.
- Do not add notification models yet.
- Do not add admin analytics models yet.
```

## Acceptance Criteria

```txt
- Prisma schema validates.
- Auth foundation models exist.
- Raw tokens are not stored.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(db): add initial auth schema foundation
```

---

# TASK-01.11 Add backend environment examples

## Status

DONE

## Context

The backend needs documented environment variables.

Real secrets must never be committed.

## Goal

Add `.env.example` for the API.

## Files to Create

```txt
apps/api/.env.example
```

## Files to Modify

```txt
.gitignore
```

## Requirements

Create `apps/api/.env.example`:

```env
NODE_ENV="development"
PORT="3000"

DATABASE_URL="postgresql://user:password@localhost:5432/flashcards?schema=public"

APP_WEB_URL="http://localhost:8081"
CORS_ORIGIN="http://localhost:8081"

JWT_ACCESS_SECRET="replace-with-dev-access-secret"
JWT_REFRESH_SECRET="replace-with-dev-refresh-secret"

EMAIL_PROVIDER="dev"
RESEND_API_KEY=""
BREVO_API_KEY=""

AI_PROVIDER="mock"
AI_API_KEY=""

PUSH_PROVIDER="mock"

INTERNAL_JOB_SECRET="replace-with-dev-internal-job-secret"
```

Ensure `.gitignore` ignores:

```txt
.env
.env.local
.env.*.local
```

But does not ignore:

```txt
.env.example
```

## Security Requirements

```txt
- Do not include real secrets.
- Use placeholders only.
- Do not commit .env.
```

## Do Not Do

```txt
- Do not add production credentials.
- Do not add real API keys.
```

## Acceptance Criteria

```txt
- apps/api/.env.example exists.
- Required backend env variables are documented.
- .env files are ignored.
- .env.example remains trackable.
```

## Commands to Run

```bash
pnpm format:check
git status
```

## Expected Commit Message

```txt
chore(api): add backend env example
```

---

# TASK-01.12 Add backend project scripts

## Status

TODO

## Context

The API package should have scripts for Prisma validation, generation, migrations, build, and development.

## Goal

Update API scripts and useful root scripts.

## Files to Modify

```txt
apps/api/package.json
package.json
```

## Requirements

Add or ensure API scripts:

```json
{
  "scripts": {
    "build": "prisma generate && nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main.js",
    "prisma:validate": "prisma validate",
    "prisma:generate": "prisma generate",
    "prisma:migrate:dev": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio"
  }
}
```

Add or ensure root scripts:

```json
{
  "scripts": {
    "dev:api": "pnpm --filter @flashcards/api start:dev",
    "build:api": "pnpm --filter @flashcards/api build",
    "check:api": "pnpm --filter @flashcards/api build",
    "db:validate": "pnpm --filter @flashcards/api prisma:validate",
    "db:generate": "pnpm --filter @flashcards/api prisma:generate",
    "db:migrate:deploy": "pnpm --filter @flashcards/api prisma:migrate:deploy"
  }
}
```

## Security Requirements

```txt
- Do not add scripts that print secrets.
- Do not add scripts that reset production database.
```

## Do Not Do

```txt
- Do not add prisma migrate reset script.
- Do not add deployment scripts yet.
```

## Acceptance Criteria

```txt
- API Prisma scripts exist.
- Root database scripts exist.
- Prisma validate works.
- API build works.
```

## Commands to Run

```bash
pnpm db:validate
pnpm db:generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(api): add backend project scripts
```

---

# TASK-01.13 Run backend foundation checks

## Status

TODO

## Context

Backend foundation should be verified before feature work starts.

## Goal

Run final checks for backend foundation.

## Requirements

Run:

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
```

Manual checks:

```txt
GET /health returns ok
/graphql is reachable
```

PowerShell:

```powershell
curl.exe http://localhost:3000/health
```

## Security Checks

Verify:

```txt
- No real .env file is committed.
- .env.example has placeholders only.
- GraphQL playground is disabled in production.
- Health endpoint does not expose secrets.
- Prisma schema stores only token hashes.
```

## Do Not Do

```txt
- Do not implement auth yet.
- Do not implement deck/card features yet.
- Do not add frontend yet.
```

## Acceptance Criteria

```txt
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- /health works.
- /graphql is reachable.
- git status is clean after commit.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
git status
```

## Expected Commit Message

```txt
chore(api): finalize backend foundation
```

---

## Epic Completion Criteria

EPIC-01 is complete when:

```txt
- NestJS API app exists under apps/api.
- API package is named @flashcards/api.
- Default NestJS boilerplate is removed.
- Health endpoint exists.
- API TypeScript config extends root config.
- GraphQL foundation is configured.
- Common error foundation exists.
- ConfigModule foundation exists.
- Prisma infrastructure exists.
- Initial auth schema foundation exists.
- API .env.example exists.
- Backend scripts exist.
- Prisma validate passes.
- API build passes.
- Health endpoint works.
- GraphQL endpoint is reachable.
- No real secrets are committed.
```

After this epic is complete, move to:

```txt
docs/tasks/02-auth.md
```

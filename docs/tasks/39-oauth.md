# EPIC-39 OAuth: Google and Apple Sign-In

## Epic Goal

Add social sign-in via Google and Apple OAuth. Users can register and log in without a password.
Apple Sign In is required by App Store rules when any other social login is present.

## Scope

```txt
- Google OAuth: API + mobile (web + native)
- Apple Sign In: API + mobile (web + native)
- Account linking: connect OAuth to existing email/password account
- No changes to existing email/password auth
```

## This Epic Does Not Include

```txt
- GitHub or other OAuth providers
- Removal of email/password auth
- Email verification bypass
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/02-auth.md
docs/tasks/done/14-frontend-auth.md
```

## Epic Prerequisites

EPIC-38 is complete (in `docs/tasks/done/`).

## Epic Rules

```txt
- Each task must have one commit.
- Commit format: TASK-39.XX <task title>
- Each commit must include both the code change and the updated epic doc (task description added).
- Do not push to remote.
- Do not add Claude as co-author.
```

---

# TASK-39.01 API: Google OAuth — exchange id_token for user

## Status

DONE

## Context

Users need to sign in with Google without creating a password. The mobile app sends a Google
`id_token` to the API; the API verifies it, finds or creates the user, and returns auth tokens.

## What Was Done

- Added `OAuthAccount` Prisma model (`provider`, `providerUid`, email; unique on `provider+providerUid`)
- Added `oauthAccounts` relation to `User` model
- Created migration `20260925093310_add_oauth_account`
- Added `GOOGLE_CLIENT_ID` to `auth.config.ts`
- Added `OAuthAccountRepositoryPort` and `PrismaOAuthAccountRepository`
- Added `createOAuthUser` to `UserRepositoryPort` and `PrismaUserRepository` (creates user with
  `emailVerifiedAt` pre-set — OAuth email is already verified by Google)
- Added `GoogleOAuthUseCase`: verifies `id_token` via `google-auth-library`, finds or creates
  `OAuthAccount` + `User`, issues access+refresh tokens
- Added `GoogleOAuthInput` GraphQL input and `googleAuth` mutation in `AuthResolver`
- Installed `google-auth-library` package

## Files Modified

```txt
apps/api/prisma/schema.prisma
apps/api/prisma/migrations/20260925093310_add_oauth_account/migration.sql
apps/api/src/config/auth.config.ts
apps/api/src/modules/auth/application/ports/oauth-account-repository.port.ts (new)
apps/api/src/modules/auth/application/ports/user-repository.port.ts
apps/api/src/modules/auth/application/use-cases/google-oauth.use-case.ts (new)
apps/api/src/modules/auth/auth.module.ts
apps/api/src/modules/auth/infrastructure/persistence/prisma-oauth-account.repository.ts (new)
apps/api/src/modules/auth/infrastructure/persistence/prisma-user.repository.ts
apps/api/src/modules/auth/presentation/graphql/inputs/google-oauth.input.ts (new)
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
```

## Commit

```txt
TASK-39.01 API: Google OAuth — exchange id_token for user
```

---

# TASK-39.02 API: Apple Sign In — exchange identity token for user

## Status

TODO

---

# TASK-39.03 API: OAuth account linking (connect to existing email account)

## Status

TODO

---

# TASK-39.04 Mobile: Google Sign-In button and flow (web + native)

## Status

TODO

---

# TASK-39.05 Mobile: Apple Sign In button and flow (web + native)

## Status

TODO

---

# TASK-39.06 Mobile: account linking UI (connect OAuth in profile settings)

## Status

TODO

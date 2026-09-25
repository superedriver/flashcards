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

DONE

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

DONE

## Context

Apple Sign In is required by App Store rules when any other social login is present. The mobile
app sends an Apple `identityToken` (JWT); the API verifies it via Apple's public keys and returns
auth tokens. Apple only sends the email on the **first** sign-in — subsequent sign-ins omit it,
so the `OAuthAccount` row from the first sign-in is used to look up the user.

## What Was Done

- Added `appleClientId` to `auth.config.ts`
- Added `AppleOAuthUseCase`: verifies `identityToken` via `apple-signin-auth`, finds or creates
  `OAuthAccount` + `User`. On first sign-in Apple provides the email; on subsequent sign-ins the
  existing `OAuthAccount` row is used to find the user without needing the email.
- Added `AppleOAuthInput` GraphQL input and `appleAuth` mutation in `AuthResolver`
- Registered `AppleOAuthUseCase` in `AuthModule`
- Installed `apple-signin-auth` package

## Files Modified

```txt
apps/api/src/config/auth.config.ts
apps/api/src/modules/auth/application/use-cases/apple-oauth.use-case.ts (new)
apps/api/src/modules/auth/auth.module.ts
apps/api/src/modules/auth/presentation/graphql/inputs/apple-oauth.input.ts (new)
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
```

## Commit

```txt
TASK-39.02 API: Apple Sign In — exchange identity token for user
```

---

# TASK-39.03 API: OAuth account linking (connect to existing email account)

## Status

DONE

## Context

A user who registered with email/password needs to be able to link Google or Apple to their
account from profile settings. This avoids creating duplicate accounts.

## What Was Done

- Added `LinkOAuthAccountUseCase`: verifies the provider token, checks the `providerUid` is not
  already linked to a different user, and creates an `OAuthAccount` for the current user.
  If the `providerUid` is already linked to the same user, it is a no-op (idempotent).
- Added `LinkOAuthAccountInput` GraphQL input (provider + token)
- Added `linkOAuthAccount` mutation in `AuthResolver` — requires `GqlAuthGuard`
- Registered `LinkOAuthAccountUseCase` in `AuthModule`

## Files Modified

```txt
apps/api/src/modules/auth/application/use-cases/link-oauth-account.use-case.ts (new)
apps/api/src/modules/auth/auth.module.ts
apps/api/src/modules/auth/presentation/graphql/inputs/link-oauth-account.input.ts (new)
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
```

## Commit

```txt
TASK-39.03 API: OAuth account linking (connect to existing email account)
```

---

# TASK-39.04 Mobile: Google Sign-In button and flow (web + native)

## Status

DONE

## Context

The `GoogleLoginButton` was a disabled placeholder. Needed a real OAuth flow that works on both
web and native (Expo Go + builds) using `expo-auth-session`.

## What Was Done

- Added `EXPO_PUBLIC_GOOGLE_CLIENT_ID` to `env.ts`
- Rewrote `google-auth.service.ts`: exports `useGoogleAuth()` hook using
  `expo-auth-session/providers/google` PKCE flow. Returns `{ signIn, isConfigured }`.
  Button is hidden when `EXPO_PUBLIC_GOOGLE_CLIENT_ID` is not set.
- Added `GoogleAuth` and `LinkOAuthAccount` mutations to `auth.graphql`
- Rewrote `GoogleLoginButton`: calls `useGoogleAuth()` hook, on success sends `googleAuth`
  mutation to API with the `id_token`, applies auth payload and navigates.
- Updated `auth.google` i18n keys in en and uk (removed "coming soon")
- Installed `expo-auth-session` and `expo-web-browser`

## Files Modified

```txt
apps/mobile/src/config/env.ts
apps/mobile/src/features/auth/services/google-auth.service.ts
apps/mobile/src/features/auth/components/google-login-button.tsx
apps/mobile/src/features/auth/graphql/auth.graphql
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
```

## Commit

```txt
TASK-39.04 Mobile: Google Sign-In button and flow (web + native)
```

---

# TASK-39.05 Mobile: Apple Sign In button and flow (web + native)

## Status

DONE

## Context

Apple Sign In is required by App Store rules when any other social login is present. Available
only on iOS (native). The button hides itself on Android and web.

## What Was Done

- Added `expo-apple-authentication` package and plugin to `app.json`
- Created `apple-auth.service.ts`: `signInWithApple()` calls the native Apple credential API
  and returns the `identityToken`. `isAppleAuthAvailable()` checks availability at runtime.
- Created `AppleLoginButton`: checks availability on mount, hides if not available. On press
  calls `signInWithApple()`, sends `appleAuth` mutation, applies auth payload and navigates.
  User cancellation (`ERR_REQUEST_CANCELED`) is silently ignored.
- Added `AppleLoginButton` to `sign-in-form.tsx` and `sign-up-form.tsx`
- Added `auth.apple` i18n keys in en and uk

## Files Modified

```txt
apps/mobile/app.json
apps/mobile/src/features/auth/services/apple-auth.service.ts (new)
apps/mobile/src/features/auth/components/apple-login-button.tsx (new)
apps/mobile/src/features/auth/components/sign-in-form.tsx
apps/mobile/src/features/auth/components/sign-up-form.tsx
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
```

## Commit

```txt
TASK-39.05 Mobile: Apple Sign In button and flow (web + native)
```

---

# TASK-39.06 Mobile: account linking UI (connect OAuth in profile settings)

## Status

DONE

## Context

A user who registered with email/password can link Google or Apple from their profile settings.
This avoids the need to sign in with social accounts separately.

## What Was Done

- Created `LinkedAccountsCard` component: shows Link Google and/or Link Apple buttons in the
  Account section of the profile. Uses the existing `useGoogleAuth()` hook and `signInWithApple()`
  service to obtain provider tokens, then calls the `linkOAuthAccount` mutation.
  - Google button hidden when `EXPO_PUBLIC_GOOGLE_CLIENT_ID` is not set
  - Apple button hidden when not on iOS or Apple Sign In is unavailable
  - The whole card returns `null` if neither provider is available
  - Shows inline success message after linking; shows error on failure (cancellations are silent)
- Added `linkedAccounts` i18n keys to `en/profile.ts` and `uk/profile.ts`
- Imported and rendered `LinkedAccountsCard` in `profile-screen.tsx` inside the Account section,
  before the Log out button

## Files Modified

```txt
apps/mobile/src/features/auth/components/linked-accounts-card.tsx (new)
apps/mobile/src/features/profile/screens/profile-screen.tsx
apps/mobile/src/i18n/resources/en/profile.ts
apps/mobile/src/i18n/resources/uk/profile.ts
```

## Commit

```txt
TASK-39.06 Mobile: account linking UI (connect OAuth in profile settings)
```

---

# TASK-39.07 Mobile: fix Google auth crash when EXPO_PUBLIC_GOOGLE_CLIENT_ID is not set

## Status

DONE

## Context

On web, `Google.useIdTokenAuthRequest` from `expo-auth-session` requires `webClientId` to be a
non-empty string. Passing `undefined` (when `EXPO_PUBLIC_GOOGLE_CLIENT_ID` is missing) caused a
runtime crash on the sign-in screen even before the button was pressed.

## What Was Done

- In `useGoogleAuth()`, fall back to the placeholder string `'unconfigured'` when
  `env.googleClientId` is empty. The hook is always called with a valid string; the `isConfigured`
  flag stays `false`, so the button remains hidden and `signIn()` throws before `promptAsync`.

## Files Modified

```txt
apps/mobile/src/features/auth/services/google-auth.service.ts
```

## Commit

```txt
TASK-39.07 Mobile: fix Google auth crash when client ID env var is not set
```

---

# TASK-39.08 Mobile: fix useMutation crash — unify Apollo Client imports

## Status

DONE

## Context

`useMutation is not a function` crashed sign-in on web. Root cause: `ApolloProvider` was imported
from `@apollo/client/react` while `useMutation`/`useQuery` hooks were imported from `@apollo/client`.
In Apollo Client 4.x these are separate entry points with separate React contexts, so hooks
couldn't find the provider.

## What Was Done

- Changed `apollo-provider.tsx` to import `ApolloProvider` from `@apollo/client` (not `/react`)
- Changed `codegen.ts` `apolloReactHooksImportFrom` to `@apollo/client`
- Updated the generated `operations.ts` import to match (so it stays consistent until next codegen run)

## Files Modified

```txt
apps/mobile/src/graphql/apollo-provider.tsx
apps/mobile/src/graphql/generated/operations.ts
apps/mobile/codegen.ts
```

## Commit

```txt
TASK-39.08 Mobile: fix useMutation crash — unify Apollo Client imports
```

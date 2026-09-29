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

- `ApolloProvider` lives in `@apollo/client/react`; `useMutation` also lives there. Using
  `@apollo/client` for hooks gives `undefined` because the React-specific exports are only in
  the `/react` entry point.
- Changed `google-login-button`, `apple-login-button`, and `linked-accounts-card` to import
  `useMutation` from `@apollo/client/react` (kept `gql` from `@apollo/client` as it's not React-specific).
- Reverted `apollo-provider.tsx` back to `@apollo/client/react` (correct).
- Reverted `codegen.ts` and `generated/operations.ts` back to `@apollo/client/react`.

## Files Modified

```txt
apps/mobile/src/features/auth/components/google-login-button.tsx
apps/mobile/src/features/auth/components/apple-login-button.tsx
apps/mobile/src/features/auth/components/linked-accounts-card.tsx
apps/mobile/src/graphql/apollo-provider.tsx
apps/mobile/src/graphql/generated/operations.ts
apps/mobile/codegen.ts
```

## Commit

```txt
TASK-39.08 Mobile: fix useMutation crash — import hooks from @apollo/client/react
```

---

# TASK-39.09 Mobile: redesign sign-in screen

## Status

DONE

## Context

The sign-in screen looked like a generic app page — duplicated "Sign In" header, form aligned
right, too much empty space, primary button styled as disabled grey.

## What Was Done

- Removed `PageTitle` from `sign-in.tsx`; form is vertically centered in viewport
- Rewrote `SignInForm`: "Welcome back" heading + subtitle inside the form, password show/hide
  toggle (👁/🙈), "Forgot password?" moved inline next to the Password label, primary blue
  `#2563eb` Sign in button, "New here? Create account" footer link
- Added i18n keys: `welcomeBack`, `subtitle`, `newHere`, `showPassword`, `hidePassword`,
  `createAccount` (split from old combined string) in en and uk

## Files Modified

```txt
apps/mobile/app/(auth)/sign-in.tsx
apps/mobile/src/features/auth/components/sign-in-form.tsx
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
```

## Commit

```txt
TASK-39.09 Mobile: redesign sign-in screen
```

---

# TASK-39.10 Mobile: language switcher on all unauthenticated screens

## Status

DONE

## Context

Users needed to change the interface language before signing in, so auth screens show in the
right language from the start.

## What Was Done

- Created `AuthLocaleSwitcher` component: `🌐 EN | UK` pill shown in the header `headerRight`
  of all auth screens. Tapping a locale calls `setAppLocale` + `persistLocale` immediately.
- Added `AuthLocaleSwitcher` to `(auth)/_layout.tsx` via `screenOptions.headerRight`
- Fixed `bootstrap-locale.ts`: guest locale now respects the persisted locale (previously always
  forced English). Fallback order: persisted → device locale → EN.

## Files Modified

```txt
apps/mobile/app/(auth)/_layout.tsx
apps/mobile/src/features/auth/components/auth-locale-switcher.tsx (new)
apps/mobile/src/i18n/bootstrap-locale.ts
```

## Commit

```txt
TASK-39.10 Mobile: language switcher on all unauthenticated screens
```

---

# TASK-39.11 Mobile: redesign sign-up screen

## Status

DONE

## Context

Sign-up screen was inconsistent with the redesigned sign-in — had a duplicated header, no
centring, no show/hide password, and a plain combined "Already have an account? Sign in" string.

## What Was Done

- Removed `PageTitle` and `ErrorState` from `sign-up.tsx`; form vertically centered
- Rewrote `SignUpForm`: "Create account" heading + subtitle, show/hide toggle on both Password
  and Confirm password fields, compact password hint shown only when field is focused or has
  an error, primary blue Sign up button, "Already have an account? Sign in" as footer link
- Added i18n keys: `welcomeTitle`, `subtitle`, `hasAccount`, `signIn`, `showPassword`,
  `hidePassword`, `showConfirmPassword`, `hideConfirmPassword` in en and uk

## Files Modified

```txt
apps/mobile/app/(auth)/sign-up.tsx
apps/mobile/src/features/auth/components/sign-up-form.tsx
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
```

## Commit

```txt
TASK-39.11 Mobile: redesign sign-up screen
```

---

# TASK-39.12 Mobile: move OAuth buttons above email form with or-divider

## Status

DONE

## Context

OAuth buttons (Google, Apple) were rendered below the email/password form. They should appear
above it so users see the faster sign-in options first.

## What Was Done

- Created `OAuthButtons` component: unified Google + Apple outlined buttons with error display.
  Replaces separate `GoogleLoginButton` / `AppleLoginButton` in the auth forms (those components
  are kept for `LinkedAccountsCard`). Fixed bug: error was rendered as `{error ? null : null}`.
- Created `OrDivider` component: horizontal rule with "or continue with email" label.
- Updated `SignInForm` and `SignUpForm`: `OAuthButtons` + `OrDivider` above the fields,
  old individual buttons removed from below.
- Added `orContinueWith` i18n key in en and uk.

## Files Modified

```txt
apps/mobile/src/features/auth/components/oauth-buttons.tsx (new)
apps/mobile/src/features/auth/components/or-divider.tsx (new)
apps/mobile/src/features/auth/components/sign-in-form.tsx
apps/mobile/src/features/auth/components/sign-up-form.tsx
apps/mobile/src/i18n/resources/en/auth.ts
apps/mobile/src/i18n/resources/uk/auth.ts
```

## Commit

```txt
TASK-39.12 Mobile: move OAuth buttons above email form with or-divider
```

---

# TASK-39.13 Add .claudeignore and .cursorignore to protect secrets

## Status

DONE

## Context

AI tools (Claude Code, Cursor) can read `.env` files which contain secrets. Need to explicitly
block them from indexing or reading secret files.

## What Was Done

- Created `.claudeignore`: blocks `.env` and `.env.*` from Claude Code, allows `.env.example`
- Created `.cursorignore`: same rules for Cursor

## Files Modified

```txt
.claudeignore (new)
.cursorignore (new)
```

## Commit

```txt
TASK-39.13 Add .claudeignore and .cursorignore to protect secrets
```

---

# TASK-39.15 Mobile: add globe icon and right padding to locale switcher

## Status

DONE

## Context

`AuthLocaleSwitcher` had no visual icon, and the text was too close to the screen edge.

## What Was Done

- Added `🌐` icon before EN | UK labels
- Increased `paddingRight` from 8 to 16

## Files Modified

```txt
apps/mobile/src/features/auth/components/auth-locale-switcher.tsx
```

## Commit

```txt
TASK-39.15 Mobile: add globe icon and right padding to locale switcher
```

---

# TASK-39.16 Add OAuth env vars to .env.example files

## Status

DONE

## Context

`EXPO_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_ID`, and `APPLE_CLIENT_ID` were missing from
`.env.example` files, so new developers had no indication these vars are required for OAuth.

## What Was Done

- Added `EXPO_PUBLIC_GOOGLE_CLIENT_ID=""` to `apps/mobile/.env.example`
- Added `GOOGLE_CLIENT_ID=""` and `APPLE_CLIENT_ID=""` to `apps/api/.env.example`

## Files Modified

```txt
apps/mobile/.env.example
apps/api/.env.example
```

## Commit

```txt
TASK-39.16 Add OAuth env vars to .env.example files
```

---

# TASK-39.17 Add android/ to repo, ignore build artifacts

## Status

TODO

## Context

`expo run:android` generates the `apps/mobile/android/` native project directory. Without it
in the repo, every developer must regenerate it before building (requires Android SDK, ~5 min).
EAS Build is not configured, so local builds need the native directory checked in.
Build artifact directories (`.gradle/`, `.kotlin/`, `app/build/`, `build/`) must be gitignored
to avoid committing generated files.

## What To Do

- Add `apps/mobile/android/` to the repo (do not gitignore the directory itself)
- Add build artifact paths to `.gitignore`:
  - `apps/mobile/android/.gradle/`
  - `apps/mobile/android/.kotlin/`
  - `apps/mobile/android/app/build/`
  - `apps/mobile/android/build/`

## Files Modified

```txt
.gitignore
apps/mobile/android/ (new — tracked)
```

## Commit

```txt
TASK-39.17 Add android/ to repo, ignore build artifacts
```

---

# TASK-39.18 Mobile: upgrade packages and add nitro-google-signin

## Status

DONE

## Context

Switched from `expo start --android/ios` to `expo run:android/ios` for native builds.
Added `react-native-nitro-google-signin` and `react-native-nitro-modules` for native Google
Sign-In on Android (PKCE flow gives 400 on Android simulator without SHA-1 setup).
Added `expo-dev-client` required for custom native modules in development builds.
Bumped patch versions: `expo` 57.0.25→57.0.26, `expo-constants` 57.0.19→57.0.20,
`expo-router` 57.0.23→57.0.24, `csv-parse` 7.0.0→7.0.3.
Added `android.package` to `app.json` required for Android builds.

## Files Modified

```txt
apps/mobile/package.json
apps/mobile/app.json
apps/api/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.18 Mobile: upgrade packages and add nitro-google-signin
```

---

# TASK-39.19 Bump patch/minor dependencies across monorepo

## Status

DONE

## Context

Routine patch/minor version bumps across api and mobile. Fixed TypeScript errors that surfaced
after `@types/react` 19.3.0 tightened prop types for Tamagui `Button` (moved `backgroundColor`
to `style`), added missing `normalizeAppLocale` import in `bootstrap-locale.ts`, added
`load-reanimated.d.ts` to silence TS2882 side-effect import error introduced by TypeScript 6.x.

## What Was Done

- Bumped patch/minor: `@nestjs/*` 12.1.0→12.1.1, `@prisma/client+adapter` 7.8→7.10,
  `tsx` 4.23.0→4.23.15, `typescript-eslint` 8.61→8.71, `prettier` 3.8→3.9,
  `react-native-reanimated` 4.5→4.7, `react-hook-form` 7.88→7.89, and others
- Added `"ignoreDeprecations": "6.0"` to mobile `tsconfig.json` for `baseUrl` deprecation
- Fixed missing import of `normalizeAppLocale` in `bootstrap-locale.ts`
- Fixed `backgroundColor` prop on `AppButton` — moved to `style` prop (TypeScript 19.3.0 compat)
- Added `load-reanimated.d.ts` to fix TS2882 side-effect import error

## Files Modified

```txt
apps/api/package.json
apps/mobile/package.json
apps/mobile/tsconfig.json
apps/mobile/src/i18n/bootstrap-locale.ts
apps/mobile/src/features/auth/components/sign-in-form.tsx
apps/mobile/src/features/auth/components/sign-up-form.tsx
apps/mobile/src/providers/load-reanimated.d.ts (new)
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.19 Bump patch/minor dependencies across monorepo
```

---

# TASK-39.20 Upgrade TypeScript to v6, fix tsconfig for TS6 strict mode

## Status

DONE

## Context

TypeScript 6 deprecated `baseUrl` and `moduleResolution: node` (node10). Required fixes:

- Remove `baseUrl` from all tsconfigs (deprecated in TS6, removed in TS7)
- Change `moduleResolution: node` → `node16` with matching `module: node16` in api and srs build
- Remove monorepo `paths` aliases from `tsconfig.base.json` — api resolves `@flashcards/srs`
  from `dist/` via pnpm workspace symlink (build order already handles this)

Note: TypeScript 7.0 was attempted but reverted — `typescript-eslint` 8.71 does not yet
support TS 7.0 (tracked in typescript-eslint#10940). Will upgrade once support lands.

## Files Modified

```txt
tsconfig.base.json
apps/api/tsconfig.json
apps/mobile/tsconfig.json
packages/srs/tsconfig.build.json
apps/api/package.json
apps/mobile/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.20 Upgrade TypeScript to v6, fix tsconfig for TS6 strict mode
```

---

# TASK-39.21 Upgrade zod to v4

## Status

DONE

## Context

zod 4 removed `invalid_type_error`/`errorMap` params — replaced with `error`. Also changed
`z.coerce.number()` inference from `number` to `unknown` (ZodPipe input type). Fixed by
switching `lessonSize` from `z.coerce.number` to `z.number` — react-hook-form already passes
a number from the controlled input. Also updated `@hookform/resolvers` to latest for zod 4 compat.

## Files Modified

```txt
apps/mobile/package.json
apps/mobile/src/features/settings/validation/settings-form.schema.ts
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.21 Upgrade zod to v4
```

---

# TASK-39.22 Upgrade graphql to v17

## Status

DONE

## Context

graphql 17 — no breaking changes in the code, all existing usages in api and mobile
compiled without errors after the upgrade.

## Files Modified

```txt
apps/api/package.json
apps/mobile/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.22 Upgrade graphql to v17
```

---

# TASK-39.23 Upgrade vitest to v5

## Status

DONE

## Context

vitest 5 — no breaking changes in srs tests. All 53 tests pass after the upgrade.

## Files Modified

```txt
package.json
packages/srs/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.23 Upgrade vitest to v5
```

---

# TASK-39.24 Upgrade dotenv to v18

## Status

DONE

## Context

dotenv 18 — no breaking changes in api. Build passes without errors.

## Files Modified

```txt
apps/api/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.24 Upgrade dotenv to v18
```

---

# TASK-39.25 Upgrade expo-server-sdk to v7

## Status

DONE

## Context

expo-server-sdk 7 — no breaking changes in api push notification code. Build passes without errors.

## Files Modified

```txt
apps/api/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.25 Upgrade expo-server-sdk to v7
```

---

# TASK-39.26 Upgrade @react-native-async-storage to v3

## Status

DONE

## Context

async-storage 3 — no breaking changes in existing usage (getItem/setItem/removeItem).
Typecheck passes without errors.

## Files Modified

```txt
apps/mobile/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.26 Upgrade @react-native-async-storage to v3
```

---

# TASK-39.27 Upgrade react-native to 0.87.1

## Status

DONE

## Context

react-native 0.87.1 — typecheck passes without errors. Peer dep warning from
`react-native-worklets` (indirect dep of `react-native-reanimated`) is a known issue
and does not affect the build.

## Files Modified

```txt
apps/mobile/package.json
pnpm-lock.yaml
```

## Commit

```txt
TASK-39.27 Upgrade react-native to 0.87.1
```

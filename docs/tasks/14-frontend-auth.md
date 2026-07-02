# EPIC-14 Frontend Auth

## Epic Goal

Implement frontend authentication for Flashcards.

This epic covers:

```txt
- auth state management
- sign up screen
- sign in screen
- logout
- current user loading
- protected route gating
- Apollo auth link
- access token in memory
- refresh token storage strategy
- email verification screens
- password reset screens
- Google login placeholder/foundation
```

This epic must follow:

```txt
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/02-auth.md
docs/tasks/03-email-verification-password-reset.md
docs/tasks/13-frontend-foundation.md
```

## Epic Prerequisites

EPIC-13 should be complete.

Expected state:

```txt
- Expo app exists.
- Expo Router works.
- Tamagui works.
- Apollo Client exists.
- GraphQL Codegen foundation exists.
- Shared UI primitives exist.
```

## Epic Rules

```txt
1. Follow docs/domain/auth-token-strategy.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Access token must stay in memory only.
4. Mobile refresh token must be stored in Expo SecureStore.
5. Web refresh token must not be stored in localStorage.
6. Do not store access token in localStorage.
7. Do not store refresh token in localStorage.
8. Do not expose tokens in logs.
9. Apollo should attach access token from memory.
10. Apollo should attempt refresh once on UNAUTHENTICATED.
11. Do not create infinite refresh loops.
12. Do not put backend secrets in frontend env.
```

## Token Storage Policy

Mobile:

```txt
access token: memory only
refresh token: Expo SecureStore
```

Web MVP:

```txt
access token: memory only
refresh token: memory only until httpOnly cookie backend flow is implemented
```

Production web target:

```txt
refresh token should move to httpOnly secure cookie flow
```

Never use:

```txt
localStorage
sessionStorage
AsyncStorage for auth tokens
```

## Auth GraphQL Operations

Expected backend operations:

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
}

mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
}

mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
}

mutation Logout($input: LogoutInput!) {
  logout(input: $input)
}

query Me {
  me {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}
```

Email verification and password reset operations:

```graphql
mutation VerifyEmail($input: VerifyEmailInput!) {
  verifyEmail(input: $input) {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}

mutation ResendVerificationEmail {
  resendVerificationEmail
}

mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
  requestPasswordReset(input: $input)
}

mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input)
}
```

## Epic Summary

```md
- [x] TASK-14.01 Add frontend auth package dependencies
- [ ] TASK-14.02 Add auth GraphQL documents
- [ ] TASK-14.03 Generate auth GraphQL types
- [ ] TASK-14.04 Add token storage services
- [ ] TASK-14.05 Add auth state store
- [ ] TASK-14.06 Add Apollo auth link
- [ ] TASK-14.07 Add auth provider and bootstrap
- [ ] TASK-14.08 Add protected route gating
- [ ] TASK-14.09 Add sign in screen
- [ ] TASK-14.10 Add sign up screen
- [ ] TASK-14.11 Add logout flow
- [ ] TASK-14.12 Add email verification screens
- [ ] TASK-14.13 Add password reset screens
- [ ] TASK-14.14 Add Google login foundation
- [ ] TASK-14.15 Add frontend auth final checks
```

---

# TASK-14.01 Add frontend auth package dependencies

## Status

DONE

## Context

Frontend auth needs secure token storage on native platforms and form handling.

## Goal

Add dependencies needed for auth screens and secure storage.

## Files to Modify

```txt
apps/mobile/package.json
```

## Requirements

Install:

```bash
pnpm --filter @flashcards/mobile add expo-secure-store
pnpm --filter @flashcards/mobile add react-hook-form zod @hookform/resolvers
```

Optional if needed:

```bash
pnpm --filter @flashcards/mobile add zustand
```

Use `zustand` only if auth state is not implemented with React Context.

## Security Requirements

```txt
- Use Expo SecureStore for native refresh token.
- Do not use localStorage for tokens.
- Do not use AsyncStorage for tokens.
```

## Acceptance Criteria

```txt
- Required dependencies are installed.
- Mobile typecheck passes.
- App still starts.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.01 Add frontend auth package dependencies
```

---

# TASK-14.02 Add auth GraphQL documents

## Status

TODO

## Context

Frontend auth should use GraphQL documents and generated types.

## Goal

Add auth GraphQL operation documents.

## Files to Create

```txt
apps/mobile/src/features/auth/graphql/auth.graphql
```

## Requirements

Add operations:

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
}

mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
}

mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
      emailVerifiedAt
      blockedAt
      createdAt
      updatedAt
    }
  }
}

mutation Logout($input: LogoutInput!) {
  logout(input: $input)
}

query Me {
  me {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}

mutation VerifyEmail($input: VerifyEmailInput!) {
  verifyEmail(input: $input) {
    id
    email
    role
    emailVerifiedAt
    blockedAt
    createdAt
    updatedAt
  }
}

mutation ResendVerificationEmail {
  resendVerificationEmail
}

mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
  requestPasswordReset(input: $input)
}

mutation ResetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input)
}
```

## Security Requirements

```txt
- Do not request sensitive fields.
- Do not request passwordHash.
- Do not request token hashes.
```

## Acceptance Criteria

```txt
- Auth GraphQL document exists.
- Only safe user fields are requested.
- Codegen can read document.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.02 Add auth GraphQL documents
```

---

# TASK-14.03 Generate auth GraphQL types

## Status

TODO

## Context

Frontend should use generated GraphQL types and hooks.

## Goal

Run codegen for auth operations.

## Files to Modify

```txt
apps/mobile/src/graphql/generated/index.ts
```

## Requirements

Run backend locally if schema is loaded from local GraphQL endpoint.

Then run:

```bash
pnpm --filter @flashcards/mobile codegen
```

Generated output should include hooks/types for:

```txt
Register
Login
RefreshToken
Logout
Me
VerifyEmail
ResendVerificationEmail
RequestPasswordReset
ResetPassword
```

## Do Not Do

```txt
- Do not manually edit generated file.
- Do not commit generated file if repository convention excludes generated files.
```

## Acceptance Criteria

```txt
- Auth generated types exist or codegen successfully runs.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile codegen
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.03 Generate auth GraphQL types
```

---

# TASK-14.04 Add token storage services

## Status

TODO

## Context

Token storage must follow `docs/domain/auth-token-strategy.md`.

## Goal

Add frontend token memory and refresh token storage services.

## Files to Create

```txt
apps/mobile/src/features/auth/services/access-token-memory.ts
apps/mobile/src/features/auth/services/refresh-token-storage.ts
apps/mobile/src/features/auth/services/auth-token-service.ts
```

## Requirements

Access token memory service:

```txt
- stores access token in module memory only
- getAccessToken()
- setAccessToken(token)
- clearAccessToken()
```

Refresh token storage service:

```txt
native:
- Expo SecureStore

web MVP:
- memory-only fallback
- no localStorage
- no sessionStorage
```

Auth token service:

```txt
- setTokens(accessToken, refreshToken)
- getAccessToken()
- getRefreshToken()
- clearTokens()
```

## Security Requirements

```txt
- Access token memory only.
- Native refresh token SecureStore.
- Web refresh token memory only until httpOnly cookie flow.
- No localStorage.
- No sessionStorage.
- No AsyncStorage for auth tokens.
- Do not log token values.
```

## Acceptance Criteria

```txt
- Token services exist.
- Native uses Expo SecureStore.
- Web does not use localStorage/sessionStorage.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.04 Add token storage services
```

---

# TASK-14.05 Add auth state store

## Status

TODO

## Context

Frontend needs a central auth state for current user, loading state, and auth actions.

## Goal

Add auth state store/provider logic.

## Files to Create

```txt
apps/mobile/src/features/auth/state/auth-store.ts
apps/mobile/src/features/auth/types/auth-user.ts
apps/mobile/src/features/auth/types/auth-state.ts
apps/mobile/src/features/auth/index.ts
```

## Requirements

Auth state should track:

```txt
user
isAuthenticated
isBootstrapping
isLoading
error
```

Actions:

```txt
setAuthResult
setUser
clearAuth
setLoading
setError
```

Auth user fields:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
updatedAt
```

## Security Requirements

```txt
- Store safe user only.
- Do not store password.
- Do not store token hashes.
- Do not persist auth state with tokens to localStorage.
```

## Acceptance Criteria

```txt
- Auth store exists.
- Safe user type exists.
- Store does not persist tokens.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.05 Add auth state store
```

---

# TASK-14.06 Add Apollo auth link

## Status

TODO

## Context

Apollo must attach access token and refresh once on authentication errors.

## Goal

Add Apollo auth link and refresh handling.

## Files to Modify

```txt
apps/mobile/src/graphql/apollo-client.ts
```

## Files to Create

```txt
apps/mobile/src/features/auth/services/apollo-auth-links.ts
```

## Requirements

Auth link:

```txt
- read access token from memory
- attach Authorization: Bearer <accessToken>
- do not attach if no access token
```

Error/refresh link:

```txt
- detect UNAUTHENTICATED GraphQL errors
- attempt refresh once
- use refresh token from refresh-token-storage
- update access/refresh tokens on success
- retry original operation once
- clear auth on refresh failure
- prevent infinite refresh loop
```

Recommended implementation:

```txt
- use Apollo Link
- use operation context flag like alreadyRetriedAuth
```

## Security Requirements

```txt
- Do not read tokens from localStorage.
- Do not write tokens to localStorage.
- Do not log tokens.
- Avoid infinite refresh loop.
```

## Acceptance Criteria

```txt
- Authorization header is attached from memory access token.
- Refresh is attempted once on UNAUTHENTICATED.
- Refresh failure clears auth.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.06 Add Apollo auth link
```

---

# TASK-14.07 Add auth provider and bootstrap

## Status

TODO

## Context

On app launch, frontend should restore session using refresh token when available.

## Goal

Add auth provider and bootstrap flow.

## Files to Create

```txt
apps/mobile/src/features/auth/components/auth-provider.tsx
apps/mobile/src/features/auth/hooks/use-auth.ts
```

## Files to Modify

```txt
apps/mobile/src/app/app-providers.tsx
```

## Requirements

Auth provider should:

```txt
1. On mount, check refresh token.
2. If refresh token exists, call RefreshToken mutation.
3. Store new access/refresh tokens.
4. Set current user.
5. If refresh fails, clear tokens/auth.
6. Mark bootstrap complete.
```

Expose hook:

```ts
export function useAuth() {
  // returns auth state and actions
}
```

Provider order:

```txt
ApolloProvider must exist before AuthProvider if AuthProvider uses Apollo hooks.
```

or use Apollo client directly if needed.

## Security Requirements

```txt
- Do not log refresh token.
- Do not persist access token.
- Clear tokens on refresh failure.
```

## Acceptance Criteria

```txt
- AuthProvider exists.
- AppProviders includes AuthProvider.
- App bootstraps auth from refresh token.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.07 Add auth provider and bootstrap
```

---

# TASK-14.08 Add protected route gating

## Status

TODO

## Context

Authenticated app routes should be protected.

## Goal

Add route gating for auth and app tabs.

## Files to Modify

```txt
apps/mobile/app/_layout.tsx
apps/mobile/app/index.tsx
apps/mobile/app/(auth)/_layout.tsx
apps/mobile/app/(tabs)/_layout.tsx
```

## Requirements

Routing behavior:

```txt
- while auth is bootstrapping, show loading state
- unauthenticated users go to /(auth)/sign-in
- authenticated users can access /(tabs)
- authenticated users visiting auth screens may redirect to /(tabs)
```

Use Expo Router redirects.

## Security Note

Frontend route gating is UX only.

Backend auth guards remain source of truth.

## Do Not Do

```txt
- Do not rely on route gating for backend security.
- Do not store tokens in URL.
```

## Acceptance Criteria

```txt
- Unauthenticated users see auth route.
- Authenticated users see tabs route.
- Bootstrapping state is handled.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.08 Add protected route gating
```

---

# TASK-14.09 Add sign in screen

## Status

TODO

## Context

Users need to sign in with email and password.

## Goal

Implement sign in screen.

## Files to Modify

```txt
apps/mobile/app/(auth)/sign-in.tsx
```

## Files to Create

```txt
apps/mobile/src/features/auth/components/sign-in-form.tsx
apps/mobile/src/features/auth/validation/sign-in.schema.ts
```

## Requirements

Form fields:

```txt
email
password
```

Validation:

```txt
email:
- required
- valid email

password:
- required
- min 8 characters
- max 128 characters
```

Submit behavior:

```txt
1. Call Login mutation.
2. Store access token in memory.
3. Store refresh token according to platform policy.
4. Set current user.
5. Navigate to /(tabs).
```

UI should include links to:

```txt
sign up
forgot password
```

## Security Requirements

```txt
- Do not log password.
- Do not log tokens.
- Do not store tokens in localStorage.
```

## Acceptance Criteria

```txt
- Sign in form exists.
- Login mutation is used.
- Auth state updates on success.
- Tokens are stored according to policy.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.09 Add sign in screen
```

---

# TASK-14.10 Add sign up screen

## Status

TODO

## Context

Users need to create an account.

## Goal

Implement sign up screen.

## Files to Modify

```txt
apps/mobile/app/(auth)/sign-up.tsx
```

## Files to Create

```txt
apps/mobile/src/features/auth/components/sign-up-form.tsx
apps/mobile/src/features/auth/validation/sign-up.schema.ts
```

## Requirements

Form fields:

```txt
email
password
confirmPassword
```

Validation:

```txt
email:
- required
- valid email

password:
- required
- min 8 characters
- max 128 characters

confirmPassword:
- must match password
```

Submit behavior:

```txt
1. Call Register mutation.
2. Store access token in memory.
3. Store refresh token according to platform policy.
4. Set current user.
5. Navigate to email verification prompt or /(tabs).
```

Recommended MVP route after sign up:

```txt
/(auth)/verify-email-prompt
```

If that route does not exist yet, create it in TASK-14.12.

## Security Requirements

```txt
- Do not log password.
- Do not log tokens.
- Do not store tokens in localStorage.
```

## Acceptance Criteria

```txt
- Sign up form exists.
- Register mutation is used.
- Password confirmation validation works.
- Auth state updates on success.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.10 Add sign up screen
```

---

# TASK-14.11 Add logout flow

## Status

TODO

## Context

Users need to log out safely.

## Goal

Implement logout flow.

## Files to Create

```txt
apps/mobile/src/features/auth/hooks/use-logout.ts
```

## Files to Modify

```txt
apps/mobile/app/(tabs)/profile.tsx
```

## Requirements

Logout behavior:

```txt
1. Read refresh token if available.
2. Call Logout mutation if refresh token exists.
3. Clear access token memory.
4. Clear refresh token storage.
5. Clear auth state.
6. Reset Apollo cache.
7. Navigate to /(auth)/sign-in.
```

If backend logout fails:

```txt
- still clear local tokens and auth state
```

## Security Requirements

```txt
- Clear tokens on logout.
- Do not log tokens.
- Do not leave stale Apollo cache with user data.
```

## Acceptance Criteria

```txt
- Logout hook exists.
- Profile screen has logout action.
- Local auth state clears.
- Apollo cache resets.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.11 Add logout flow
```

---

# TASK-14.12 Add email verification screens

## Status

TODO

## Context

Users need to verify email and request resend verification email.

## Goal

Add email verification screens.

## Files to Create

```txt
apps/mobile/app/(auth)/verify-email.tsx
apps/mobile/app/(auth)/verify-email-prompt.tsx
apps/mobile/src/features/auth/components/verify-email-screen.tsx
apps/mobile/src/features/auth/components/verify-email-prompt.tsx
```

## Requirements

`verify-email-prompt` should:

```txt
- explain that verification email was sent
- show current user's email if available
- include resend verification button
- include continue button
```

`verify-email` should:

```txt
- read token from route query params
- call VerifyEmail mutation
- show success/error state
- update current user in auth store on success
```

Resend behavior:

```txt
- call ResendVerificationEmail mutation
- show success/error feedback
```

## Security Requirements

```txt
- Do not log verification token.
- Do not store verification token.
- Do not expose token outside mutation input.
```

## Acceptance Criteria

```txt
- Verify email prompt exists.
- Verify email route exists.
- Resend verification works.
- Successful verification updates current user.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.12 Add email verification screens
```

---

# TASK-14.13 Add password reset screens

## Status

TODO

## Context

Users need to request password reset and set a new password.

## Goal

Add password reset screens.

## Files to Create

```txt
apps/mobile/app/(auth)/forgot-password.tsx
apps/mobile/app/(auth)/reset-password.tsx
apps/mobile/src/features/auth/components/forgot-password-form.tsx
apps/mobile/src/features/auth/components/reset-password-form.tsx
apps/mobile/src/features/auth/validation/forgot-password.schema.ts
apps/mobile/src/features/auth/validation/reset-password.schema.ts
```

## Requirements

Forgot password form:

```txt
email
```

Submit:

```txt
- call RequestPasswordReset mutation
- always show generic success message
```

Reset password form:

```txt
token from query params
newPassword
confirmPassword
```

Submit:

```txt
- call ResetPassword mutation
- show success
- navigate to sign in
```

Validation:

```txt
newPassword:
- min 8
- max 128

confirmPassword:
- must match
```

## Security Requirements

```txt
- Do not reveal if email exists.
- Do not log reset token.
- Do not log password.
- Do not store reset token.
```

## Acceptance Criteria

```txt
- Forgot password screen exists.
- Reset password screen exists.
- Generic success message is shown for request.
- Reset password works with token.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.13 Add password reset screens
```

---

# TASK-14.14 Add Google login foundation

## Status

TODO

## Context

Backend supports or will support Google login.

MVP can add frontend foundation without completing full provider flow if backend is not ready.

## Goal

Add Google login button/foundation.

## Files to Create

```txt
apps/mobile/src/features/auth/components/google-login-button.tsx
apps/mobile/src/features/auth/services/google-auth.service.ts
```

## Files to Modify

```txt
apps/mobile/src/features/auth/components/sign-in-form.tsx
apps/mobile/src/features/auth/components/sign-up-form.tsx
```

## Requirements

Add Google button to sign in/sign up screens.

If full backend Google login is ready:

```txt
- integrate Expo AuthSession or provider SDK
- obtain Google identity token
- call backend Google login mutation
- store tokens using auth token service
```

If backend Google login is not ready:

```txt
- render disabled or "Coming soon" button
- keep service interface ready
```

Service interface:

```ts
export type GoogleAuthResult = {
  idToken: string
}

export type GoogleAuthService = {
  signIn(): Promise<GoogleAuthResult>
}
```

## Security Requirements

```txt
- Do not expose OAuth client secret in frontend.
- Use public client IDs only.
- Do not log Google id token.
- Do not store tokens in localStorage.
```

## Acceptance Criteria

```txt
- Google login button exists.
- Button is included on auth screens.
- No secrets are exposed.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-14.14 Add Google login foundation
```

---

# TASK-14.15 Add frontend auth final checks

## Status

TODO

## Context

Frontend auth is security-sensitive.

## Goal

Run final checks for frontend auth.

## Manual Checks

Verify:

```txt
- sign up works
- sign in works
- auth state persists across native app restart using SecureStore refresh token
- web does not use localStorage/sessionStorage for auth tokens
- logout clears tokens
- logout resets Apollo cache
- protected routes redirect unauthenticated user
- authenticated user reaches tabs
- email verification route works
- resend verification works
- forgot password request shows generic success
- reset password works
- refresh token retry happens once on UNAUTHENTICATED
- refresh failure clears auth
```

## Security Checks

Verify:

```txt
- access token is memory only
- native refresh token uses SecureStore
- web does not use localStorage/sessionStorage for tokens
- tokens are not logged
- password is not logged
- verification token is not logged
- reset token is not logged
- frontend env exposes only public-safe values
```

Suggested checks:

```bash
grep -R "localStorage" apps/mobile || true
grep -R "sessionStorage" apps/mobile || true
grep -R "JWT_ACCESS_SECRET\|JWT_REFRESH_SECRET\|DATABASE_URL\|AI_API_KEY\|INTERNAL_JOB_SECRET" apps/mobile || true
```

If `localStorage` or `sessionStorage` appears, verify it is not used for auth tokens.

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Do Not Do

```txt
- Do not move to deck/card frontend until auth checks pass.
- Do not store tokens in localStorage.
- Do not expose backend secrets.
```

## Acceptance Criteria

```txt
- Sign up works.
- Sign in works.
- Logout works.
- Auth bootstrap works.
- Protected route gating works.
- Email verification screens work.
- Password reset screens work.
- Apollo refresh flow works.
- Typecheck passes.
- Format check passes.
- Lint passes.
- No frontend secrets are present.
- git status is clean after commit.
```

## Expected Commit Message

```txt
TASK-14.15 Add frontend auth final checks
```

---

## Epic Completion Criteria

EPIC-14 is complete when:

```txt
- Auth dependencies are installed.
- Auth GraphQL documents exist.
- Auth generated types exist.
- Token storage services exist.
- Access token is memory only.
- Native refresh token uses SecureStore.
- Web does not store tokens in localStorage/sessionStorage.
- Auth state store exists.
- Apollo auth link exists.
- Apollo refresh retry runs once.
- Auth provider bootstraps session.
- Protected route gating works.
- Sign in screen works.
- Sign up screen works.
- Logout works.
- Email verification screens work.
- Password reset screens work.
- Google login foundation exists.
- implementation follows docs/domain/auth-token-strategy.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/15-frontend-decks-cards.md
```

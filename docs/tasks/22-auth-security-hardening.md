# EPIC-22 Auth Security & UX Hardening

## Epic Goal

Fix auth security and UX issues discovered after MVP release prep.

This epic covers:

```txt
- password field masking on web
- transport security documentation and production HTTPS guard
- API logging audit for sensitive auth data
- auth route bootstrapping and redirect UX
- web session persistence via httpOnly refresh token cookie
- auth session smoke test updates
- production HSTS headers
```

This epic does not add major new product features.

Out of scope:

```txt
- client-side password hashing before send
- SRP / WebAuthn / passkeys
- changing native mobile SecureStore strategy
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/deployment/mvp-deployment.md
docs/release/mvp-smoke-tests.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/02-auth.md
docs/tasks/14-frontend-auth.md
docs/tasks/20-deployment-mvp.md
docs/tasks/21-mvp-polish-and-release.md
```

## Epic Prerequisites

EPIC-21 should be complete.

Expected state:

```txt
- MVP flows work locally and in production-like environments.
- Auth login/register/refresh/logout work on mobile and web.
- Web app uses Tamagui primitives for forms.
- CORS credentials are enabled on API.
- security-checklist and auth-token-strategy documents exist.
```

## Epic Rules

```txt
1. Follow docs/domain/auth-token-strategy.md exactly.
2. Follow docs/security/security-checklist.md exactly.
3. Do not store access tokens in localStorage or sessionStorage.
4. Do not store refresh tokens in localStorage or sessionStorage on web.
5. Do not log passwords, access tokens, or refresh tokens.
6. Do not weaken backend validation or permission checks.
7. Do not commit real secrets.
8. Mobile refresh token flow must remain unchanged (SecureStore + body payload).
9. One task equals one focused commit.
10. Run all commands listed in each task before committing.
```

## Recommended Task Order

```txt
22.01 → 22.02 → 22.03   password masking
22.09 → 22.10            auth routing UX
22.11 → 22.12 → 22.13 → 22.14   web session cookie flow
22.04 → 22.05 → 22.06   HTTPS transport
22.07 → 22.08            logging audit
22.15                    HSTS (last)
```

## Epic Summary

```md
- [x] TASK-22.01 Fix password masking on web in AppInput
- [x] TASK-22.02 Audit all password fields
- [x] TASK-22.03 Add web password masking smoke check
- [x] TASK-22.04 Add production HTTPS guard for API URL
- [x] TASK-22.05 Update security checklist for credentials in transit
- [x] TASK-22.06 Update deployment guide HTTPS requirements
- [x] TASK-22.07 Audit API logging for password leakage
- [ ] TASK-22.08 Add auth logging safety test
- [ ] TASK-22.09 Add bootstrapping guards to auth screens
- [ ] TASK-22.10 Add shared auth redirect helper
- [ ] TASK-22.11 Backend httpOnly refresh token cookie for web
- [ ] TASK-22.12 Frontend web cookie-based session restore
- [ ] TASK-22.13 Update auth-token-strategy for web cookie flow
- [ ] TASK-22.14 Update auth session smoke tests
- [ ] TASK-22.15 Add HSTS headers on production API
```

---

# TASK-22.01 Fix password masking on web in AppInput

## Status

DONE

## Context

Auth forms pass `secureTextEntry` to password fields, but `AppInput` wraps Tamagui `Input`. On web, Tamagui does not reliably map `secureTextEntry` to `type="password"`, so passwords are visible in plain text.

This is the same class of web compatibility issue as the earlier `AppText` fix.

## Goal

Ensure password inputs are masked on web.

## Related Documents

```txt
docs/security/security-checklist.md
docs/tasks/14-frontend-auth.md
docs/tasks/21-mvp-polish-and-release.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/ui/primitives/app-input.tsx
```

## Requirements

```txt
1. When Platform.OS === 'web' and secureTextEntry is true, render a web-safe password input.
2. Prefer react-native TextInput with secureTextEntry, similar to AppText web handling.
3. Preserve existing Tamagui Input behavior on native platforms.
4. Forward accessibility props, placeholder, value, onChangeText, autoComplete, and style.
5. Do not break non-password inputs.
```

## Security Requirements

```txt
- Password characters must not be visible on web.
- Do not log input values.
- Do not store password values outside form state.
```

## Architecture Constraints

```txt
- Keep change limited to AppInput primitive.
- Do not refactor unrelated UI components.
```

## Acceptance Criteria

```txt
- Password fields show masked characters on web.
- Email and other text inputs still work on web and native.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Open sign-in on web.
- Type in password field.
- Confirm characters are masked.
```

## Do Not Do

```txt
- Do not change auth mutation payloads.
- Do not add password visibility toggle unless explicitly requested later.
```

## Expected Commit Message

```txt
TASK-22.01 Fix password masking on web in AppInput
```

---

# TASK-22.02 Audit all password fields

## Status

DONE

## Context

After fixing `AppInput`, all auth password fields must consistently use `secureTextEntry`.

## Goal

Verify and fix all password and confirm-password fields across auth forms.

## Related Documents

```txt
docs/tasks/14-frontend-auth.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/auth/components/sign-in-form.tsx
apps/mobile/src/features/auth/components/sign-up-form.tsx
apps/mobile/src/features/auth/components/reset-password-form.tsx
```

Only modify files that are missing `secureTextEntry` or use incorrect props.

## Requirements

```txt
1. Confirm sign-in password field uses secureTextEntry.
2. Confirm sign-up password and confirm password fields use secureTextEntry.
3. Confirm reset password and confirm password fields use secureTextEntry.
4. Use appropriate autoComplete values:
   - current-password for sign-in
   - new-password for sign-up and reset flows
5. Fix any field that does not mask correctly.
```

## Security Requirements

```txt
- All password inputs must use secureTextEntry.
- Do not expose password values in component logs.
```

## Acceptance Criteria

```txt
- All auth password fields use secureTextEntry.
- No plaintext password fields remain in auth forms.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Check sign-in, sign-up, and reset-password screens on web.
- Confirm all password fields are masked.
```

## Do Not Do

```txt
- Do not change validation rules unless a field is broken.
- Do not refactor unrelated auth logic.
```

## Expected Commit Message

```txt
TASK-22.02 Audit all password fields
```

---

# TASK-22.03 Add web password masking smoke check

## Status

DONE

## Context

Release smoke tests should cover the password masking regression.

## Goal

Add manual smoke test steps for masked password fields on web.

## Related Documents

```txt
docs/release/mvp-smoke-tests.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/release/mvp-smoke-tests.md
```

## Requirements

```txt
1. Add smoke test section for web password masking.
2. Include steps for sign-in, sign-up, and reset-password screens.
3. Expected result: password characters are masked on web.
4. Use placeholder credentials only.
5. Do not include real secrets.
```

## Security Requirements

```txt
- Use demo/placeholder credentials only.
- Do not include real passwords or API keys.
```

## Acceptance Criteria

```txt
- Smoke test doc includes web password masking checks.
- Steps are clear and repeatable.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change application code in this task.
```

## Expected Commit Message

```txt
TASK-22.03 Add web password masking smoke check
```

---

# TASK-22.04 Add production HTTPS guard for API URL

## Status

DONE

## Context

Locally the API URL is `http://localhost:3000/graphql`. In production builds, credentials must travel over HTTPS. The frontend should fail fast or warn when a production build points to an insecure API URL.

## Goal

Add a runtime guard for `EXPO_PUBLIC_API_URL` in production web builds.

## Related Documents

```txt
docs/security/security-checklist.md
docs/deployment/mvp-deployment.md
docs/domain/auth-token-strategy.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/config/env.ts
```

Create helper file only if it keeps env.ts readable:

```txt
apps/mobile/src/config/validate-api-url.ts
```

## Requirements

```txt
1. Allow http://localhost and http://127.0.0.1 for local development.
2. In production builds (__DEV__ === false), reject http:// API URLs except localhost.
3. Throw a clear startup error or console error that names EXPO_PUBLIC_API_URL.
4. Do not put secrets in error messages.
5. Keep default localhost fallback for development.
```

Example allowed:

```txt
http://localhost:3000/graphql
https://api.example.com/graphql
```

Example rejected in production:

```txt
http://api.example.com/graphql
```

## Security Requirements

```txt
- Do not expose secret values in errors.
- Do not weaken local development behavior.
- Guard applies to public API URL only.
```

## Acceptance Criteria

```txt
- Production build guard exists for insecure API URLs.
- Localhost http URLs still work in development.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Confirm development still starts with localhost http URL.
```

## Do Not Do

```txt
- Do not change backend code.
- Do not force https for localhost.
```

## Expected Commit Message

```txt
TASK-22.04 Add production HTTPS guard for API URL
```

---

# TASK-22.05 Update security checklist for credentials in transit

## Status

DONE

## Context

Users may see login credentials in browser DevTools and assume the app is insecure. Documentation must explain transport security expectations.

## Goal

Document TLS requirements and DevTools visibility vs network encryption.

## Related Documents

```txt
docs/security/security-checklist.md
docs/domain/auth-token-strategy.md
docs/deployment/mvp-deployment.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/security/security-checklist.md
```

## Requirements

```txt
1. Add section on credentials in transit.
2. State that email/password auth sends credentials in request body over HTTPS in production.
3. Explain that DevTools can show request body locally; network transport must use TLS in production.
4. State that passwords must never be logged server-side.
5. Reference EXPO_PUBLIC_API_URL https requirement for production web.
6. Keep existing password hashing and token rules unchanged.
```

## Security Requirements

```txt
- Do not add real secrets or credentials to documentation.
- Do not recommend client-side password hashing as a substitute for TLS.
```

## Acceptance Criteria

```txt
- Security checklist includes credentials-in-transit guidance.
- Production HTTPS requirement is documented clearly.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change application code in this task.
```

## Expected Commit Message

```txt
TASK-22.05 Update security checklist for credentials in transit
```

---

# TASK-22.06 Update deployment guide HTTPS requirements

## Status

DONE

## Context

Deployment documentation must match the production HTTPS guard and security checklist.

## Goal

Document that production web must use HTTPS GraphQL URL.

## Related Documents

```txt
docs/deployment/mvp-deployment.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/deployment/mvp-deployment.md
```

## Requirements

```txt
1. Document production EXPO_PUBLIC_API_URL must use https://.
2. Add note that localhost http is development-only.
3. Mention CORS_ORIGIN must match deployed web origin.
4. Mention credentials/cookies require HTTPS in production for refresh token cookies.
5. Use placeholder domains only.
```

## Security Requirements

```txt
- Do not include real production URLs with secrets.
- Use example.com placeholders.
```

## Acceptance Criteria

```txt
- Deployment guide documents HTTPS API URL requirement.
- Cookie/credentials note is included if task 22.11 is complete or referenced as prerequisite.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change hosting config files unless a one-line comment is needed.
```

## Expected Commit Message

```txt
TASK-22.06 Update deployment guide HTTPS requirements
```

---

# TASK-22.07 Audit API logging for password leakage

## Status

DONE

## Context

Auth mutations receive plaintext passwords in GraphQL variables. The API must never log those values.

## Goal

Audit observability and logging paths to confirm passwords and tokens are not logged.

## Related Documents

```txt
docs/security/security-checklist.md
apps/api/src/common/observability/sanitize-log-message.ts
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/common/observability/sanitize-log-message.ts
```

Modify other logging files only if audit finds gaps.

## Requirements

```txt
1. Review sanitize-log-message.ts redaction patterns.
2. Search API codebase for logging of request body, GraphQL variables, or auth inputs.
3. Add redaction patterns if needed for JSON-style password fields, for example "password":"value".
4. Confirm login/register/reset use cases do not log input.password.
5. Document findings in code comments only if necessary; prefer fixing gaps silently.
```

## Security Requirements

```txt
- Never log password, accessToken, or refreshToken values.
- Redact Bearer tokens in logs.
- Do not log DATABASE_URL or API keys.
```

## Acceptance Criteria

```txt
- Audit complete with fixes for any logging gaps found.
- sanitize-log-message covers common password JSON patterns if applicable.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Grep codebase for log statements near auth resolver and use cases.
```

## Do Not Do

```txt
- Do not add verbose request logging.
- Do not change auth business logic.
```

## Expected Commit Message

```txt
TASK-22.07 Audit API logging for password leakage
```

---

# TASK-22.08 Add auth logging safety test

## Status

TODO

## Context

Logging redaction should be covered by automated tests to prevent regressions.

## Goal

Add unit tests for password and token redaction in log sanitization.

## Related Documents

```txt
docs/security/security-checklist.md
apps/api/src/common/observability/sanitize-log-message.ts
```

## Files to Create

```txt
apps/api/src/common/observability/sanitize-log-message.spec.ts
```

Only if test file does not already exist.

## Files to Modify

```txt
apps/api/src/common/observability/sanitize-log-message.ts
```

Only if tests reveal missing patterns.

## Requirements

```txt
1. Test redaction of password=value and password: value patterns.
2. Test redaction of Bearer tokens.
3. Test redaction does not break normal log messages.
4. Keep tests focused on sanitizeLogMessage helper.
```

## Security Requirements

```txt
- Use fake passwords/tokens in tests only.
- Do not use real secrets in test fixtures.
```

## Acceptance Criteria

```txt
- sanitize-log-message tests exist and pass.
- Password and Bearer patterns are covered.
- API tests pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- sanitize-log-message
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add integration tests that log real auth payloads unless fully redacted.
```

## Expected Commit Message

```txt
TASK-22.08 Add auth logging safety test
```

---

# TASK-22.09 Add bootstrapping guards to auth screens

## Status

TODO

## Context

`app/index.tsx` waits for `isBootstrapping` before redirecting. Auth screens like sign-in do not, so users may briefly see the login form while session restore is in progress.

## Goal

Show loading state on auth screens until bootstrap completes.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/tasks/14-frontend-auth.md
apps/mobile/app/index.tsx
apps/mobile/app/(auth)/sign-in.tsx
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/app/(auth)/sign-in.tsx
apps/mobile/app/(auth)/sign-up.tsx
```

Modify other auth screens only if they show the same flash issue.

## Requirements

```txt
1. Read isBootstrapping from useAuth.
2. While isBootstrapping is true, render LoadingState inside Screen.
3. After bootstrap, keep existing authenticated redirect behavior.
4. Match UX used in app/index.tsx and (tabs)/_layout.tsx.
```

## Security Requirements

```txt
- Do not expose tokens in loading UI.
- Do not skip bootstrap wait before showing auth forms.
```

## Acceptance Criteria

```txt
- Sign-in and sign-up wait for bootstrap before rendering forms.
- Authenticated users still redirect away from auth screens.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Reload web app while logged in.
- Confirm login form does not flash before redirect.
```

## Do Not Do

```txt
- Do not change bootstrap logic in this task.
- Do not implement cookie session persistence here.
```

## Expected Commit Message

```txt
TASK-22.09 Add bootstrapping guards to auth screens
```

---

# TASK-22.10 Add shared auth redirect helper

## Status

TODO

## Context

Auth redirect logic is duplicated across index, sign-in, sign-up, and tabs layout.

## Goal

Centralize authenticated vs unauthenticated redirect behavior.

## Related Documents

```txt
docs/tasks/14-frontend-auth.md
apps/mobile/src/features/auth/utils/get-post-auth-redirect.ts
```

## Files to Create

```txt
apps/mobile/src/features/auth/hooks/use-auth-gate.tsx
```

Alternative name allowed if consistent: `use-auth-redirect.tsx`.

## Files to Modify

```txt
apps/mobile/app/index.tsx
apps/mobile/app/(auth)/sign-in.tsx
apps/mobile/app/(auth)/sign-up.tsx
apps/mobile/app/(tabs)/_layout.tsx
```

## Requirements

```txt
1. Create hook or helper that handles:
   - isBootstrapping → loading UI
   - isAuthenticated + user → redirect to getPostAuthRedirectHref(user)
   - unauthenticated on protected route → redirect to sign-in
2. Reuse existing getPostAuthRedirectHref utility.
3. Keep behavior equivalent to current screens.
4. Export hook from auth feature if appropriate.
```

Example return shape:

```ts
type AuthGateResult =
  | { status: 'loading' }
  | { status: 'redirect'; href: string }
  | { status: 'ready' }
```

## Security Requirements

```txt
- Do not expose tokens in hook API.
- Redirect logic must not bypass bootstrap.
```

## Acceptance Criteria

```txt
- Shared auth gate helper exists.
- index, sign-in, sign-up, and tabs layout use it.
- No behavior regression for authenticated/unauthenticated users.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Visit / while logged out → sign-in.
- Visit / while logged in → tabs or verify-email prompt.
- Visit /sign-in while logged in → redirect to app.
```

## Do Not Do

```txt
- Do not change token storage in this task.
- Do not refactor unrelated routes.
```

## Expected Commit Message

```txt
TASK-22.10 Add shared auth redirect helper
```

---

# TASK-22.11 Backend httpOnly refresh token cookie for web

## Status

TODO

## Context

Web refresh tokens are currently stored in memory only and are lost on page reload. `auth-token-strategy.md` specifies httpOnly secure cookies as the preferred web strategy. CORS credentials are already enabled in `main.ts`.

## Goal

Set and rotate refresh tokens via httpOnly cookie for web clients while keeping mobile body-based flow.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/02-auth.md
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
```

## Files to Create

```txt
apps/api/src/modules/auth/presentation/http/refresh-token-cookie.service.ts
```

Or equivalent infrastructure service under auth module.

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/presentation/graphql/types/auth-payload.type.ts
apps/api/src/modules/auth/presentation/graphql/inputs/refresh-token.input.ts
apps/api/src/modules/auth/presentation/graphql/inputs/logout.input.ts
apps/api/src/modules/auth/auth.module.ts
```

Add tests under existing auth test patterns.

## Requirements

```txt
1. On login, register, and refreshToken mutations:
   - Set httpOnly refresh token cookie on the response.
   - Cookie name: flashcards.refreshToken (or match REFRESH_TOKEN_KEY convention).
2. Cookie attributes:
   - httpOnly: true
   - secure: true in production
   - sameSite: lax
   - path: /
3. On logout:
   - Clear refresh token cookie.
   - Keep existing refresh token revocation behavior.
4. refreshToken mutation:
   - Accept refresh token from cookie when input.refreshToken is absent.
   - Keep body refreshToken for mobile clients.
5. AuthPayload GraphQL type:
   - Make refreshToken nullable/optional for web cookie flow.
   - Mobile clients continue receiving refreshToken in response body.
6. Detect web vs mobile only if needed; prefer cookie-first with body fallback.
7. Use NestJS @Context() or @Res({ passthrough: true }) for cookie handling in resolver layer only.
8. Do not put cookie logic inside use cases.
```

## Security Requirements

```txt
- Cookie must be httpOnly.
- Cookie must be secure in production.
- Do not log raw refresh tokens.
- Do not return passwordHash.
- Mobile SecureStore flow must remain working.
- CORS origin must remain explicit; no wildcard in production.
```

## Architecture Constraints

```txt
- Resolvers call use cases; use cases stay cookie-agnostic.
- Cookie read/write stays in presentation/infrastructure layer.
- Do not access Prisma from resolver directly.
```

## Acceptance Criteria

```txt
- Login/register/refresh set refresh token cookie.
- Logout clears cookie and revokes token.
- refreshToken works with cookie-only input for web.
- refreshToken still works with body input for mobile.
- Auth tests updated or added.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api test -- auth
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Login from web client with credentials:include.
- Confirm Set-Cookie header is present.
- Confirm refresh works using cookie without body refreshToken.
```

## Do Not Do

```txt
- Do not store refresh token in localStorage.
- Do not change Argon2 password hashing.
- Do not break existing mobile login flow.
```

## Expected Commit Message

```txt
TASK-22.11 Backend httpOnly refresh token cookie for web
```

---

# TASK-22.12 Frontend web cookie-based session restore

## Status

TODO

## Context

After backend cookie support (TASK-22.11), the web client must send cookies and stop relying on in-memory refresh tokens.

## Goal

Restore web sessions across page reload using httpOnly refresh token cookie.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/14-frontend-auth.md
apps/mobile/src/features/auth/services/refresh-token-storage.ts
apps/mobile/src/features/auth/services/bootstrap-auth.ts
apps/mobile/src/features/auth/services/auth-session.ts
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/auth/services/refresh-token-storage.ts
apps/mobile/src/features/auth/services/bootstrap-auth.ts
apps/mobile/src/features/auth/services/auth-session.ts
apps/mobile/src/features/auth/hooks/use-logout.ts
apps/mobile/src/graphql/apollo-client.ts
apps/mobile/src/features/auth/graphql/auth.graphql
```

Update generated types via codegen if GraphQL schema changes.

## Requirements

```txt
1. On web (Platform.OS === 'web'):
   - Do not store refresh token in memory variable.
   - Use credentials: 'include' on auth fetch calls and Apollo HttpLink.
   - bootstrapAuth attempts refresh even when getRefreshToken returns null.
   - applyAuthPayload stores access token in memory only; ignore body refreshToken if absent.
2. On native:
   - Keep SecureStore refresh token behavior unchanged.
3. performRefreshToken on web:
   - Call refreshToken mutation without body refreshToken when cookie is used.
   - Send credentials: 'include'.
4. Logout on web:
   - Call logout mutation with credentials: 'include'.
   - Clear local access token and auth state even if cookie clear depends on backend.
5. Regenerate GraphQL types if refreshToken field becomes optional in AuthPayload.
```

## Security Requirements

```txt
- Do not store refresh token in localStorage or sessionStorage.
- Access token remains memory-only.
- Do not log tokens.
- credentials:include only for same-site/trusted API origin.
```

## Acceptance Criteria

```txt
- Web login survives page reload on /.
- Native login flow still works.
- Logout clears web session.
- Mobile typecheck passes.
- build:web passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Login on web.
- Navigate to /.
- Reload page.
- Confirm user stays authenticated and lands in app, not sign-in.
- Logout and reload; confirm sign-in is shown.
```

## Do Not Do

```txt
- Do not use localStorage for refresh token fallback.
- Do not change backend cookie logic in this task except codegen updates.
```

## Expected Commit Message

```txt
TASK-22.12 Frontend web cookie-based session restore
```

---

# TASK-22.13 Update auth-token-strategy for web cookie flow

## Status

TODO

## Context

Documentation must reflect the implemented httpOnly cookie flow for web refresh tokens.

## Goal

Update auth token strategy to document current web behavior.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/14-frontend-auth.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/domain/auth-token-strategy.md
docs/tasks/14-frontend-auth.md
```

Update EPIC-14 token storage section only if it still describes memory-only web refresh as current MVP behavior.

## Requirements

```txt
1. Document web refresh token httpOnly cookie flow as implemented.
2. Document mobile refresh token remains in SecureStore with body payload.
3. Document access token remains memory-only on all platforms.
4. Remove or update "allowed MVP fallback" that requires re-login after every reload.
5. Document cookie attributes and CORS credentials requirement.
6. Document nullable refreshToken in GraphQL payload for web.
```

## Security Requirements

```txt
- Do not include real cookie values or secrets.
- Keep forbidden storage rules for localStorage/sessionStorage.
```

## Acceptance Criteria

```txt
- auth-token-strategy.md matches implemented behavior.
- EPIC-14 frontend auth doc is consistent.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change application code in this task.
```

## Expected Commit Message

```txt
TASK-22.13 Update auth-token-strategy for web cookie flow
```

---

# TASK-22.14 Update auth session smoke tests

## Status

TODO

## Context

Smoke tests must cover session persistence and auth redirect behavior after EPIC-22 changes.

## Goal

Add smoke test cases for web session restore and auth route redirects.

## Related Documents

```txt
docs/release/mvp-smoke-tests.md
docs/domain/auth-token-strategy.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/release/mvp-smoke-tests.md
```

## Requirements

```txt
1. Add smoke test: login on web → visit / → reload → user remains authenticated.
2. Add smoke test: logged-in user visiting /sign-in redirects to app home/tabs.
3. Add smoke test: logout clears session on reload.
4. Add smoke test: password fields masked on web (may reference TASK-22.03 if already added).
5. Use placeholder credentials only.
6. Include pass/fail checkbox for each test.
```

## Security Requirements

```txt
- Use demo@example.com or placeholders only.
- Do not include real secrets.
```

## Acceptance Criteria

```txt
- Smoke tests cover session persistence and auth redirects.
- Steps are repeatable for manual QA.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Run new smoke tests locally once before commit.
```

## Do Not Do

```txt
- Do not change application code in this task.
```

## Expected Commit Message

```txt
TASK-22.14 Update auth session smoke tests
```

---

# TASK-22.15 Add HSTS headers on production API

## Status

TODO

## Context

Production API should send Strict-Transport-Security to reduce downgrade attacks.

## Goal

Add HSTS header when running in production.

## Related Documents

```txt
docs/security/security-checklist.md
docs/deployment/mvp-deployment.md
apps/api/src/main.ts
```

## Files to Create

```txt
apps/api/src/common/http/hsts.middleware.ts
```

Or use helmet if already in project — prefer minimal custom middleware if no helmet dependency.

## Files to Modify

```txt
apps/api/src/main.ts
apps/api/src/app.module.ts
```

Only if middleware registration requires module change.

## Requirements

```txt
1. Set Strict-Transport-Security header only when NODE_ENV=production.
2. Recommended value: max-age=31536000; includeSubDomains
3. Do not set HSTS in local development.
4. Apply to all API responses or globally via middleware.
5. Do not break GraphQL or health endpoints.
```

## Security Requirements

```txt
- HSTS only in production.
- Do not log secrets in middleware.
```

## Acceptance Criteria

```txt
- Production bootstrap applies HSTS middleware.
- Development does not send HSTS header.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Optional: inspect response headers in production or simulated production env.
```

## Do Not Do

```txt
- Do not add helmet dependency unless project already uses it.
- Do not change CORS configuration in this task.
```

## Expected Commit Message

```txt
TASK-22.15 Add HSTS headers on production API
```

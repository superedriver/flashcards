# EPIC-25 Bugfixes (post–EPIC-24 smoke)

## Epic Goal

Fix bugs found during manual verification of EPIC-24 and related local smoke.

This epic covers:

```txt
- critical auth/API regressions that block local smoke
- web UI regressions in shared primitives (e.g. password fields)
- follow-up bugs discovered while re-running study-languages smoke
```

This epic does **not** add new product features.

New bugs found during smoke should be appended here as new TASK-25.XX items (one bug ≈ one task ≈ one commit).

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/02-auth.md
docs/tasks/14-frontend-auth.md
docs/tasks/22-auth-security-hardening.md
docs/tasks/24-study-languages.md
docs/smoke/study-languages.md
docs/release/mvp-smoke-tests.md
```

## Epic Prerequisites

EPIC-24 should be complete (feature work DONE).

Expected state:

```txt
- Study languages feature code is on main
- Local stack: Postgres + API (:3000) + mobile web (:8081)
- Manual smoke of EPIC-24 in progress or blocked by known bugs below
```

## Known Bugs (backlog source)

```txt
1. register/login crash: Cannot read properties of undefined (reading 'setHeader')
   - Auth resolver sets refresh cookie via context.res, but GraphQL context has no res
2. Web Sign Up/Sign In password fields: collapsed height / missing border
   - AppInput web secureTextEntry path uses unstyled RN TextInput (after TASK-22.01)
```

## Epic Rules

```txt
1. One task = one focused bugfix = one commit.
2. Do not add features or drive-by refactors.
3. Prefer smallest fix that restores acceptance / smoke.
4. Keep auth-token-strategy and security-checklist rules.
5. Do not weaken validation or permissions.
6. Do not commit secrets.
7. After each fix, re-check the manual step that failed.
8. When a new smoke bug appears, add TASK-25.XX before fixing it.
9. Run Commands to Run in each task before committing.
10. Mark epic DONE only when known checklist bugs are fixed and smoke can proceed.
```

## Recommended Task Order

```txt
25.01   GraphQL context res (blocks register/login)
25.02   Web password field layout
(+ append new bugs in discovery order)
```

## Epic Summary

```md
- [x] TASK-25.01 Fix GraphQL context to expose Express res for auth cookies
- [ ] TASK-25.02 Fix web password field layout in AppInput
```

---

# TASK-25.01 Fix GraphQL context to expose Express res for auth cookies

## Status

DONE

## Context

During local EPIC-24 smoke, Sign Up / Sign In fail with:

```txt
Cannot read properties of undefined (reading 'setHeader')
```

`AuthResolver` calls `RefreshTokenCookieService.setRefreshTokenCookie(context.res, …)` on `register`, `login`, `refreshToken`, and `logout`.

`GraphQLModule.forRoot` in `apps/api/src/app.module.ts` does not provide `context: ({ req, res }) => ({ req, res })`, so `context.res` is undefined.

Related symptoms: client may show `Session expired` when stale tokens trigger refresh that also needs `res`.

## Goal

GraphQL context always includes Express `req` and `res` so auth cookie set/clear works on web.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/tasks/22-auth-security-hardening.md
apps/api/src/app.module.ts
apps/api/src/modules/auth/presentation/graphql/resolvers/auth.resolver.ts
apps/api/src/modules/auth/presentation/http/refresh-token-cookie.service.ts
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

Optional (only if needed for coverage):

```txt
apps/api/src/modules/auth/**/*.spec.ts
```

## Requirements

```txt
1. Add GraphQL context factory: ({ req, res }) => ({ req, res }).
2. Do not change cookie name, flags, or auth use-case logic unless required.
3. register / login / refreshToken / logout must set or clear refresh cookie without throwing.
4. Keep playground and existing GraphQL operations working.
```

## Security Requirements

```txt
- Do not log refresh tokens or cookie values.
- Do not move refresh tokens to localStorage/sessionStorage.
- Keep httpOnly cookie behavior for web.
```

## Architecture Constraints

```txt
- Fix belongs in GraphQL module config / HTTP boundary, not in use cases.
- Resolvers may keep using context.res via RefreshTokenCookieService.
```

## Acceptance Criteria

```txt
- register mutation succeeds without setHeader error.
- login mutation succeeds without setHeader error.
- Web Sign Up reaches study-language onboarding (or next post-auth screen).
- API build/tests for auth area still pass.
```

## Commands to Run

```txt
cd apps/api && pnpm exec tsc --noEmit -p tsconfig.build.json
cd apps/api && pnpm test -- --testPathPatterns=auth
```

Manual check:

```txt
1. Restart API (pnpm dev:api)
2. Clear site data for localhost:8081
3. Sign Up with a fresh email → no setHeader / Session expired error
```

## Expected Commit Message

```txt
TASK-25.01 Fix GraphQL context to expose Express res for auth cookies
```

---

# TASK-25.02 Fix web password field layout in AppInput

## Status

TODO

## Context

On web Sign Up (`pnpm mobile:web`), Password and Confirm password fields render broken:

```txt
- Password input height collapses; placeholder text is clipped
- Confirm password loses the bordered box styling used by Email
```

Root cause: TASK-22.01 switched web `secureTextEntry` inputs to bare `react-native` `TextInput` for masking, without applying Tamagui `Input`-equivalent layout styles.

## Goal

Password fields on web match Email field height, padding, and border while remaining masked.

## Related Documents

```txt
docs/tasks/22-auth-security-hardening.md
docs/tasks/14-frontend-auth.md
apps/mobile/src/ui/primitives/app-input.tsx
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
1. Keep web password masking (secureTextEntry / type=password from TASK-22.01).
2. Apply explicit web styles so password TextInput matches Email/AppInput size:
   - min height comparable to Tamagui Input
   - padding, border, borderRadius, readable font (no clipped placeholder)
3. Cover Sign Up, Sign In, and reset-password fields using AppInput + secureTextEntry.
4. Do not break non-password AppInput on web or native.
5. Do not add a show/hide password toggle.
```

## Security Requirements

```txt
- Password characters must remain masked on web.
- Do not log password values.
```

## Architecture Constraints

```txt
- Fix in shared AppInput primitive only (unless a tiny shared style helper is needed).
- Do not change auth form validation logic.
```

## Acceptance Criteria

```txt
- On web Sign Up, Password and Confirm password look like Email.
- Placeholder text is not clipped.
- Typed characters remain masked on web.
- Sign In password field looks correct on web.
- Native password fields still work.
```

## Commands to Run

```txt
cd apps/mobile && pnpm typecheck
cd apps/mobile && pnpm lint
```

Manual check:

```txt
1. pnpm mobile:web → Sign Up
2. Password + Confirm password match Email layout
3. Type into password fields → masked
4. Spot-check Sign In password field
```

## Expected Commit Message

```txt
TASK-25.02 Fix web password field layout in AppInput
```

# EPIC-36 Security Hardening

## Epic Goal

Apply post-MVP security hardening to the API: rate limiting on auth endpoints, GraphQL query depth limit, and a forward-compatible note on admin role freshness.

This epic covers:

```txt
- @nestjs/throttler on login, register, requestPasswordReset
- graphql-depth-limit to prevent deeply nested query abuse
- Admin role: document and optionally implement reading role from DB in GqlAuthGuard
```

This epic does **not** include:

```txt
- Changing the existing auth flow or JWT strategy
- OAuth or third-party auth
- IP banning or CAPTCHA
- Frontend changes (rate limit errors use existing error handling)
- Any changes to account deletion, blocked-user logic, or SRS
```

## Epic Status

TODO

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
docs/tasks/done/02-auth.md
docs/tasks/done/22-auth-security-hardening.md
docs/tasks/done/35-account-deletion-prod-gaps.md
```

## Epic Prerequisites

EPIC-35 is complete (in `docs/tasks/done/`).

Expected state:

```txt
- NestJS API running on Render
- GqlAuthGuard checks JWT validity + User row exists
- Auth module: login, register, refreshToken, requestPasswordReset, resetPassword
- No rate limiting on any endpoint yet
- No GraphQL depth limit
```

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not refactor unrelated code.
4. Do not change auth logic, JWT strategy, or GqlAuthGuard behavior beyond what each task asks.
5. Each task's Commands to Run must pass before commit. If blocked, stop and ask.
6. Do not push.
```

## Recommended Task Order

```txt
36.01                            add @nestjs/throttler to auth endpoints
36.02                            add GraphQL depth limit
36.03                            document admin role freshness in GqlAuthGuard
```

## Epic Summary

```md
- [ ] TASK-36.01 Add rate limiting to auth endpoints
- [ ] TASK-36.02 Add GraphQL query depth limit
- [ ] TASK-36.03 Document admin role freshness in GqlAuthGuard
```

---

# TASK-36.01 Add rate limiting to auth endpoints

## Status

TODO

## Context

The API has no rate limiting. Auth endpoints (login, register, requestPasswordReset) are the highest-risk targets for brute-force and credential-stuffing attacks. Adding `@nestjs/throttler` closes this gap before production load.

## Goal

Install `@nestjs/throttler`, configure a global throttle module, and apply stricter per-endpoint limits to `login`, `register`, and `requestPasswordReset` resolvers.

## Related Documents

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/auth-token-strategy.md
docs/security/security-checklist.md
docs/tasks/done/02-auth.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/app.module.ts
apps/api/src/modules/auth/presentation/graphql/auth.resolver.ts
apps/api/package.json
```

## Requirements

```txt
1. Install @nestjs/throttler as a production dependency in apps/api.
2. Register ThrottlerModule.forRoot in AppModule with a sensible global default
   (e.g. 60 requests per 60 seconds per IP).
3. Add APP_GUARD for ThrottlerGuard globally, or apply per-resolver — choose the
   approach that does not break existing non-auth resolvers.
4. Apply a stricter limit on login, register, and requestPasswordReset:
   e.g. 10 requests per 60 seconds per IP using @Throttle().
5. Throttler must use IP as the key (default behavior).
6. On limit exceeded, return HTTP 429 (ThrottlerException default).
```

## Security Requirements

```txt
- Do not expose passwordHash or any token hashes.
- Do not log passwords or tokens.
- Do not commit real secrets.
- Rate limit keys must be IP-based; do not use user ID as the sole key.
```

## Architecture Constraints

```txt
- GraphQL resolver must not contain business logic beyond applying the decorator.
- ThrottlerModule configuration belongs in AppModule.
- Do not change use case or domain code.
- Do not modify GqlAuthGuard.
```

## Implementation Notes

```txt
- @nestjs/throttler v6+ supports GraphQL via GqlExecutionContext; verify the
  version is compatible and override getRequestResponse if needed for GraphQL context.
- If the global guard interferes with public resolvers (health, public decks),
  confirm they still work in manual checks.
- Keep this task focused. Do not add CAPTCHA, IP banning, or Redis backing store.
```

## Acceptance Criteria

```txt
- @nestjs/throttler is installed.
- login, register, requestPasswordReset return 429 after the configured limit.
- Other resolvers are not broken.
- API builds without errors.
- pnpm lint passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Start API locally.
- Call login 11 times in quick succession with any credentials.
- Confirm the 11th call returns 429 Too Many Requests.
- Call a public resolver (e.g. health) and confirm it still responds normally.
```

## Do Not Do

```txt
- Do not add Redis or distributed throttle store (in-memory is fine for MVP).
- Do not add CAPTCHA.
- Do not change JWT strategy or GqlAuthGuard.
- Do not change any use case or domain code.
- Do not push.
```

## Expected Commit Message

```txt
TASK-36.01 Add rate limiting to auth endpoints
```

---

# TASK-36.02 Add GraphQL query depth limit

## Status

TODO

## Context

GraphQL allows arbitrarily nested queries. Without a depth limit, a malicious client can craft deeply nested queries that exhaust server resources. Adding `graphql-depth-limit` is a standard, low-risk hardening step.

## Goal

Install `graphql-depth-limit` and configure it as a GraphQL validation rule so queries deeper than a set limit (e.g. 7) are rejected before execution.

## Related Documents

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/app.module.ts   (or wherever GraphQLModule.forRoot is configured)
apps/api/package.json
```

## Requirements

```txt
1. Install graphql-depth-limit as a production dependency in apps/api.
2. Add depthLimit(7) (or a similar safe value) to the validationRules array
   in GraphQLModule.forRoot configuration.
3. Queries deeper than the limit must be rejected with a validation error
   before reaching any resolver.
4. The limit value should be a named constant, not a magic number.
```

## Security Requirements

```txt
- Do not expose internal schema details in depth-limit error messages beyond
  what GraphQL validation errors already expose.
- Do not commit real secrets.
```

## Architecture Constraints

```txt
- Configuration belongs in GraphQLModule.forRoot, not in individual resolvers.
- Do not change resolver or use case code.
```

## Implementation Notes

```txt
- graphql-depth-limit exports a default function; import and call it with the
  max depth integer.
- Chose 7 as a starting point — enough for nested group/deck/card queries
  but blocks pathological nesting. Adjust if legitimate queries require more.
- If graphql-depth-limit has no types package, add a local .d.ts or use
  @ts-expect-error — do not leave a typecheck error.
```

## Acceptance Criteria

```txt
- graphql-depth-limit is installed.
- A query nested deeper than the limit is rejected with a validation error.
- Normal app queries (decks → cards, groups → members → user) still work.
- API builds without errors.
- pnpm lint passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
- Start API locally.
- Send a GraphQL query nested beyond the limit (e.g. depth 10+).
- Confirm it returns a validation error, not a resolver result.
- Run a normal query (e.g. myDecks → cards) and confirm it succeeds.
```

## Do Not Do

```txt
- Do not add query complexity limits in this task (separate concern).
- Do not change resolver or use case code.
- Do not push.
```

## Expected Commit Message

```txt
TASK-36.02 Add GraphQL query depth limit
```

---

# TASK-36.03 Document admin role freshness in GqlAuthGuard

## Status

TODO

## Context

`GqlAuthGuard` reads the user's `role` from the JWT payload. If an admin's role is changed in the DB while their token is still valid, the guard sees the stale role until the token expires. For the current MVP with a small admin surface this is acceptable, but it should be documented as a known trade-off so future work can evaluate reading `role` from the DB row.

## Goal

Add a comment in `GqlAuthGuard` and a note in `docs/domain/auth-token-strategy.md` documenting the role-freshness trade-off and when to revisit.

## Related Documents

```txt
docs/domain/auth-token-strategy.md
docs/domain/permissions.md
docs/tasks/done/02-auth.md
docs/tasks/done/35-account-deletion-prod-gaps.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/auth/presentation/graphql/gql-auth.guard.ts
docs/domain/auth-token-strategy.md
```

## Requirements

```txt
1. In gql-auth.guard.ts, add a short comment near the role extraction from JWT
   noting that role is read from the token, not the DB, and that a role change
   takes effect only after token expiry or re-login.
2. In docs/domain/auth-token-strategy.md, add a "Role freshness" section that:
   a. States the current behavior (role from JWT payload).
   b. States the trade-off (stale role until expiry).
   c. States when to revisit (if admin operations expand significantly or
      role changes need to take effect immediately).
   d. Describes the alternative (read role from DB row in GqlAuthGuard,
      same DB call already made for user existence check post-EPIC-35).
3. Do not change the actual guard behavior.
```

## Security Requirements

```txt
- This task is documentation-only on the guard side.
- Do not expose passwordHash or any token hash.
- Do not log tokens.
```

## Architecture Constraints

```txt
- Do not change guard behavior or auth flow.
- Comment must be in the guard file, not in a resolver or use case.
```

## Implementation Notes

```txt
- Keep the comment short (1–3 lines). This is not a TODO that needs a ticket;
  it is a known, accepted trade-off for now.
- The docs section should be factual, not alarmist.
```

## Acceptance Criteria

```txt
- gql-auth.guard.ts has a comment explaining role-freshness trade-off.
- docs/domain/auth-token-strategy.md has a Role freshness section.
- Guard behavior is unchanged.
- API builds without errors.
- pnpm lint passes.
```

## Commands to Run

```bash
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
- Do not change guard logic or auth token behavior.
- Do not add a DB call to the guard in this task.
- Do not push.
```

## Expected Commit Message

```txt
TASK-36.03 Document admin role freshness in GqlAuthGuard
```

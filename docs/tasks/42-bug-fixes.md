# EPIC-42 Bug Fixes

## Epic Status

IN PROGRESS

## Related Documents

```txt
docs/architecture.md
docs/backend-clean-architecture.md
```

## Tasks

---

# TASK-42.03 CI: fix pnpm version conflict in GitHub Actions

## Status

DONE

## Context

`pnpm/action-setup@v4` failed with "Multiple versions of pnpm specified" because `version: 9` was set in the workflow AND `"packageManager": "pnpm@9.0.0"` was set in `package.json`. The action requires exactly one source of truth.

## Goal

Remove `version: 9` from `.github/workflows/ci.yml` so the action reads the version from `package.json` automatically.

## Files to Modify

```txt
.github/workflows/ci.yml
```

## Expected Commit Message

```txt
TASK-42.03 CI: fix pnpm version conflict in GitHub Actions
```

---

# TASK-42.02 Backend: add production seed script for languages

## Status

TODO

## Context

The main `seed.ts` is dev-only — it creates demo users, groups, and decks, and is blocked on production unless `ALLOW_PRODUCTION_SEED=true`. On production there are no languages in the DB because there's no safe way to seed only reference data.

## Goal

Add a separate `seed-prod.ts` that seeds only languages (upsert, idempotent) and a `prisma:seed:prod` script in `apps/api/package.json` to run it.

## Related Documents

```txt
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/prisma/seed-prod.ts
```

## Files to Modify

```txt
apps/api/package.json
```

## Requirements

```txt
1. seed-prod.ts imports seedLanguages and runs it — no demo data, no assertSafeToSeed guard.
2. Add script "prisma:seed:prod": "ts-node --project tsconfig.json -r tsconfig-paths/register prisma/seed-prod.ts" to apps/api/package.json (match the pattern of the existing seed script).
3. Script must be safe to run multiple times (upsert-based, already handled by seedLanguages).
```

## Do Not Do

```txt
- Do not modify the existing seed.ts or seedLanguages function.
- Do not add demo data to seed-prod.ts.
```

## Expected Commit Message

```txt
TASK-42.02 Backend: add production seed script for languages
```

---

# TASK-42.01 Backend: fix GqlThrottlerGuard crashing HTTP routes

## Status

TODO

## Context

`GqlThrottlerGuard` is registered globally via `APP_GUARD`. Its `getRequestResponse` override always tries to extract `req/res` from the GQL context — even for plain HTTP routes like `/health`. For HTTP requests the GQL context is empty, so `res` is `undefined`, which causes `TypeError: Cannot read properties of undefined (reading 'header')` and a 500 on every HTTP route.

## Goal

Make `GqlThrottlerGuard` handle both GraphQL and HTTP execution contexts. For HTTP requests, fall back to the standard Express `req/res` from the HTTP context so `/health` and other HTTP routes return 200.

## Related Documents

```txt
docs/backend-clean-architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/common/guards/gql-throttler.guard.ts
```

## Requirements

```txt
1. In getRequestResponse, check context.getType() — if 'graphql', use GqlExecutionContext as before.
2. If 'http', fall back to context.switchToHttp().getRequest() / getResponse().
```

## Do Not Do

```txt
- Do not add @SkipThrottle() to HealthController — the guard should handle both contexts generically.
- Do not change ThrottlerModule config.
```

## Expected Commit Message

```txt
TASK-42.01 Backend: fix GqlThrottlerGuard crashing HTTP routes
```

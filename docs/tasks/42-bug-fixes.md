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

# TASK-42.01 Backend: fix GqlThrottlerGuard crashing HTTP routes

## Status

TODO

## Context

`GqlThrottlerGuard` is registered globally via `APP_GUARD`. Its `getRequestResponse` override always tries to extract `req/res` from the GQL context — even for plain HTTP routes like `/health`. For HTTP requests the GQL context is empty, so `res` is `undefined`, which causes `TypeError: Cannot read properties of undefined (reading 'header')` and a 500 on every HTTP route.

## Goal

Make `GqlThrottlerGuard` handle both GraphQL and HTTP execution contexts. For HTTP requests, fall back to the standard Express `req/res` from the HTTP context.

## Files to Change

```txt
apps/api/src/common/guards/gql-throttler.guard.ts
```

## Expected Commit Message

```txt
TASK-42.01 Backend: fix GqlThrottlerGuard crashing HTTP routes
```

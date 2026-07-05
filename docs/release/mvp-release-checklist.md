# MVP Release Checklist

Single checklist for Flashcards MVP release: code quality, security, deployment, smoke tests, and go/no-go.

Use with:

```txt
docs/release/mvp-release-notes.md
docs/release/mvp-smoke-tests.md
docs/deployment/mvp-deployment.md
```

Do not record real passwords, API keys, or production secrets in this document.

## Release Placeholders

Fill in before production sign-off:

```txt
RELEASE_DATE=<replace>
API_URL=<replace>
WEB_URL=<replace>
```

---

## 1. Code Quality

Run from repository root:

```bash
pnpm format:check
pnpm lint
```

Checklist:

```txt
- [ ] pnpm format:check passes
- [ ] pnpm lint passes
- [ ] No unintended uncommitted changes before tag/release
- [ ] Release notes updated (docs/release/mvp-release-notes.md)
```

---

## 2. Backend Checks

```bash
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api build
```

Checklist:

```txt
- [ ] Prisma schema validates
- [ ] API build succeeds
- [ ] Health endpoint returns 200 locally (GET /health)
- [ ] GraphQL endpoint reachable locally (POST /graphql)
- [ ] Operational logs do not include secrets (see docs/deployment/mvp-deployment.md)
```

---

## 3. Frontend Checks

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

Checklist:

```txt
- [ ] Mobile/web typecheck passes
- [ ] Web static export build succeeds
- [ ] EXPO_PUBLIC_API_URL configured for target environment
- [ ] Auth, deck, lesson, and profile screens load without console errors (spot check)
- [ ] Responsive layout acceptable on mobile and desktop widths (spot check)
```

---

## 4. Database Checks

Checklist:

```txt
- [ ] Production DATABASE_URL set in Render (not committed)
- [ ] prisma migrate deploy runs on Render start
- [ ] No prisma migrate reset in production
- [ ] No prisma db push --force-reset in production
- [ ] Migrations applied successfully after deploy (check Render logs)
- [ ] Demo seed not run in production (local development only)
```

---

## 5. Security Checks

### Secret scan (repository)

Run from repository root. Inspect any unexpected matches manually.

```bash
git grep -n "DATABASE_URL=.*postgres" || true
git grep -n "JWT_ACCESS_SECRET=.*" || true
git grep -n "JWT_REFRESH_SECRET=.*" || true
git grep -n "AI_API_KEY=.*" || true
git grep -n "INTERNAL_JOB_SECRET=.*" || true
git grep -n "RESEND_API_KEY=.*" || true
```

### Frontend security grep

```bash
git grep -n "passwordHash" apps/mobile || true
git grep -n "refreshTokenHash" apps/mobile || true
git grep -n "localStorage" apps/mobile || true
git grep -n "sessionStorage" apps/mobile || true
```

### Security checklist

```txt
- [ ] No real secrets committed to git
- [ ] .env files with production values are not committed
- [ ] JWT_ACCESS_SECRET and JWT_REFRESH_SECRET are strong in production
- [ ] INTERNAL_JOB_SECRET is strong and matches GitHub Actions cron secret
- [ ] Production CORS_ORIGIN allows only WEB_URL (and required origins)
- [ ] Production CORS rejects unknown origins (manual check)
- [ ] Internal job endpoint rejects missing/invalid x-internal-job-secret
- [ ] No passwords, tokens, or API keys in release notes or checklists
```

---

## 6. Deployment Checks

Follow `docs/deployment/mvp-deployment.md`.

Checklist:

```txt
- [ ] Neon PostgreSQL provisioned
- [ ] Render API service deployed and healthy
- [ ] Vercel web app deployed and loads
- [ ] APP_WEB_URL and CORS_ORIGIN updated with Vercel URL
- [ ] Email provider configured for production (if email flows required)
- [ ] AI provider configured or mock accepted for launch
- [ ] GitHub Actions due-card-reminders workflow secrets set
- [ ] Cron workflow runs successfully (manual workflow_dispatch test)
```

Environment placeholders after deploy:

```txt
API_URL=<replace>
WEB_URL=<replace>
```

---

## 7. Smoke Tests

Complete [mvp-smoke-tests.md](./mvp-smoke-tests.md).

### Local (pre-deploy)

```txt
- [ ] Health endpoint
- [ ] Auth (register, login, logout, refresh)
- [ ] Decks and cards CRUD
- [ ] Lesson flow
- [ ] Public decks browse/copy
- [ ] CSV import
- [ ] Profile/settings
- [ ] Groups and admin (if enabled for release)
```

### Production (post-deploy)

```txt
- [ ] Full smoke checklist completed with production API_URL and WEB_URL
- [ ] Email verification works (if Resend configured)
- [ ] Password reset works (if email configured)
- [ ] Production register/login from deployed web app
```

Record PASS/FAIL per section in the smoke test doc. Do not paste secrets into failure notes.

---

## 8. Go / No-Go

### GO only if all of the following are true

```txt
- [ ] Auth works (register, login, logout, session refresh)
- [ ] Deck and card flows work (create, edit, delete)
- [ ] Lesson flow works end-to-end
- [ ] Production CORS is safe (known origin only)
- [ ] No real secrets are committed
- [ ] Smoke tests pass for target environment
- [ ] No known data-loss or auth-breaking bugs open for MVP scope
```

### NO-GO if any of the following

```txt
- Auth or session handling is broken in production
- SRS lesson flow loses progress or corrupts review state
- Deck/card data loss on normal operations
- Production secrets exposed in repo or client bundle
- /health or /graphql unreachable in production
- CORS allows unintended origins
```

### Decision

```txt
Release decision: [ ] GO  [ ] NO-GO
Decided by: <name>
Date: RELEASE_DATE=<replace>
Notes (no secrets):
```

---

## 9. Post-Release Monitoring

First 24–48 hours after release:

```txt
- [ ] Render logs: Application started, Health check status=ok
- [ ] No secret values visible in Render logs
- [ ] Error rate acceptable on auth and GraphQL (spot check logs)
- [ ] Due-card reminder job summary appears after cron run (if enabled)
- [ ] Email delivery summaries success/failure as expected (if configured)
- [ ] User-reported critical issues triaged
```

Log inspection guide: `docs/deployment/mvp-deployment.md` (Safe Log Inspection).

---

## Quick Command Reference

Run all automated checks:

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

---

## Final Check Results (TASK-21.15)

Run date: 2026-07-05

### Command checks

```txt
- [x] pnpm format:check
- [x] pnpm lint
- [x] pnpm --filter @flashcards/api db:validate
- [x] pnpm --filter @flashcards/api build
- [x] pnpm --filter @flashcards/mobile typecheck
- [x] pnpm --filter @flashcards/mobile build:web
```

### Security grep review

```txt
- [x] Secret scan reviewed — placeholders/docs only, no real secrets committed
- [x] apps/mobile — no passwordHash, refreshTokenHash, localStorage, or sessionStorage
```

### Production smoke tests

```txt
- [ ] Pending deployment — complete mvp-smoke-tests.md after Render/Vercel deploy
```

### Release decision

```txt
Repository readiness: GO (EPIC-21 complete)
Production release: NO-GO until deployment + production smoke tests pass
```

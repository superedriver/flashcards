# EPIC-20 Deployment MVP

## Epic Goal

Deploy Flashcards MVP to production-like free-tier infrastructure.

This epic covers:

```txt
- production environment configuration
- Neon PostgreSQL setup
- Render backend deployment
- Vercel or Netlify web deployment
- GitHub Actions CI
- GitHub Actions cron for internal jobs
- database migrations
- CORS configuration
- health checks
- release-safe secret handling
```

MVP target infrastructure:

```txt
Database: Neon PostgreSQL Free
Backend: Render Free
Web: Vercel or Netlify
Cron: GitHub Actions scheduled workflow
Email: Resend primary, Brevo fallback
```

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
docs/tasks/01-backend-foundation.md
docs/tasks/02-auth.md
docs/tasks/03-email-verification-password-reset.md
docs/tasks/11-notifications.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
```

## Epic Prerequisites

EPIC-19 should be complete.

Expected state:

```txt
- Backend API builds.
- Frontend web app builds.
- Prisma schema is stable for MVP.
- Auth works.
- Email verification/password reset works.
- Internal notification job endpoint exists.
- Frontend uses EXPO_PUBLIC_API_URL.
- Backend has environment config validation.
```

## Epic Rules

```txt
1. Follow docs/security/security-checklist.md exactly.
2. Never commit real secrets.
3. Use hosting provider environment variables for secrets.
4. Use GitHub Actions secrets for CI/cron secrets.
5. Production CORS must not use wildcard.
6. Production database migrations must use deploy flow.
7. Do not run destructive database reset in production.
8. Frontend must expose only public-safe EXPO_PUBLIC variables.
9. Backend must fail fast when required production secrets are missing.
10. Internal job endpoint must require INTERNAL_JOB_SECRET.
11. Do not log secrets.
12. Do not expose stack traces in production GraphQL errors.
```

## MVP Deployment Targets

```txt
Neon:
- PostgreSQL database
- DATABASE_URL for API

Render:
- NestJS API
- API URL
- environment variables
- health check endpoint

Vercel or Netlify:
- Expo web build
- EXPO_PUBLIC_API_URL points to Render GraphQL URL

GitHub Actions:
- CI checks
- optional Prisma validate/generate/build
- scheduled due-card reminder HTTP call
```

## Required Production Environment Variables

Backend:

```env
NODE_ENV=production
DATABASE_URL=
APP_WEB_URL=
CORS_ORIGIN=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
INTERNAL_JOB_SECRET=
EMAIL_PROVIDER=resend
RESEND_API_KEY=
BREVO_API_KEY=
EMAIL_FROM=
AI_PROVIDER=mock
AI_API_KEY=
PUSH_PROVIDER=expo
```

Frontend:

```env
EXPO_PUBLIC_API_URL=https://<api-host>/graphql
```

GitHub Actions secrets for cron:

```env
DUE_CARD_REMINDER_JOB_URL=https://<api-host>/internal/jobs/due-card-reminders
INTERNAL_JOB_SECRET=
```

## Epic Summary

```md
- [ ] TASK-20.01 Add backend health endpoint
- [ ] TASK-20.02 Harden backend production config
- [ ] TASK-20.03 Add production CORS configuration
- [ ] TASK-20.04 Add production-safe GraphQL error handling
- [ ] TASK-20.05 Add database migration scripts
- [ ] TASK-20.06 Add Render deployment config
- [ ] TASK-20.07 Add frontend web build config
- [ ] TASK-20.08 Add Vercel or Netlify deployment config
- [ ] TASK-20.09 Add GitHub Actions CI workflow
- [ ] TASK-20.10 Add GitHub Actions cron workflow
- [ ] TASK-20.11 Add deployment documentation
- [ ] TASK-20.12 Add deployment final checks
```

---

# TASK-20.01 Add backend health endpoint

## Status

TODO

## Context

Render needs a simple endpoint to verify the backend is alive.

## Goal

Add health check endpoint.

## Files to Create

```txt
apps/api/src/modules/health/health.module.ts
apps/api/src/modules/health/health.controller.ts
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create endpoint:

```txt
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

Optional fields:

```json
{
  "status": "ok",
  "service": "flashcards-api"
}
```

## Security Requirements

```txt
- Do not expose environment variables.
- Do not expose database URL.
- Do not expose secrets.
- Do not expose detailed system internals.
```

## Acceptance Criteria

```txt
- /health endpoint exists.
- Endpoint returns 200.
- Endpoint does not expose secrets.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
curl http://localhost:3000/health
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): add backend health endpoint
```

---

# TASK-20.02 Harden backend production config

## Status

TODO

## Context

Production API must fail fast if required secrets are missing.

## Goal

Validate production environment variables.

## Files to Modify

```txt
apps/api/src/config/app.config.ts
apps/api/.env.example
```

## Requirements

Ensure production requires:

```txt
DATABASE_URL
APP_WEB_URL
CORS_ORIGIN
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
INTERNAL_JOB_SECRET
```

If email is enabled, require provider secrets:

```txt
EMAIL_PROVIDER=resend -> RESEND_API_KEY
EMAIL_PROVIDER=brevo -> BREVO_API_KEY
EMAIL_FROM
```

If AI provider is Gemini:

```txt
AI_PROVIDER=gemini -> AI_API_KEY
```

If push provider is Expo:

```txt
PUSH_PROVIDER=expo
```

Config validation must:

```txt
- fail fast on missing required production values
- not print secret values
- allow development defaults only in development
```

Update `.env.example` with placeholder values only.

## Security Requirements

```txt
- Do not commit real secrets.
- Do not log secret values.
- Do not use weak default secrets in production.
```

## Acceptance Criteria

```txt
- Production config validates required env vars.
- Missing production secrets fail startup.
- .env.example has placeholders only.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): harden production config validation
```

---

# TASK-20.03 Add production CORS configuration

## Status

TODO

## Context

Production backend must allow only trusted frontend origins.

## Goal

Configure CORS safely.

## Files to Modify

```txt
apps/api/src/main.ts
apps/api/src/config/app.config.ts
apps/api/.env.example
```

## Requirements

CORS behavior:

```txt
development:
- allow localhost Expo/web origins

production:
- allow only CORS_ORIGIN values
- no wildcard
```

`CORS_ORIGIN` may support comma-separated origins:

```env
CORS_ORIGIN=https://flashcards.example.com,https://www.flashcards.example.com
```

Implementation should:

```txt
- parse comma-separated origins
- trim whitespace
- reject empty production origin
- allow credentials only if required by web refresh cookie flow
```

## Security Requirements

```txt
- Production CORS must not be "*".
- Do not allow arbitrary origins in production.
- Do not log secrets.
```

## Acceptance Criteria

```txt
- Development CORS works locally.
- Production CORS uses configured origins.
- Wildcard is not used in production.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): configure production CORS
```

---

# TASK-20.04 Add production-safe GraphQL error handling

## Status

TODO

## Context

Production GraphQL errors must not expose stack traces or internal details.

## Goal

Harden GraphQL error output.

## Files to Modify

```txt
apps/api/src/app.module.ts
apps/api/src/common/errors/*
```

## Requirements

Production GraphQL errors should:

```txt
- return safe message
- return safe code
- hide stack traces
- hide internal exception details
```

Development may include more debug info if useful.

Ensure app-level domain errors map to codes like:

```txt
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
BAD_USER_INPUT
INTERNAL_SERVER_ERROR
```

## Security Requirements

```txt
- Do not expose stack traces in production.
- Do not expose Prisma error internals.
- Do not expose secrets in error messages.
```

## Acceptance Criteria

```txt
- Production GraphQL errors are safe.
- Domain errors keep useful codes.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): harden production GraphQL errors
```

---

# TASK-20.05 Add database migration scripts

## Status

TODO

## Context

Production deployment needs safe migration commands.

## Goal

Add Prisma migration scripts for deployment.

## Files to Modify

```txt
apps/api/package.json
package.json
```

## Requirements

Add API scripts:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:validate": "prisma validate",
    "db:migrate:deploy": "prisma migrate deploy"
  }
}
```

Optional root scripts:

```json
{
  "scripts": {
    "api:db:validate": "pnpm --filter @flashcards/api db:validate",
    "api:db:generate": "pnpm --filter @flashcards/api db:generate",
    "api:db:migrate:deploy": "pnpm --filter @flashcards/api db:migrate:deploy"
  }
}
```

## Production Rule

Use only:

```bash
prisma migrate deploy
```

for production.

Do not use in production:

```bash
prisma migrate reset
prisma db push --force-reset
```

## Security Requirements

```txt
- Do not print DATABASE_URL.
- Do not run destructive reset in production.
```

## Acceptance Criteria

```txt
- Migration deploy script exists.
- Prisma validate script exists.
- Prisma generate script exists.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api db:generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): add database migration scripts
```

---

# TASK-20.06 Add Render deployment config

## Status

TODO

## Context

Backend API will be deployed on Render Free for MVP.

## Goal

Add Render deployment configuration.

## Files to Create

```txt
render.yaml
```

## Requirements

Add Render web service config:

```yaml
services:
  - type: web
    name: flashcards-api
    runtime: node
    plan: free
    rootDir: .
    buildCommand: pnpm install --frozen-lockfile && pnpm --filter @flashcards/api db:generate && pnpm --filter @flashcards/api build
    startCommand: pnpm --filter @flashcards/api db:migrate:deploy && pnpm --filter @flashcards/api start:prod
    healthCheckPath: /health
```

Adjust commands to match actual project scripts.

If Render requires install command separately, document manual setup.

## Required Render Environment Variables

```txt
NODE_ENV
DATABASE_URL
APP_WEB_URL
CORS_ORIGIN
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
INTERNAL_JOB_SECRET
EMAIL_PROVIDER
RESEND_API_KEY
BREVO_API_KEY
EMAIL_FROM
AI_PROVIDER
AI_API_KEY
PUSH_PROVIDER
```

## Security Requirements

```txt
- Do not put real secrets in render.yaml.
- Use Render dashboard environment variables.
- Do not hardcode DATABASE_URL.
```

## Acceptance Criteria

```txt
- render.yaml exists.
- Build command is documented/configured.
- Start command runs migrations safely.
- Health check path is configured.
- No secrets are committed.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): add Render deployment config
```

---

# TASK-20.07 Add frontend web build config

## Status

TODO

## Context

Expo web app needs a build script for deployment.

## Goal

Add frontend web build scripts.

## Files to Modify

```txt
apps/mobile/package.json
package.json
```

## Requirements

Add mobile build script:

```json
{
  "scripts": {
    "build:web": "expo export --platform web"
  }
}
```

Add root script:

```json
{
  "scripts": {
    "mobile:build:web": "pnpm --filter @flashcards/mobile build:web"
  }
}
```

Ensure Expo web output directory is known.

Common output:

```txt
apps/mobile/dist
```

## Security Requirements

```txt
- Frontend build must include only EXPO_PUBLIC_API_URL.
- Do not expose backend secrets.
```

## Acceptance Criteria

```txt
- Web build script exists.
- Web build outputs static files.
- Build works locally.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): add Expo web build script
```

---

# TASK-20.08 Add Vercel or Netlify deployment config

## Status

TODO

## Context

The web app should deploy as static Expo web output.

## Goal

Add deployment config for either Vercel or Netlify.

## Option A: Vercel

## Files to Create

```txt
vercel.json
```

Example:

```json
{
  "buildCommand": "pnpm install --frozen-lockfile && pnpm --filter @flashcards/mobile build:web",
  "outputDirectory": "apps/mobile/dist",
  "framework": null
}
```

## Option B: Netlify

## Files to Create

```txt
netlify.toml
```

Example:

```toml
[build]
  command = "pnpm install --frozen-lockfile && pnpm --filter @flashcards/mobile build:web"
  publish = "apps/mobile/dist"
```

Choose one provider for MVP.

## Required Frontend Environment Variable

```env
EXPO_PUBLIC_API_URL=https://<render-api-host>/graphql
```

## Security Requirements

```txt
- Do not put backend secrets in Vercel/Netlify frontend env.
- Do not expose JWT secrets.
- Do not expose DATABASE_URL.
- Do not expose AI_API_KEY.
```

## Acceptance Criteria

```txt
- Vercel or Netlify config exists.
- Build command works.
- Output directory is correct.
- No secrets are committed.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile build:web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(deploy): add web deployment config
```

---

# TASK-20.09 Add GitHub Actions CI workflow

## Status

TODO

## Context

CI should verify formatting, linting, typechecking, Prisma validation, and builds.

## Goal

Add CI workflow.

## Files to Create

```txt
.github/workflows/ci.yml
```

## Requirements

Workflow should run on:

```yaml
on:
  pull_request:
  push:
    branches:
      - main
```

Jobs should:

```txt
- checkout
- setup Node
- setup pnpm
- install dependencies
- run format check
- run lint
- run API Prisma validate/generate
- run API build
- run mobile typecheck
```

Recommended commands:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api db:generate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
```

## Security Requirements

```txt
- Do not print secrets.
- CI should not require production secrets for normal build if possible.
- Use safe dummy env vars if config validation requires them.
```

## Acceptance Criteria

```txt
- CI workflow exists.
- CI runs on push and pull request.
- CI checks backend and frontend.
- No secrets are committed.
```

## Expected Commit Message

```txt
ci: add monorepo CI workflow
```

---

# TASK-20.10 Add GitHub Actions cron workflow

## Status

TODO

## Context

MVP uses GitHub Actions scheduled workflow to call the backend internal due-card reminder job.

## Goal

Add scheduled workflow for due-card reminders.

## Files to Create

```txt
.github/workflows/due-card-reminders.yml
```

## Requirements

Workflow should run hourly:

```yaml
on:
  schedule:
    - cron: "0 * * * *"
  workflow_dispatch:
```

Workflow should call:

```txt
POST $DUE_CARD_REMINDER_JOB_URL
```

with header:

```txt
x-internal-job-secret: $INTERNAL_JOB_SECRET
```

Use GitHub Actions secrets:

```txt
DUE_CARD_REMINDER_JOB_URL
INTERNAL_JOB_SECRET
```

Example curl:

```bash
curl -fsS -X POST "$DUE_CARD_REMINDER_JOB_URL" \
  -H "x-internal-job-secret: $INTERNAL_JOB_SECRET"
```

## Security Requirements

```txt
- Do not hardcode INTERNAL_JOB_SECRET.
- Do not print secret value.
- Do not pass secret in query string.
- Use header only.
```

## Acceptance Criteria

```txt
- Cron workflow exists.
- Workflow can be run manually.
- Workflow uses secrets.
- Secret is sent in header only.
```

## Expected Commit Message

```txt
ci: add due card reminder cron workflow
```

---

# TASK-20.11 Add deployment documentation

## Status

TODO

## Context

Deployment steps should be documented so MVP can be reproduced.

## Goal

Add deployment guide.

## Files to Create

```txt
docs/deployment/mvp-deployment.md
```

## Requirements

Document:

```txt
- Neon setup
- Render backend setup
- required backend environment variables
- database migration deploy command
- Vercel/Netlify web setup
- required frontend environment variables
- GitHub Actions CI setup
- GitHub Actions cron secrets
- smoke test checklist
```

Include warning:

```txt
Never commit real secrets.
```

Include production database warning:

```txt
Never run prisma migrate reset or destructive reset commands in production.
```

Include smoke test:

```txt
- /health returns 200
- /graphql is reachable
- register/login works
- email verification works
- web app loads
- web app can call GraphQL
- due-card reminder endpoint rejects missing secret
- due-card reminder endpoint works with valid secret
```

## Security Requirements

```txt
- Documentation must use placeholders.
- No real secrets.
- No real tokens.
```

## Acceptance Criteria

```txt
- Deployment guide exists.
- Guide uses placeholders.
- Guide includes backend/web/cron setup.
- Guide includes smoke tests.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
docs(deploy): add MVP deployment guide
```

---

# TASK-20.12 Add deployment final checks

## Status

TODO

## Context

Deployment touches secrets, database, and public endpoints.

## Goal

Run final checks for MVP deployment.

## Manual Checks

Verify backend deployment:

```txt
- Render build succeeds.
- Render start succeeds.
- prisma migrate deploy runs.
- /health returns 200.
- /graphql is reachable.
- production CORS allows frontend origin.
- production CORS rejects unknown origins.
```

Verify frontend deployment:

```txt
- web build succeeds.
- deployed web app loads.
- EXPO_PUBLIC_API_URL points to production GraphQL.
- frontend can register/login.
- frontend can load decks.
```

Verify cron:

```txt
- due-card reminder endpoint rejects missing secret.
- due-card reminder endpoint rejects invalid secret.
- GitHub Actions cron succeeds with valid secret.
```

## Security Checks

Verify:

```txt
- no real secrets are committed.
- .env files are ignored.
- .env.example uses placeholders.
- render.yaml does not contain secrets.
- vercel.json/netlify.toml does not contain secrets.
- GitHub Actions uses secrets.
- production CORS is not wildcard.
- GraphQL production errors do not expose stack traces.
```

Suggested checks:

```bash
git grep -n "DATABASE_URL=.*postgres" || true
git grep -n "JWT_ACCESS_SECRET=.*" || true
git grep -n "JWT_REFRESH_SECRET=.*" || true
git grep -n "AI_API_KEY=.*" || true
git grep -n "INTERNAL_JOB_SECRET=.*" || true
git grep -n "RESEND_API_KEY=.*" || true
```

Manually inspect any matches.

## Commands to Run

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

## Do Not Do

```txt
- Do not move to MVP polish until deployment checks pass.
- Do not commit real secrets.
- Do not use wildcard production CORS.
- Do not run destructive DB reset in production.
```

## Acceptance Criteria

```txt
- Backend deploys.
- Web deploys.
- Database migrations deploy safely.
- CI works.
- Cron workflow exists.
- Internal job endpoint is protected.
- Production CORS is safe.
- No secrets are committed.
- Format check passes.
- Lint passes.
- API build passes.
- Web build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(deploy): finalize MVP deployment
```

---

## Epic Completion Criteria

EPIC-20 is complete when:

```txt
- Backend health endpoint exists.
- Production config validation is hardened.
- Production CORS is safe.
- Production GraphQL errors are safe.
- Database migration deploy scripts exist.
- Render config exists.
- Expo web build script exists.
- Vercel or Netlify config exists.
- GitHub Actions CI workflow exists.
- GitHub Actions due-card reminder cron exists.
- Deployment guide exists.
- Backend deploys successfully.
- Web deploys successfully.
- Cron can call internal reminder job.
- No secrets are committed.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/21-mvp-polish-and-release.md
```

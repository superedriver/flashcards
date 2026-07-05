# MVP Deployment Guide

This guide describes how to deploy Flashcards MVP to production-like free-tier infrastructure.

Target stack:

```txt
Database: Neon PostgreSQL Free
Backend: Render Free Web Service
Web: Vercel (Expo web static export)
Cron: GitHub Actions scheduled workflow
Email: Resend (primary)
```

Repository config files:

```txt
render.yaml
vercel.json
.github/workflows/ci.yml
.github/workflows/due-card-reminders.yml
```

## Security Rules

```txt
Never commit real secrets.
Never commit .env files with production values.
Never run prisma migrate reset in production.
Never run prisma db push --force-reset in production.
Use provider dashboards and GitHub Actions secrets for secrets.
```

Generate self-hosted secrets locally:

```bash
openssl rand -base64 32
```

Use separate values for:

```txt
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
INTERNAL_JOB_SECRET
```

## Deployment Order

```txt
1. Neon PostgreSQL
2. Render backend API
3. Vercel web app
4. Update Render APP_WEB_URL and CORS_ORIGIN with Vercel URL
5. GitHub Actions cron secrets
6. Smoke tests
```

## 1. Neon Setup

1. Create a Neon account and project.
2. Create a PostgreSQL database for MVP.
3. Copy the connection string from Neon dashboard.
4. Keep it for Render `DATABASE_URL`.

Example placeholder:

```env
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<database>?sslmode=require
```

Do not commit this value.

## 2. Render Backend Setup

1. Create a Render account.
2. Connect the GitHub repository.
3. Create a Web Service from `render.yaml` or configure manually:
   - Build: `pnpm install --frozen-lockfile && pnpm --filter @flashcards/api db:generate && pnpm --filter @flashcards/api build`
   - Start: `pnpm --filter @flashcards/api db:migrate:deploy && pnpm --filter @flashcards/api start:prod`
   - Health check path: `/health`
4. Set environment variables in Render dashboard.

Required backend environment variables:

```env
NODE_ENV=production
DATABASE_URL=<neon-database-url>
APP_WEB_URL=https://<vercel-web-host>
CORS_ORIGIN=https://<vercel-web-host>
JWT_ACCESS_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-secret>
INTERNAL_JOB_SECRET=<generated-secret>
EMAIL_PROVIDER=resend
RESEND_API_KEY=<resend-api-key>
BREVO_API_KEY=
EMAIL_FROM=noreply@<your-domain>
AI_PROVIDER=mock
AI_API_KEY=
PUSH_PROVIDER=mock
```

Notes:

```txt
- APP_WEB_URL and CORS_ORIGIN can use temporary placeholders during first deploy.
- After Vercel is live, update both to the final web URL.
- CORS_ORIGIN must not use wildcard (*).
- Use PUSH_PROVIDER=mock for web MVP unless native push is configured.
- Use AI_PROVIDER=mock unless Gemini is configured.
```

Production migration command (already in Render start command):

```bash
pnpm --filter @flashcards/api db:migrate:deploy
```

Forbidden in production:

```bash
pnpm --filter @flashcards/api prisma:migrate:reset
pnpm --filter @flashcards/api prisma db push --force-reset
```

After deploy, note the API host:

```txt
https://<render-api-host>
```

GraphQL URL:

```txt
https://<render-api-host>/graphql
```

Internal due-card reminder job URL:

```txt
https://<render-api-host>/internal/jobs/due-card-reminders
```

## 3. Vercel Web Setup

This repository uses Vercel config from `vercel.json`.

1. Create a Vercel account.
2. Import the GitHub repository.
3. Confirm build settings:
   - Build command: `pnpm install --frozen-lockfile && pnpm --filter @flashcards/mobile build:web`
   - Output directory: `apps/mobile/dist`
4. Set frontend environment variable:

```env
EXPO_PUBLIC_API_URL=https://<render-api-host>/graphql
```

HTTPS requirements:

```txt
- EXPO_PUBLIC_API_URL must use https:// in production.
- Do not use http:// API URLs in Vercel production environment variables.
- http://localhost is allowed for local development only.
- Auth credentials and refresh token cookies require HTTPS in production.
- Vercel serves the web app over HTTPS by default.
```

Do not put backend secrets in Vercel.

1. Deploy and note the web URL:

```txt
https://<vercel-web-host>
```

## 4. Update Render Web URLs

After Vercel deploy succeeds, update Render environment variables:

```env
APP_WEB_URL=https://<vercel-web-host>
CORS_ORIGIN=https://<vercel-web-host>
```

Redeploy or restart the Render service if required.

For multiple web origins, use comma-separated values:

```env
CORS_ORIGIN=https://<vercel-web-host>,https://www.<your-domain>
```

## 5. GitHub Actions CI

CI workflow: `.github/workflows/ci.yml`

Runs on:

```txt
- push to main
- pull requests
```

Checks:

```txt
- format
- lint
- Prisma validate/generate
- API build
- mobile typecheck
```

No production secrets are required for CI.

## 6. GitHub Actions Cron Secrets

Workflow: `.github/workflows/due-card-reminders.yml`

Runs hourly and supports manual `workflow_dispatch`.

Add repository secrets in GitHub:

```txt
Settings -> Secrets and variables -> Actions -> New repository secret
```

Required secrets:

```env
DUE_CARD_REMINDER_JOB_URL=https://<render-api-host>/internal/jobs/due-card-reminders
INTERNAL_JOB_SECRET=<same-value-as-render-internal-job-secret>
```

Rules:

```txt
- Do not hardcode secrets in workflow files.
- Do not pass INTERNAL_JOB_SECRET in query string.
- Send secret only in x-internal-job-secret header.
```

## 7. Smoke Test Checklist

Backend:

```txt
- [ ] Render build succeeds
- [ ] Render start succeeds
- [ ] prisma migrate deploy runs on start
- [ ] GET /health returns 200
- [ ] POST /graphql is reachable
- [ ] register/login works
- [ ] email verification works (if Resend configured)
- [ ] production CORS allows frontend origin
- [ ] production CORS rejects unknown origins
```

Frontend:

```txt
- [ ] Vercel web build succeeds
- [ ] deployed web app loads
- [ ] EXPO_PUBLIC_API_URL points to production GraphQL
- [ ] web app can call GraphQL
- [ ] frontend can register/login
- [ ] frontend can load decks
```

Internal job and cron:

```txt
- [ ] due-card reminder endpoint rejects missing secret
- [ ] due-card reminder endpoint rejects invalid secret
- [ ] due-card reminder endpoint works with valid secret
- [ ] GitHub Actions cron workflow succeeds with valid secrets
```

Example manual checks:

```bash
curl -fsS https://<render-api-host>/health

curl -fsS -X POST https://<render-api-host>/internal/jobs/due-card-reminders
# expect unauthorized without secret header

curl -fsS -X POST https://<render-api-host>/internal/jobs/due-card-reminders \
  -H "x-internal-job-secret: <internal-job-secret>"
# expect success response when secret matches Render env
```

## 8. Useful Local Commands

```bash
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api db:generate
pnpm --filter @flashcards/api db:migrate:deploy
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

## 10. Safe Log Inspection (Render)

Production API logs are available in Render:

```txt
Render Dashboard -> Web Service -> Logs
```

Use logs for operational debugging only. Safe events to look for:

```txt
- Application started
- Health check status=ok
- Due card reminder job summary
- Email delivery summary
- AI request summary
- Push delivery summary
```

Do not copy or share log lines that may contain secrets. The API must never log:

```txt
- passwords
- access tokens / refresh tokens
- verification / reset tokens
- push tokens
- API keys
- DATABASE_URL
```

If debugging auth or email issues:

```txt
- use timestamps and safe status fields
- use user id or email subject only when needed
- never paste full email bodies or reset links into tickets
```

Request correlation ids are not implemented in MVP; add later if needed.

## 11. Secret Scan (Optional)

Before release, scan repository for accidental secret commits:

```bash
git grep -n "DATABASE_URL=.*postgres" || true
git grep -n "JWT_ACCESS_SECRET=.*" || true
git grep -n "JWT_REFRESH_SECRET=.*" || true
git grep -n "AI_API_KEY=.*" || true
git grep -n "INTERNAL_JOB_SECRET=.*" || true
git grep -n "RESEND_API_KEY=.*" || true
```

Inspect any unexpected matches manually.

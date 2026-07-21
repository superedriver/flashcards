# Flashcards MVP — Release Notes

## Release

```txt
Title: Flashcards MVP (Web)
RELEASE_DATE=<replace>
API_URL=<replace>
WEB_URL=<replace>
```

Example after deployment:

```txt
RELEASE_DATE=2026-07-05
API_URL=https://<render-api-host>
WEB_URL=https://<vercel-web-host>
```

## Summary

First public MVP of Flashcards: a spaced-repetition flashcard app with email/password auth, deck management, lessons, public decks, CSV import, optional AI examples, groups, admin moderation, and Expo web client.

Target stack: Neon PostgreSQL, Render API, Vercel web, GitHub Actions cron for due-card reminders.

## What Is Included

### Authentication & account

```txt
- Email/password registration and sign-in
- Email verification flow
- Password reset flow
- Session handling with access/refresh tokens
- Profile screen with account status
- User settings (lesson size, reminder time, timezone)
- Notification preference toggle and push token registration (web)
```

### Decks & cards

```txt
- Create, edit, and delete decks
- Create, edit, and delete cards
- Deck visibility (private/public) and moderation status
- Publish/unpublish deck flow
- CSV import (paste text, preview, confirm)
- AI example generation (mock or Gemini when configured)
```

### Learning

```txt
- SM-2–based lesson flow (Know / Don't know) — current shipped behavior
- Planned EPIC-26: learning steps 0–8, Home multi-deck START, To learn / Practiced / Learned groups
  (docs/tasks/26-learning-steps.md, docs/algorithms/learning-steps.md)
- Lesson progress and summary
- Per-deck learning stats
- Daily due-card reminder backend job (push when configured)
```

### Public decks

```txt
- Browse and search public decks
- View public deck details
- Copy public deck to personal library
```

### Groups & sharing

```txt
- Create groups
- Invite users by email
- Accept/decline invitations
- Share decks with groups (view-only)
```

### Admin & moderation

```txt
- Admin dashboard stats (admin role)
- User search, block/unblock (admin)
- Moderation queue: approve, reject, hide decks
- Mark decks as official (admin)
```

### Client & platform

```txt
- Expo web app (responsive layout for mobile/tablet/desktop widths)
- Basic accessibility pass (labels, touch targets, alerts)
- Loading, error, and empty states with retry where appropriate
- Local demo seed script for development
```

### Operations

```txt
- Health endpoint: GET /health
- Safe operational logging (startup, health, jobs, email/AI/push summaries)
- Deployment guide: docs/deployment/mvp-deployment.md
- Smoke test checklist: docs/release/mvp-smoke-tests.md
```

## Known Limitations

```txt
- Web-only MVP (no App Store / Play Store release)
- Google sign-in UI placeholder only (not implemented)
- Email provider in production requires Resend/Brevo configuration; dev provider does not send mail
- Push reminders require Expo push tokens and a configured push provider
- AI examples use mock provider unless Gemini API key is configured
- CSV import accepts pasted text only (no file upload)
- Cards are plain text (no rich text, images, or audio)
- Lessons from deck detail cover one deck per session (Home multi-deck START: EPIC-26)
- Reminder job uses hour-level matching; minute precision is stored but not fully used
- Free-tier hosting may cold-start (Render) and has usage limits
- Request correlation IDs are not implemented yet
- Native mobile apps are not part of this release
```

## Deferred Post-MVP Items

```txt
- Advanced analytics charts
- Native app store release (iOS/Android)
- Offline mode
- Richer multi-deck filters / custom study modes (beyond Home START in EPIC-26)
- Rich text cards
- Images and audio on cards
- Advanced AI workflows
- Social features beyond basic groups
- Group role management
- Audit logs
- Google OAuth sign-in
- Request ID / distributed tracing
```

## Test Status

### Automated checks (repository)

```txt
- [x] API build passes locally
- [x] Mobile typecheck passes locally
- [x] Format check passes
- [x] Lint passes
- [x] Prisma validate passes
- [x] Web static export build passes locally (Tamagui/esbuild warnings possible in some environments)
```

Final verification run: 2026-07-05 (TASK-21.15).

### Manual smoke tests

Use [mvp-smoke-tests.md](./mvp-smoke-tests.md).

```txt
Local development:
- [ ] Full smoke checklist completed

Production (after deployment):
- [ ] Full smoke checklist completed with API_URL and WEB_URL filled in
```

Record PASS/FAIL per section in the smoke test doc or release checklist. Do not store real passwords or secrets in notes.

## Deployment

Replace placeholders before sharing this document externally:

```txt
API_URL=<replace>     # Render GraphQL base, e.g. https://<render-api-host>
WEB_URL=<replace>     # Vercel Expo web URL
RELEASE_DATE=<replace>
```

Related docs:

```txt
docs/deployment/mvp-deployment.md
docs/release/mvp-smoke-tests.md
render.yaml
vercel.json
.github/workflows/due-card-reminders.yml
```

## Security Reminder

Do not include in release communications or committed notes:

```txt
- passwords
- JWT secrets
- internal job secrets
- API keys (AI, email, database)
- verification or reset tokens
- push tokens
- demo seed passwords (local development only)
```

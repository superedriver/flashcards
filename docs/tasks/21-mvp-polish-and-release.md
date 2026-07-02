# EPIC-21 MVP Polish & Release

## Epic Goal

Prepare Flashcards MVP for first real-user release.

This epic covers:

```txt
- end-to-end MVP testing
- critical UX polish
- mobile/web responsiveness checks
- error state polish
- empty state polish
- loading state polish
- accessibility basics
- seed/demo data
- release checklist
- MVP scope lock
- post-MVP backlog cleanup
```

This epic does not add major new product features.

Deployment is handled in:

```txt
docs/tasks/20-deployment-mvp.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/domain/auth-token-strategy.md
docs/domain/permissions.md
docs/domain/lesson-flow.md
docs/algorithms/sm-2.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/00-repository.md
docs/tasks/01-backend-foundation.md
docs/tasks/02-auth.md
docs/tasks/03-email-verification-password-reset.md
docs/tasks/04-user-profile-settings.md
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
docs/tasks/07-srs-lessons.md
docs/tasks/08-csv-import.md
docs/tasks/09-ai-examples.md
docs/tasks/10-groups-sharing.md
docs/tasks/11-notifications.md
docs/tasks/12-admin-analytics.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
docs/tasks/15-frontend-decks-cards.md
docs/tasks/16-frontend-lessons.md
docs/tasks/17-frontend-public-csv-ai.md
docs/tasks/18-frontend-profile-settings-notifications.md
docs/tasks/19-frontend-groups-admin.md
docs/tasks/20-deployment-mvp.md
```

## Epic Prerequisites

EPIC-20 should be complete.

Expected state:

```txt
- Backend is deployed.
- Web app is deployed.
- Database migrations are deployed.
- Auth works in production.
- Deck/card flows work.
- Lesson flow works.
- Public decks work.
- CSV import works.
- AI examples work or safely use mock provider.
- Notifications endpoint exists and cron is configured.
- Groups/admin features work or are clearly scoped for MVP.
```

## Epic Rules

```txt
1. Do not add major new features.
2. Fix critical bugs only.
3. Polish existing MVP flows.
4. Keep backend as source of truth.
5. Keep frontend security rules from previous epics.
6. Do not weaken validation for speed.
7. Do not commit real secrets.
8. Do not skip security checks.
9. Do not ship with known broken auth, SRS, or data-loss flows.
10. Document any intentionally deferred work.
```

## MVP Release Scope

MVP must support:

```txt
- email/password auth
- email verification
- password reset
- profile/settings
- create/edit/delete decks
- create/edit/delete cards
- public deck publishing/browsing/copying
- CSV import
- AI example generation with configured provider or mock
- SRS lesson flow
- daily reminder backend job
- basic groups/sharing if completed
- basic admin/moderation if completed
- deployed backend and web app
```

MVP may defer:

```txt
- advanced analytics charts
- native app store release
- offline mode
- multi-deck lessons
- rich text cards
- images/audio in cards
- advanced AI workflows
- social features
- group role management
- audit logs
```

## Epic Summary

```md
- [ ] TASK-21.01 Add MVP smoke test checklist
- [ ] TASK-21.02 Add seed/demo data script
- [ ] TASK-21.03 Polish loading/error/empty states
- [ ] TASK-21.04 Polish auth UX
- [ ] TASK-21.05 Polish deck/card UX
- [ ] TASK-21.06 Polish lesson UX
- [ ] TASK-21.07 Polish public/CSV/AI UX
- [ ] TASK-21.08 Polish profile/settings/notifications UX
- [ ] TASK-21.09 Polish groups/admin UX
- [ ] TASK-21.10 Add accessibility basics pass
- [ ] TASK-21.11 Add responsive web pass
- [ ] TASK-21.12 Add production observability basics
- [ ] TASK-21.13 Add release notes
- [ ] TASK-21.14 Add MVP release checklist
- [ ] TASK-21.15 Run final release checks
```

---

# TASK-21.01 Add MVP smoke test checklist

## Status

TODO

## Context

Before release, the MVP needs a repeatable manual smoke test checklist.

## Goal

Create smoke test documentation.

## Files to Create

```txt
docs/release/mvp-smoke-tests.md
```

## Requirements

Document smoke tests for:

```txt
- health endpoint
- GraphQL endpoint
- registration
- login
- logout
- refresh session
- email verification
- password reset
- create deck
- edit deck
- delete deck
- create card
- edit card
- delete card
- publish deck
- public deck search
- copy public deck
- CSV preview
- CSV confirm import
- AI example generation
- start lesson
- submit KNOW
- submit DONT_KNOW
- complete lesson
- update settings
- register push token if platform supports it
- internal reminder endpoint secret rejection
- groups flow if enabled
- admin/moderation flow if enabled
```

Each smoke test should include:

```txt
- goal
- steps
- expected result
- pass/fail checkbox
```

## Security Requirements

```txt
- Do not include real credentials.
- Use placeholder test accounts.
- Do not include real secrets.
```

## Acceptance Criteria

```txt
- Smoke test checklist exists.
- Checklist covers core MVP flows.
- Checklist uses placeholders only.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-21.01 Add MVP smoke test checklist
```

---

# TASK-21.02 Add seed/demo data script

## Status

TODO

## Context

MVP testing is easier with safe demo data.

## Goal

Add a development seed script.

## Files to Create

```txt
apps/api/prisma/seed.ts
```

## Files to Modify

```txt
apps/api/package.json
```

## Requirements

Add seed script that can create:

```txt
- demo user
- demo deck
- demo cards
- optional public demo deck
```

Add script:

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

If `tsx` is missing, install it as dev dependency for API.

Seed behavior:

```txt
- safe for local development
- idempotent where practical
- does not run automatically in production
- uses obvious demo values
```

Example demo user:

```txt
email: demo@example.com
password: demo-password-123
```

Password must be hashed through the same password hashing service or compatible hashing method used by auth.

## Security Requirements

```txt
- Do not seed production by default.
- Do not include real user data.
- Do not include real secrets.
- Clearly mark demo credentials as local-only.
```

## Acceptance Criteria

```txt
- Seed script exists.
- Seed script creates demo deck and cards.
- Seed script does not run automatically in production.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api db:seed
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-21.02 Add seed/demo data script
```

---

# TASK-21.03 Polish loading/error/empty states

## Status

TODO

## Context

MVP should feel stable even when data is loading, missing, or errors occur.

## Goal

Audit and polish common loading, error, and empty states.

## Files to Review

```txt
apps/mobile/src/ui/components/loading-state.tsx
apps/mobile/src/ui/components/error-state.tsx
apps/mobile/src/ui/components/empty-state.tsx
apps/mobile/src/features
```

## Requirements

Review all major screens:

```txt
- auth screens
- my decks
- deck detail
- public decks
- public deck detail
- CSV import
- lesson start
- lesson review
- lesson summary
- profile
- settings
- groups if enabled
- admin if enabled
```

Ensure each screen has:

```txt
- loading state
- error state
- empty state where applicable
- retry action where useful
- clear copy
```

Error copy should be user-friendly.

Avoid exposing:

```txt
- stack traces
- raw GraphQL internals
- Prisma errors
- secrets
```

## Acceptance Criteria

```txt
- Major screens have loading states.
- Major screens have user-friendly error states.
- Empty states have useful next actions.
- No raw internal errors are displayed.
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
TASK-21.03 Polish loading/error/empty states
```

---

# TASK-21.04 Polish auth UX

## Status

TODO

## Context

Auth is the first user experience and must be reliable.

## Goal

Polish auth UX for MVP release.

## Files to Review

```txt
apps/mobile/app/(auth)
apps/mobile/src/features/auth
```

## Requirements

Verify and polish:

```txt
- sign up form validation
- sign in form validation
- password reset flow
- email verification flow
- resend verification feedback
- logout behavior
- expired session behavior
- refresh failure behavior
```

UX requirements:

```txt
- clear validation errors
- disabled submit while loading
- no double submit
- clear success messages
- helpful generic password reset message
- route redirects feel consistent
```

## Security Requirements

```txt
- Do not reveal if password reset email exists.
- Do not log passwords.
- Do not log tokens.
- Do not store tokens in localStorage/sessionStorage.
```

## Acceptance Criteria

```txt
- Sign up UX is clear.
- Sign in UX is clear.
- Password reset UX is safe and clear.
- Email verification UX is clear.
- Expired session clears auth safely.
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
TASK-21.04 Polish auth UX
```

---

# TASK-21.05 Polish deck/card UX

## Status

TODO

## Context

Deck/card management is the main content creation flow.

## Goal

Polish deck/card UX.

## Files to Review

```txt
apps/mobile/src/features/decks
apps/mobile/app/decks
apps/mobile/app/(tabs)/decks.tsx
```

## Requirements

Verify and polish:

```txt
- my decks list
- create deck
- edit deck
- delete deck confirmation
- deck detail
- card list
- create card
- edit card
- delete card confirmation
- publish/unpublish actions
```

UX requirements:

```txt
- form validation is clear
- destructive actions require confirmation
- mutation loading states prevent double submit
- success/error feedback is understandable
- empty deck state encourages creating cards
- published deck status is clear
```

## Security Requirements

```txt
- Frontend does not send ownerId.
- Frontend does not set moderationStatus directly.
- Backend remains source of truth for permissions.
```

## Acceptance Criteria

```txt
- Deck create/edit/delete UX is clear.
- Card create/edit/delete UX is clear.
- Publish/unpublish UX is clear.
- Empty states are helpful.
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
TASK-21.05 Polish deck/card UX
```

---

# TASK-21.06 Polish lesson UX

## Status

TODO

## Context

Lesson flow is the core learning experience.

## Goal

Polish lesson UX.

## Files to Review

```txt
apps/mobile/src/features/lessons
apps/mobile/app/lessons
```

## Requirements

Verify and polish:

```txt
- deck learning stats
- start lesson
- empty lesson state
- review flashcard readability
- reveal answer behavior
- KNOW / DONT_KNOW buttons
- progress display
- completion summary
- back navigation
```

UX requirements:

```txt
- large readable card text
- clear reveal button
- answer buttons disabled before reveal if desired
- double submit prevented
- progress visible
- summary uses backend data
```

## Security Requirements

```txt
- Frontend does not calculate SM-2.
- Frontend does not calculate due dates.
- Frontend sends only KNOW or DONT_KNOW.
- Backend remains source of truth.
```

## Acceptance Criteria

```txt
- Lesson review flow is smooth.
- Empty lesson state is clear.
- Progress and summary are clear.
- Frontend does not calculate SRS.
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
TASK-21.06 Polish lesson UX
```

---

# TASK-21.07 Polish public/CSV/AI UX

## Status

TODO

## Context

Public decks, CSV import, and AI examples are high-value MVP flows.

## Goal

Polish public deck, CSV import, and AI example UX.

## Files to Review

```txt
apps/mobile/src/features/public-decks
apps/mobile/src/features/csv-import
apps/mobile/src/features/ai-examples
```

## Requirements

Verify and polish public decks:

```txt
- public search
- public deck detail
- copy public deck action
- copied deck navigation
```

Verify and polish CSV:

```txt
- CSV instructions
- CSV input
- CSV preview
- CSV row errors
- CSV confirm flow
- created cards count
```

Verify and polish AI:

```txt
- generate examples button
- AI loading state
- generated candidates list
- select candidate behavior
- explicit save behavior
```

## Security Requirements

```txt
- Frontend does not call AI provider directly.
- Frontend does not include AI_API_KEY.
- CSV preview does not create cards.
- Public deck copy uses backend mutation.
- AI examples are not auto-saved.
```

## Acceptance Criteria

```txt
- Public browsing UX is clear.
- CSV import UX is clear.
- AI example UX is clear.
- No AI provider secrets in frontend.
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
TASK-21.07 Polish public/CSV/AI UX
```

---

# TASK-21.08 Polish profile/settings/notifications UX

## Status

TODO

## Context

Profile and settings affect user trust and retention.

## Goal

Polish profile, settings, and notification UX.

## Files to Review

```txt
apps/mobile/src/features/profile
apps/mobile/src/features/settings
apps/mobile/src/features/notifications
```

## Requirements

Verify and polish:

```txt
- profile identity display
- email verification status
- settings form
- lesson size validation
- reminder time input
- timezone input
- notification enable flow
- notification disable flow
- permission denied state
```

UX requirements:

```txt
- settings save feedback is clear
- invalid lesson size is clearly explained
- notification permission denied state tells user what happened
- push token is never shown
```

## Security Requirements

```txt
- Push token is not displayed.
- Push token is not logged.
- Auth tokens are not stored in localStorage/sessionStorage.
```

## Acceptance Criteria

```txt
- Profile UX is clear.
- Settings UX is clear.
- Notification UX is clear.
- Push token is not exposed.
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
TASK-21.08 Polish profile/settings/notifications UX
```

---

# TASK-21.09 Polish groups/admin UX

## Status

TODO

## Context

Groups and admin are permission-sensitive and should be clear if included in MVP.

## Goal

Polish groups and admin UX.

## Files to Review

```txt
apps/mobile/src/features/groups
apps/mobile/src/features/admin
```

## Requirements

Verify and polish groups:

```txt
- my groups list
- create group
- invite user
- invitations list
- accept/decline invitation
- group detail
- share deck with group
- shared decks list
```

Verify and polish admin:

```txt
- admin navigation visibility
- admin dashboard
- user search
- block/unblock confirmations
- moderation queue
- approve/reject/hide confirmations
- official deck toggle
- forbidden states
```

## Security Requirements

```txt
- Frontend role visibility is UX only.
- Backend remains source of truth.
- Do not expose password hashes.
- Do not expose token hashes.
- Do not expose push tokens.
```

## Acceptance Criteria

```txt
- Group UX is clear if enabled.
- Admin UX is clear if enabled.
- Forbidden states are understandable.
- Sensitive fields are not exposed.
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
TASK-21.09 Polish groups/admin UX
```

---

# TASK-21.10 Add accessibility basics pass

## Status

TODO

## Context

MVP should meet basic usability and accessibility expectations.

## Goal

Audit and improve basic accessibility.

## Files to Review

```txt
apps/mobile/src/ui
apps/mobile/src/features
apps/mobile/app
```

## Requirements

Check and improve:

```txt
- buttons have readable labels
- icons have accessible labels where used
- form inputs have labels
- errors are close to relevant fields
- touch targets are reasonably sized
- text contrast is acceptable
- keyboard navigation works on web where practical
- destructive actions are clearly labeled
```

For React Native components, add accessibility props where useful:

```txt
- accessibilityLabel
- accessibilityRole
- accessibilityHint
```

## Acceptance Criteria

```txt
- Main buttons have clear labels.
- Main form inputs have labels.
- Destructive actions are clearly identified.
- Basic keyboard/touch usability is acceptable.
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
TASK-21.10 Add accessibility basics pass
```

---

# TASK-21.11 Add responsive web pass

## Status

TODO

## Context

Expo web MVP should be usable on desktop and mobile browsers.

## Goal

Polish responsive web behavior.

## Files to Review

```txt
apps/mobile/src/ui
apps/mobile/src/features
apps/mobile/app
```

## Requirements

Check at least:

```txt
- small mobile width
- tablet width
- desktop width
```

Review:

```txt
- auth screens
- deck list
- deck detail
- lesson review
- public deck screens
- profile/settings
- groups/admin if enabled
```

Fix obvious issues:

```txt
- overflowing text
- cramped buttons
- unusable forms
- unreadable cards
- broken navigation layout
```

## Acceptance Criteria

```txt
- Web app usable on mobile width.
- Web app usable on desktop width.
- Major layouts do not overflow badly.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm --filter @flashcards/mobile build:web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-21.11 Add responsive web pass
```

---

# TASK-21.12 Add production observability basics

## Status

TODO

## Context

MVP needs enough safe logging to debug production issues without leaking secrets.

## Goal

Add basic safe logging and operational checks.

## Files to Review

```txt
apps/api/src
docs/deployment/mvp-deployment.md
```

## Requirements

Backend logging should capture safe events:

```txt
- application startup
- health endpoint status
- internal reminder job summary
- email provider success/failure summary
- AI provider success/failure summary
- push provider success/failure summary
```

Backend logging must not capture:

```txt
- passwords
- access tokens
- refresh tokens
- token hashes
- reset tokens
- verification tokens
- push tokens
- API keys
- DATABASE_URL
```

Optional:

```txt
- add request id later if needed
- document how to inspect Render logs safely
```

## Security Requirements

```txt
- No secret logging.
- No raw token logging.
- No sensitive user data logging.
```

## Acceptance Criteria

```txt
- Critical backend jobs log safe summaries.
- Logs do not include secrets.
- Deployment docs mention safe log inspection.
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
TASK-21.12 Add production observability basics
```

---

# TASK-21.13 Add release notes

## Status

TODO

## Context

MVP release should have concise notes.

## Goal

Create release notes.

## Files to Create

```txt
docs/release/mvp-release-notes.md
```

## Requirements

Release notes should include:

```txt
- release title
- release date placeholder
- what is included
- known limitations
- deferred post-MVP items
- test status
- deployment links placeholders
```

Use placeholders:

```txt
API_URL=<replace>
WEB_URL=<replace>
RELEASE_DATE=<replace>
```

Do not include:

```txt
- secrets
- internal tokens
- real private test user passwords
```

## Acceptance Criteria

```txt
- Release notes exist.
- Known limitations are documented.
- Links use placeholders.
- No secrets are included.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-21.13 Add release notes
```

---

# TASK-21.14 Add MVP release checklist

## Status

TODO

## Context

Final release needs one checklist that combines testing, deployment, and security.

## Goal

Create MVP release checklist.

## Files to Create

```txt
docs/release/mvp-release-checklist.md
```

## Requirements

Checklist sections:

```txt
- Code quality
- Backend checks
- Frontend checks
- Database checks
- Security checks
- Deployment checks
- Smoke tests
- Go / No-Go
- Post-release monitoring
```

Include command checklist:

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

Include security grep checklist:

```bash
git grep -n "DATABASE_URL=.*postgres" || true
git grep -n "JWT_ACCESS_SECRET=.*" || true
git grep -n "JWT_REFRESH_SECRET=.*" || true
git grep -n "AI_API_KEY=.*" || true
git grep -n "INTERNAL_JOB_SECRET=.*" || true
git grep -n "RESEND_API_KEY=.*" || true
```

Include Go / No-Go criteria:

```txt
GO only if:
- auth works
- deck/card flows work
- lesson flow works
- production CORS is safe
- no real secrets are committed
- smoke tests pass
```

## Acceptance Criteria

```txt
- Release checklist exists.
- Checklist includes command checks.
- Checklist includes security checks.
- Checklist includes Go/No-Go criteria.
```

## Commands to Run

```bash
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-21.14 Add MVP release checklist
```

---

# TASK-21.15 Run final release checks

## Status

TODO

## Context

This is the final task before declaring MVP release readiness.

## Goal

Run all final checks and verify release readiness.

## Required Command Checks

Run:

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

## Required Security Checks

Run:

```bash
git grep -n "DATABASE_URL=.*postgres" || true
git grep -n "JWT_ACCESS_SECRET=.*" || true
git grep -n "JWT_REFRESH_SECRET=.*" || true
git grep -n "AI_API_KEY=.*" || true
git grep -n "INTERNAL_JOB_SECRET=.*" || true
git grep -n "RESEND_API_KEY=.*" || true
git grep -n "passwordHash" apps/mobile || true
git grep -n "refreshTokenHash" apps/mobile || true
git grep -n "localStorage" apps/mobile || true
git grep -n "sessionStorage" apps/mobile || true
```

Manually inspect any matches.

## Required Production Smoke Tests

Verify:

```txt
- deployed web app loads
- /health returns 200
- /graphql is reachable
- register works
- login works
- logout works
- refresh works
- create deck works
- create card works
- start lesson works
- submit review works
- complete lesson works
- public deck search works
- CSV preview works
- CSV confirm works
- password reset request shows generic success
- internal reminder endpoint rejects missing secret
- internal reminder endpoint rejects invalid secret
- internal reminder endpoint works with valid secret
```

## Required Security Smoke Tests

Verify:

```txt
- production CORS rejects unknown origins
- GraphQL production errors do not show stack traces
- frontend bundle does not contain backend secrets
- web auth tokens are not stored in localStorage/sessionStorage
- blocked user cannot login/refresh/use protected operations
```

## Required Git Checks

Run:

```bash
git status
```

Expected:

```txt
clean working tree after final commit
```

## Do Not Release If

```txt
- auth is broken
- refresh flow is broken
- users can access other users' private decks
- lesson review corrupts SRS state
- production CORS uses wildcard
- real secrets are committed
- database migrations fail
- app cannot create or study cards
```

## Acceptance Criteria

```txt
- All command checks pass.
- All security checks are reviewed.
- Production smoke tests pass.
- No critical P0/P1 bugs remain.
- Release checklist is complete.
- Release notes are complete.
- git status is clean after final commit.
```

## Expected Commit Message

```txt
TASK-21.15 Run final release checks
```

---

## Epic Completion Criteria

EPIC-21 is complete when:

```txt
- MVP smoke test checklist exists.
- Seed/demo data script exists.
- Loading/error/empty states are polished.
- Auth UX is polished.
- Deck/card UX is polished.
- Lesson UX is polished.
- Public/CSV/AI UX is polished.
- Profile/settings/notifications UX is polished.
- Groups/admin UX is polished if enabled.
- Accessibility basics pass is complete.
- Responsive web pass is complete.
- Safe observability basics are present.
- Release notes exist.
- MVP release checklist exists.
- Final release checks pass.
- No real secrets are committed.
- MVP is ready for first users.
```

After this epic is complete, create a post-MVP backlog and start prioritizing the next release.

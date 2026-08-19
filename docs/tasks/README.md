# Flashcards Tasks

This folder contains the implementation plan for the Flashcards MVP.

Each file is an epic broken into small Cursor-friendly tasks.

Completed epics live in `docs/tasks/done/`. Active epics stay in `docs/tasks/`.

The goal of these task files is to make implementation predictable, reviewable, and safe.

---

## How to Use This Folder

Work through tasks in order.

Recommended flow:

```txt
1. Open the next task file.
2. Pick the next unchecked task.
3. Give that single task to Cursor.
4. Let Cursor implement only that task.
5. Run the commands listed in the task.
6. Fix any issues.
7. Commit the task.
8. Move to the next task.
```

Do not ask Cursor to implement an entire epic at once unless the epic is very small.

---

## Task Execution Rule

One task should usually equal one focused commit.

Good examples:

```txt
- Add one use case.
- Add one GraphQL resolver operation.
- Add one Prisma repository.
- Add one frontend screen.
- Add one form.
- Add one provider.
- Add one deployment config file.
```

Bad examples:

```txt
- Build the whole auth system.
- Build backend and frontend for a feature together.
- Implement multiple epics at once.
- Refactor unrelated modules while doing a task.
```

If a task becomes too large, split it before implementing.

---

## Commit Message Convention

Every completed task should be committed with exactly one commit message in this format:

```txt
TASK-XX.YY <task title>
```

Rules:

```txt
- XX.YY is the task id from the task heading (example: TASK-12.05).
- The title must match the task heading text after the task id.
- One task equals one commit.
- Use the Expected Commit Message from the task file when present.
```

Examples:

```txt
TASK-12.01 Add admin module skeleton
TASK-11.14 Add SendDueCardRemindersUseCase
TASK-10.30 Add groups unit tests
```

Do not use conventional commit prefixes (`chore:`, `feat:`, etc.) instead of the task id.

---

## Required Cursor Behavior

For every task, Cursor must:

```txt
1. Read the task fully.
2. Read all Related Documents listed in the task.
3. Follow the task scope strictly.
4. Avoid unrelated refactors.
5. Run all Commands to Run.
6. Fix errors found by the commands.
7. Keep the working tree clean after commit.
8. Use the task commit message format from Commit Message Convention.
```

Cursor must not:

```txt
- change architecture decisions unless the task explicitly asks for it;
- skip security requirements;
- skip acceptance criteria;
- expose secrets;
- expose password hashes;
- expose token hashes;
- log raw tokens;
- add unrelated features;
- silently change API contracts.
```

---

## Architecture Rules

Backend must follow Clean Architecture.

### Backend Layers

Presentation layer:

```txt
- GraphQL resolvers
- GraphQL types
- GraphQL inputs
- HTTP controllers
- guards
- decorators
```

Presentation layer may:

```txt
- parse input
- call use cases
- return DTOs
```

Presentation layer must not:

```txt
- access Prisma directly
- contain business logic
- calculate permissions directly
- calculate SRS
- hash passwords or tokens directly
```

Application layer:

```txt
- use cases
- ports
- orchestration
- transactions
```

Application layer may:

```txt
- validate workflow rules
- call domain services
- call repository ports
- call provider ports
- coordinate transactions
```

Application layer must not:

```txt
- import GraphQL decorators
- import Prisma client directly
- depend on NestJS request/response objects
```

Domain layer:

```txt
- entities
- value objects
- policies
- pure services
- algorithms
```

Domain layer must not:

```txt
- import NestJS
- import Prisma
- import GraphQL
- call external services
```

Infrastructure layer:

```txt
- Prisma repositories
- mappers
- provider implementations
- email provider
- AI provider
- push provider
- token/hash implementations
```

Infrastructure layer may:

```txt
- import Prisma
- call external APIs
- implement ports
```

---

## Frontend Rules

Frontend must:

```txt
- use Expo React Native;
- use Expo Router;
- use TypeScript;
- use Tamagui;
- use Apollo Client;
- use generated GraphQL types/hooks when available;
- keep access token in memory only;
- use Expo SecureStore for native refresh token;
- avoid localStorage/sessionStorage for auth tokens;
- expose only public-safe EXPO_PUBLIC variables.
```

Frontend must not:

```txt
- store auth tokens in localStorage;
- store auth tokens in sessionStorage;
- expose backend secrets;
- call AI providers directly;
- calculate learning steps or due dates;
- select lesson cards;
- treat hidden buttons as security.
```

---

## Security Rules

Always follow:

```txt
docs/security/security-checklist.md
```

Never expose:

```txt
- passwordHash
- refresh token hashes
- email verification token hashes
- password reset token hashes
- raw push tokens
- API keys
- internal job secrets
- DATABASE_URL
```

Never log:

```txt
- passwords
- access tokens
- refresh tokens
- reset tokens
- verification tokens
- push tokens
- API keys
- DATABASE_URL
```

Safe user fields:

```txt
id
email
role
emailVerifiedAt
blockedAt
createdAt
updatedAt
```

---

## Source-of-Truth Documents

Before implementing related tasks, read the relevant source-of-truth docs.

Core architecture:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
```

Security:

```txt
docs/security/security-checklist.md
```

Auth:

```txt
docs/domain/auth-token-strategy.md
```

Permissions:

```txt
docs/domain/permissions.md
```

Lessons and SRS:

```txt
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/algorithms/sm-2.md (historical)
```

Task format:

```txt
docs/tasks/cursor-task-template.md
```

---

## Epic Order

Completed epics (historical order):

```txt
done/00-repository.md
done/01-backend-foundation.md
done/02-auth.md
done/03-email-verification-password-reset.md
done/04-user-profile-settings.md
done/05-decks-cards.md
done/06-public-decks.md
done/07-srs-lessons.md
done/08-csv-import.md
done/09-ai-examples.md
done/10-groups-sharing.md
done/11-notifications.md
done/12-admin-analytics.md
done/13-frontend-foundation.md
done/14-frontend-auth.md
done/15-frontend-decks-cards.md
done/16-frontend-lessons.md
done/17-frontend-public-csv-ai.md
done/18-frontend-profile-settings-notifications.md
done/19-frontend-groups-admin.md
done/20-deployment-mvp.md
done/21-mvp-polish-and-release.md
done/22-auth-security-hardening.md
done/23-i18n.md
done/24-study-languages.md
done/25-bugfixes.md
done/26-learning-steps.md
done/27-learning-steps-bugfixes.md
done/28-requirements-ambiguities.md
```

Active epics:

```txt
None
```

---

## Epic Index

### 00 Repository

File:

```txt
docs/tasks/done/00-repository.md
```

Purpose:

```txt
Set up the monorepo, workspace scripts, base TypeScript config, formatting, linting, and initial project structure.
```

---

### 01 Backend Foundation

File:

```txt
docs/tasks/done/01-backend-foundation.md
```

Purpose:

```txt
Set up NestJS API, GraphQL, Prisma, PostgreSQL, config validation, and Clean Architecture backend structure.
```

---

### 02 Auth

File:

```txt
docs/tasks/done/02-auth.md
```

Purpose:

```txt
Implement email/password auth, safe user output, access tokens, refresh token rotation, logout, and current user query.
```

---

### 03 Email Verification & Password Reset

File:

```txt
docs/tasks/done/03-email-verification-password-reset.md
```

Purpose:

```txt
Implement email verification, resend verification, password reset request, password reset confirmation, and refresh token revocation after password reset.
```

---

### 04 User Profile & Settings

File:

```txt
docs/tasks/done/04-user-profile-settings.md
```

Purpose:

```txt
Implement user profile and settings such as lesson size, notification preferences, reminder time, and timezone.
```

---

### 05 Decks & Cards

File:

```txt
docs/tasks/done/05-decks-cards.md
```

Purpose:

```txt
Implement private deck and card CRUD with backend ownership and permission checks.
```

---

### 06 Public Decks

File:

```txt
docs/tasks/done/06-public-decks.md
```

Purpose:

```txt
Implement public deck publishing, search, public deck detail, and copying public decks into a user's library.
```

---

### 07 SRS & Lessons

File:

```txt
docs/tasks/done/07-srs-lessons.md
```

Purpose:

```txt
Implement SRS lessons package, review state, lesson creation, review submission, lesson completion, and deck learning stats (historical SM-2; superseded by EPIC-26 learning steps).
```

---

### 08 CSV Import

File:

```txt
docs/tasks/done/08-csv-import.md
```

Purpose:

```txt
Implement CSV preview and confirmation flow for importing cards into a deck.
```

---

### 09 AI Examples

File:

```txt
docs/tasks/done/09-ai-examples.md
```

Purpose:

```txt
Implement AI provider abstraction, mock/Gemini provider, example generation, and explicit save flow.
```

---

### 10 Groups & Sharing

File:

```txt
docs/tasks/done/10-groups-sharing.md
```

Purpose:

```txt
Implement groups, group invitations, group membership, and view-only deck sharing with groups.
```

---

### 11 Notifications

File:

```txt
docs/tasks/done/11-notifications.md
```

Purpose:

```txt
Implement push token registration, Expo push provider, due-card reminder job, and protected internal job endpoint.
```

---

### 12 Admin & Analytics

File:

```txt
docs/tasks/done/12-admin-analytics.md
```

Purpose:

```txt
Implement admin dashboard stats, user search, user blocking, moderation queue, deck moderation, and official deck flagging.
```

---

### 13 Frontend Foundation

File:

```txt
docs/tasks/done/13-frontend-foundation.md
```

Purpose:

```txt
Create Expo app foundation with Expo Router, Tamagui, Apollo Client, GraphQL Codegen, app providers, and shared UI primitives.
```

---

### 14 Frontend Auth

File:

```txt
docs/tasks/done/14-frontend-auth.md
```

Purpose:

```txt
Implement frontend auth state, token storage, Apollo auth link, sign in, sign up, logout, email verification, password reset, and route gating.
```

---

### 15 Frontend Decks & Cards

File:

```txt
docs/tasks/done/15-frontend-decks-cards.md
```

Purpose:

```txt
Implement frontend deck and card management screens.
```

---

### 16 Frontend Lessons

File:

```txt
docs/tasks/done/16-frontend-lessons.md
```

Purpose:

```txt
Implement frontend lesson start, review, answer, progress, and summary flow.
```

---

### 17 Frontend Public, CSV & AI

File:

```txt
docs/tasks/done/17-frontend-public-csv-ai.md
```

Purpose:

```txt
Implement public deck browsing, public deck copy, CSV import preview/confirm, and AI examples UI.
```

---

### 18 Frontend Profile, Settings & Notifications

File:

```txt
docs/tasks/done/18-frontend-profile-settings-notifications.md
```

Purpose:

```txt
Implement profile screen, settings form, notification permission flow, push token registration, and notification settings UI.
```

---

### 19 Frontend Groups & Admin

File:

```txt
docs/tasks/done/19-frontend-groups-admin.md
```

Purpose:

```txt
Implement frontend groups, invitations, deck sharing, admin dashboard, user management, moderation queue, and official deck UI.
```

---

### 20 Deployment MVP

File:

```txt
docs/tasks/done/20-deployment-mvp.md
```

Purpose:

```txt
Deploy backend, web app, database migrations, CI, cron jobs, CORS, and production-safe config.
```

---

### 21 MVP Polish & Release

File:

```txt
docs/tasks/done/21-mvp-polish-and-release.md
```

Purpose:

```txt
Polish MVP UX, add smoke tests, seed data, release notes, release checklist, and final release checks.
```

---

### 22 Auth Security & UX Hardening

File:

```txt
docs/tasks/done/22-auth-security-hardening.md
```

Purpose:

```txt
Fix password masking on web, harden auth transport and logging, improve auth routing UX, and add httpOnly cookie session persistence for web.
```

---

### 23 Internationalization (i18n)

File:

```txt
docs/tasks/done/23-i18n.md
```

Purpose:

```txt
Implement UI translations (en/uk), interfaceLocale persistence, locale formatters, and backend push/email/AI locale localization.
```

---

### 24 Study Languages

File:

```txt
docs/tasks/done/24-study-languages.md
```

Purpose:

```txt
Implement study/learning languages: language catalog, onboarding, deck language pairs, active target context, Decks page sections, copy/regenerate preview flows, and legacy deck handling.
```

---

### 25 Bugfixes (post–EPIC-24 smoke)

File:

```txt
docs/tasks/done/25-bugfixes.md
```

Purpose:

```txt
Fix bugs found during EPIC-24 manual smoke (auth GraphQL context/cookies, web password field layout, and follow-ups appended as discovered).
```

---

### 26 Learning Steps

File:

```txt
docs/tasks/done/26-learning-steps.md
```

Purpose:

```txt
Replace SM-2 with learning steps 0–8, Home multi-deck START, learning group counters/badges, prompt direction, and CardReviewState migration.
```

---

### 27 Learning Steps Bugfixes

File:

```txt
docs/tasks/done/27-learning-steps-bugfixes.md
```

Purpose:

```txt
Fix bugs found during EPIC-26 learning-steps manual smoke (starting with Home completeLesson).
```

---

### 28 Requirements Ambiguities & Sources of Truth

File:

```txt
docs/tasks/done/28-requirements-ambiguities.md
```

Purpose:

```txt
Resolve contradictions between requirements, live docs, and implemented behavior; keep one clear source of truth per area before new feature work.
```

---

## Recommended Commit Style

Use Conventional Commits.

Examples:

```txt
chore(repo): initialize monorepo
chore(api): add backend foundation
feat(auth): add login use case
feat(decks): add create deck mutation
feat(frontend-auth): add sign in screen
chore(deploy): add Render deployment config
docs(release): add MVP release checklist
```

---

## Required Checks Before Commit

Backend task:

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

Backend task with Prisma:

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

Frontend task:

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

Frontend task with web runtime change:

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

Deployment/release task:

```bash
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api db:validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile build:web
```

---

## Final MVP Completion Criteria

The MVP task plan is complete when:

```txt
- all task files 00 through 21 are implemented;
- all acceptance criteria are satisfied;
- all required checks pass;
- backend is deployed;
- web app is deployed;
- smoke tests pass;
- no real secrets are committed;
- auth works;
- deck/card flows work;
- lesson flow works;
- public deck flow works;
- CSV import works;
- deployment checklist is complete.
```

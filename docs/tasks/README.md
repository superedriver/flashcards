# Flashcards Tasks

This folder contains the implementation plan for the Flashcards MVP.

Each file is an epic broken into small Cursor-friendly tasks.

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
- calculate SM-2;
- calculate due dates;
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
docs/algorithms/sm-2.md
```

Task format:

```txt
docs/tasks/cursor-task-template.md
```

---

## Epic Order

Implement tasks in this order:

```txt
00-repository.md
01-backend-foundation.md
02-auth.md
03-email-verification-password-reset.md
04-user-profile-settings.md
05-decks-cards.md
06-public-decks.md
07-srs-lessons.md
08-csv-import.md
09-ai-examples.md
10-groups-sharing.md
11-notifications.md
12-admin-analytics.md
13-frontend-foundation.md
14-frontend-auth.md
15-frontend-decks-cards.md
16-frontend-lessons.md
17-frontend-public-csv-ai.md
18-frontend-profile-settings-notifications.md
19-frontend-groups-admin.md
20-deployment-mvp.md
21-mvp-polish-and-release.md
```

---

## Epic Index

### 00 Repository

File:

```txt
docs/tasks/00-repository.md
```

Purpose:

```txt
Set up the monorepo, workspace scripts, base TypeScript config, formatting, linting, and initial project structure.
```

---

### 01 Backend Foundation

File:

```txt
docs/tasks/01-backend-foundation.md
```

Purpose:

```txt
Set up NestJS API, GraphQL, Prisma, PostgreSQL, config validation, and Clean Architecture backend structure.
```

---

### 02 Auth

File:

```txt
docs/tasks/02-auth.md
```

Purpose:

```txt
Implement email/password auth, safe user output, access tokens, refresh token rotation, logout, and current user query.
```

---

### 03 Email Verification & Password Reset

File:

```txt
docs/tasks/03-email-verification-password-reset.md
```

Purpose:

```txt
Implement email verification, resend verification, password reset request, password reset confirmation, and refresh token revocation after password reset.
```

---

### 04 User Profile & Settings

File:

```txt
docs/tasks/04-user-profile-settings.md
```

Purpose:

```txt
Implement user profile and settings such as lesson size, notification preferences, reminder time, and timezone.
```

---

### 05 Decks & Cards

File:

```txt
docs/tasks/05-decks-cards.md
```

Purpose:

```txt
Implement private deck and card CRUD with backend ownership and permission checks.
```

---

### 06 Public Decks

File:

```txt
docs/tasks/06-public-decks.md
```

Purpose:

```txt
Implement public deck publishing, search, public deck detail, and copying public decks into a user's library.
```

---

### 07 SRS & Lessons

File:

```txt
docs/tasks/07-srs-lessons.md
```

Purpose:

```txt
Implement SM-2 package, review state, lesson creation, review submission, lesson completion, and deck learning stats.
```

---

### 08 CSV Import

File:

```txt
docs/tasks/08-csv-import.md
```

Purpose:

```txt
Implement CSV preview and confirmation flow for importing cards into a deck.
```

---

### 09 AI Examples

File:

```txt
docs/tasks/09-ai-examples.md
```

Purpose:

```txt
Implement AI provider abstraction, mock/Gemini provider, example generation, and explicit save flow.
```

---

### 10 Groups & Sharing

File:

```txt
docs/tasks/10-groups-sharing.md
```

Purpose:

```txt
Implement groups, group invitations, group membership, and view-only deck sharing with groups.
```

---

### 11 Notifications

File:

```txt
docs/tasks/11-notifications.md
```

Purpose:

```txt
Implement push token registration, Expo push provider, due-card reminder job, and protected internal job endpoint.
```

---

### 12 Admin & Analytics

File:

```txt
docs/tasks/12-admin-analytics.md
```

Purpose:

```txt
Implement admin dashboard stats, user search, user blocking, moderation queue, deck moderation, and official deck flagging.
```

---

### 13 Frontend Foundation

File:

```txt
docs/tasks/13-frontend-foundation.md
```

Purpose:

```txt
Create Expo app foundation with Expo Router, Tamagui, Apollo Client, GraphQL Codegen, app providers, and shared UI primitives.
```

---

### 14 Frontend Auth

File:

```txt
docs/tasks/14-frontend-auth.md
```

Purpose:

```txt
Implement frontend auth state, token storage, Apollo auth link, sign in, sign up, logout, email verification, password reset, and route gating.
```

---

### 15 Frontend Decks & Cards

File:

```txt
docs/tasks/15-frontend-decks-cards.md
```

Purpose:

```txt
Implement frontend deck and card management screens.
```

---

### 16 Frontend Lessons

File:

```txt
docs/tasks/16-frontend-lessons.md
```

Purpose:

```txt
Implement frontend lesson start, review, answer, progress, and summary flow.
```

---

### 17 Frontend Public, CSV & AI

File:

```txt
docs/tasks/17-frontend-public-csv-ai.md
```

Purpose:

```txt
Implement public deck browsing, public deck copy, CSV import preview/confirm, and AI examples UI.
```

---

### 18 Frontend Profile, Settings & Notifications

File:

```txt
docs/tasks/18-frontend-profile-settings-notifications.md
```

Purpose:

```txt
Implement profile screen, settings form, notification permission flow, push token registration, and notification settings UI.
```

---

### 19 Frontend Groups & Admin

File:

```txt
docs/tasks/19-frontend-groups-admin.md
```

Purpose:

```txt
Implement frontend groups, invitations, deck sharing, admin dashboard, user management, moderation queue, and official deck UI.
```

---

### 20 Deployment MVP

File:

```txt
docs/tasks/20-deployment-mvp.md
```

Purpose:

```txt
Deploy backend, web app, database migrations, CI, cron jobs, CORS, and production-safe config.
```

---

### 21 MVP Polish & Release

File:

```txt
docs/tasks/21-mvp-polish-and-release.md
```

Purpose:

```txt
Polish MVP UX, add smoke tests, seed data, release notes, release checklist, and final release checks.
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

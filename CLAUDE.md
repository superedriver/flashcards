# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mobile-first flashcard app for language learning with spaced repetition. Monorepo with three workspaces:

- `apps/api` — NestJS + GraphQL + Prisma backend (`@flashcards/api`)
- `apps/mobile` — Expo React Native app with Expo Router (`@flashcards/mobile`)
- `packages/srs` — Pure TypeScript SRS algorithm library (`@flashcards/srs`)

Package manager: `pnpm` (v9). Run all commands from repo root unless noted.

---

## Development Commands

### API

```bash
pnpm dev:api                     # start NestJS in watch mode
pnpm build:api                   # compile (also runs prisma generate + srs build)
pnpm --filter @flashcards/api test          # run Jest tests
pnpm --filter @flashcards/api test:watch    # Jest watch mode
pnpm --filter @flashcards/api test:cov      # Jest with coverage
```

### Mobile

```bash
pnpm mobile:start                # expo start
pnpm mobile:web                  # expo start --web
pnpm build:web                   # expo export --platform web
pnpm mobile:typecheck            # tsc --noEmit
pnpm --filter @flashcards/mobile codegen   # regenerate GraphQL types from schema
```

### SRS package

```bash
pnpm --filter @flashcards/srs build   # tsc compile
pnpm --filter @flashcards/srs test    # vitest run
```

### Whole-repo checks (run before commit)

```bash
pnpm format:check    # prettier
pnpm lint            # eslint across apps
pnpm typecheck       # alias for pnpm build:api
pnpm test            # runs all test suites
pnpm check           # format + lint + docs lint + typecheck + test
```

### Database (Prisma)

```bash
pnpm db:generate          # prisma generate
pnpm db:validate          # prisma validate
pnpm db:migrate:deploy    # prisma migrate deploy (prod)
pnpm --filter @flashcards/api prisma:migrate:dev   # create new migration (dev)
pnpm --filter @flashcards/api prisma:studio        # Prisma Studio
```

---

## Architecture

### Backend Clean Architecture

Each domain module under `apps/api/src/modules/<name>/` has four layers:

| Layer             | Contents                                                                         | Rules                                                                                          |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `presentation/`   | GraphQL resolvers, types, inputs, HTTP controllers, guards, decorators           | May call use cases; must not touch Prisma or business logic                                    |
| `application/`    | Use cases, ports (interfaces), orchestration, transactions                       | May call domain + repository ports; must not import NestJS request/response or Prisma directly |
| `domain/`         | Entities, value objects, policies, pure services                                 | Must not import NestJS, Prisma, or GraphQL                                                     |
| `infrastructure/` | Prisma repositories, mappers, provider implementations (email, AI, push, tokens) | May import Prisma and call external APIs; implements application ports                         |

The SRS algorithm lives in `packages/srs` as a zero-dependency pure library; the API imports it via the workspace.

### Frontend Structure

`apps/mobile/app/` uses Expo Router file-based routing:

- `(auth)/` — unauthenticated screens (sign in, sign up, password reset)
- `(tabs)/` — main tab navigator (home, decks, etc.)
- `onboarding/` — language selection onboarding
- `admin/` — admin-only screens

State management: Zustand. Data fetching: Apollo Client with generated hooks (`codegen`). UI: Tamagui components. i18n: i18next with `en`/`uk` locales.

Auth tokens: access token in memory only; refresh token in `expo-secure-store` on native, httpOnly cookie on web.

### Source-of-truth docs

| Topic             | File                                                              |
| ----------------- | ----------------------------------------------------------------- |
| Architecture      | `docs/architecture.md`, `docs/backend-clean-architecture.md`      |
| Auth tokens       | `docs/domain/auth-token-strategy.md`                              |
| Permissions       | `docs/domain/permissions.md`                                      |
| Lesson flow & SRS | `docs/domain/lesson-flow.md`, `docs/algorithms/learning-steps.md` |
| Security          | `docs/security/security-checklist.md`                             |
| Task format       | `docs/tasks/cursor-task-template.md`                              |

Active epic: `docs/tasks/35-account-deletion-prod-gaps.md`. Completed epics: `docs/tasks/done/`.

---

## Pre-commit Checks by Task Type

**Backend task:** `pnpm build:api && pnpm format:check && pnpm lint`

**Backend + Prisma change:** add `pnpm db:validate && pnpm db:generate` before the build

**Frontend task:** `pnpm mobile:typecheck && pnpm format:check && pnpm lint`

**Release / deployment task:** all of the above + `pnpm build:web`

---

## Task Execution Rule

An epic is executed one task at a time. Do not move to the next task until the current one is fully complete — implemented, verified, and committed.

---

## Commit Rules (ЗАВЖДИ, без винятків)

Every commit must:

1. Have format: `TASK-XX.XX <title>` — де XX.XX — номер таски і епіку
2. Include the updated epic doc file (`docs/tasks/NN-name.md`) in the **same** commit
3. NOT include Claude as co-author

No exceptions — redesigns, bug fixes, tooling, config changes all follow this rule.

## Investigate Before Fix Rule

When the user describes a problem or bug:

1. Investigate first — read logs, find root cause, understand the scope
2. Report findings and proposed fix to the user
3. Only implement the fix after the user explicitly confirms

Never start fixing before the user says to proceed.

## Epic Lifecycle Rules

- Only mark an epic DONE when the user explicitly says so. Never do it autonomously after the last task.
- When closing an epic: move the file from `docs/tasks/` to `docs/tasks/done/` — do not just update the status in place.

## Git Rebase Rules

Before any rebase:

- Run `git log --oneline -N` and save the list
- After rebase, immediately verify the count and content of commits

During rebase:

- For renaming: use `reword` in todo, then `git commit --amend -m "..."` for each stop — do NOT chain GIT_EDITOR through `--continue`
- For splitting a commit: `git reset HEAD~1`, save full file copies with `cp`, stage and commit in two separate steps
- Never start a second rebase while the first is unfinished — `git rebase --abort` first

After rebase — always run:

```
git log --oneline -10
git show --stat HEAD
```

## Do Not Push

Never push to remote unless explicitly asked.

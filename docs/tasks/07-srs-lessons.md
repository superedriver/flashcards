# EPIC-07 SRS & Lessons

## Epic Goal

Implement backend spaced repetition and lesson flow for Flashcards.

This epic covers:

```txt
- SRS package
- SM-2 algorithm implementation
- CardReviewState persistence
- StudySession persistence
- lesson start flow
- review submission flow
- lesson completion
- deck learning stats
```

This epic must follow the source-of-truth files:

```txt
docs/algorithms/sm-2.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
docs/security/security-checklist.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/algorithms/sm-2.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/05-decks-cards.md
docs/tasks/06-public-decks.md
```

## Epic Prerequisites

EPIC-06 should be complete.

Expected state:

```txt
- Deck/Card Prisma schema exists.
- DecksModule exists.
- DeckRepositoryPort exists.
- CardRepositoryPort exists.
- DeckPermissionService exists.
- Owner deck/card CRUD works.
- Public deck visibility works.
- Auth guard works.
- CurrentUser decorator works.
```

## Epic Rules

```txt
1. Follow docs/algorithms/sm-2.md exactly.
2. Follow docs/domain/lesson-flow.md exactly.
3. Follow docs/domain/permissions.md exactly.
4. Frontend must not calculate SRS.
5. Backend is the source of truth for review state.
6. SM-2 implementation must live in packages/srs.
7. SRS package must be framework-independent.
8. Lesson use cases must not import GraphQL decorators.
9. Resolvers must not access Prisma directly.
10. Deleted cards must not be included in lessons.
11. Lessons can be started only for decks the user can view.
12. CardReviewState is per user per card.
```

## MVP Lesson Policy

MVP lessons support:

```txt
- one deck per lesson
- authenticated users only
- due cards first
- new cards after due cards
- lesson size default 20
- lesson size min 5
- lesson size max 100
- answers: KNOW and DONT_KNOW
- backend updates SRS immediately after submitReview
```

Answer mapping:

```txt
KNOW      -> SM-2 quality 4
DONT_KNOW -> SM-2 quality 1
```

MVP does not support:

```txt
- multi-deck lessons
- offline lessons
- Again/Hard/Good/Easy buttons
- advanced cram mode
- repeating failed cards inside same lesson
```

## Epic Summary

```md
- [x] TASK-07.01 Add SRS package skeleton
- [x] TASK-07.02 Implement SM-2 types
- [x] TASK-07.03 Implement SM-2 algorithm
- [x] TASK-07.04 Add SM-2 tests
- [x] TASK-07.05 Add SRS Prisma schema
- [x] TASK-07.06 Add lessons module skeleton
- [x] TASK-07.07 Add lesson domain types
- [x] TASK-07.08 Add review state and session repository ports
- [x] TASK-07.09 Add Prisma review state repository
- [x] TASK-07.10 Add Prisma study session repository
- [x] TASK-07.11 Add lesson GraphQL types and inputs
- [x] TASK-07.12 Add StartLessonUseCase
- [x] TASK-07.13 Add startLesson mutation
- [x] TASK-07.14 Add SubmitReviewUseCase
- [x] TASK-07.15 Add submitReview mutation
- [x] TASK-07.16 Add CompleteLessonUseCase
- [x] TASK-07.17 Add completeLesson mutation
- [ ] TASK-07.18 Add DeckLearningStatsUseCase
- [ ] TASK-07.19 Add deckLearningStats query
- [ ] TASK-07.20 Add SRS and lessons final checks
- [ ] TASK-07.21 Add abandonLesson mutation
```

---

# TASK-07.01 Add SRS package skeleton

## Status

DONE

## Context

SM-2 should live in a shared package so it stays independent from NestJS, Prisma, GraphQL, and frontend UI.

## Goal

Create `packages/srs`.

## Files to Create

```txt
packages/srs/package.json
packages/srs/tsconfig.json
packages/srs/src/index.ts
packages/srs/src/sm2.ts
packages/srs/src/types.ts
```

## Requirements

Create `packages/srs/package.json`:

```json
{
  "name": "@flashcards/srs",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

Create `packages/srs/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.test.ts"]
}
```

Create empty exports:

```ts
export * from './types'
export * from './sm2'
```

## Architecture Constraints

```txt
- SRS package must not import NestJS.
- SRS package must not import Prisma.
- SRS package must not import GraphQL.
- SRS package must be pure TypeScript.
```

## Do Not Do

```txt
- Do not implement algorithm yet.
- Do not add backend lesson logic yet.
```

## Acceptance Criteria

```txt
- packages/srs exists.
- package name is @flashcards/srs.
- package exports index.ts.
- Package typecheck script exists.
```

## Commands to Run

```bash
pnpm install
pnpm --filter @flashcards/srs typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(srs): add SRS package skeleton
```

---

# TASK-07.02 Implement SM-2 types

## Status

DONE

## Context

SM-2 inputs and outputs must be explicit and reusable.

## Goal

Add SM-2 TypeScript types.

## Files to Modify

```txt
packages/srs/src/types.ts
```

## Requirements

Add types:

```ts
export type Sm2Quality = 0 | 1 | 2 | 3 | 4 | 5

export type Sm2Input = {
  quality: Sm2Quality
  previousEaseFactor?: number | null
  previousIntervalDays?: number | null
  previousRepetitions?: number | null
  reviewedAt: Date
}

export type Sm2Result = {
  easeFactor: number
  intervalDays: number
  repetitions: number
  dueAt: Date
}
```

## Source of Truth

Types must match:

```txt
docs/algorithms/sm-2.md
```

## Architecture Constraints

```txt
- Types must be framework-independent.
- Types must not import backend code.
```

## Acceptance Criteria

```txt
- Sm2Quality exists.
- Sm2Input exists.
- Sm2Result exists.
- SRS package typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(srs): add SM-2 types
```

---

# TASK-07.03 Implement SM-2 algorithm

## Status

DONE

## Context

The algorithm must follow `docs/algorithms/sm-2.md`.

## Goal

Implement pure SM-2 calculation.

## Files to Modify

```txt
packages/srs/src/sm2.ts
packages/srs/src/index.ts
```

## Requirements

Export:

```ts
export function calculateNextReview(input: Sm2Input): Sm2Result
```

Algorithm rules:

```txt
default easeFactor = 2.5
default intervalDays = 0
default repetitions = 0
minimum easeFactor = 1.3
quality must be integer 0..5
```

Ease factor formula:

```txt
newEaseFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
```

Clamp:

```txt
newEaseFactor = max(newEaseFactor, 1.3)
```

Failed review:

```txt
quality < 3:
- repetitions = 0
- intervalDays = 1
- easeFactor recalculated and clamped
```

Successful review:

```txt
quality >= 3:
- if previousRepetitions = 0, intervalDays = 1
- if previousRepetitions = 1, intervalDays = 6
- if previousRepetitions >= 2, intervalDays = round(previousIntervalDays * newEaseFactor)
- repetitions = previousRepetitions + 1
```

Due date:

```txt
dueAt = reviewedAt + intervalDays days
```

Use UTC date math where practical.

## Source of Truth

Implementation must match:

```txt
docs/algorithms/sm-2.md
```

## Architecture Constraints

```txt
- Pure function.
- No database calls.
- No time source inside function except input.reviewedAt.
- No NestJS imports.
- No Prisma imports.
```

## Acceptance Criteria

```txt
- calculateNextReview exists.
- Function follows SM-2 spec.
- Function is deterministic for same input.
- SRS package typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(srs): implement SM-2 calculation
```

---

# TASK-07.04 Add SM-2 tests

## Status

DONE

## Context

SM-2 is core learning logic and must be tested.

## Goal

Add unit tests for SM-2.

## Files to Create

```txt
packages/srs/src/sm2.test.ts
```

## Files to Modify

```txt
packages/srs/package.json
```

## Requirements

Install Vitest if not already installed:

```bash
pnpm add -Dw vitest
```

Tests must cover:

```txt
- new KNOW review
- second KNOW review
- third KNOW review
- DONT_KNOW resets repetitions
- DONT_KNOW interval becomes 1
- ease factor cannot go below 1.3
- dueAt is reviewedAt + intervalDays
- invalid quality throws
```

Required examples from `docs/algorithms/sm-2.md`:

```txt
new KNOW:
- quality 4
- previous repetitions 0
- result repetitions 1
- result intervalDays 1
- result easeFactor around 2.5

second KNOW:
- previous repetitions 1
- result repetitions 2
- result intervalDays 6

third KNOW:
- previous repetitions 2
- previous intervalDays 6
- result intervalDays around 15

failed review:
- quality 1
- previous easeFactor 2.5
- previous intervalDays 6
- previous repetitions 2
- result easeFactor around 1.96
- result repetitions 0
- result intervalDays 1
```

## Architecture Constraints

```txt
- Tests should run without backend.
- Tests should not require database.
```

## Acceptance Criteria

```txt
- SM-2 tests exist.
- Tests pass.
- SRS package typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs test
pnpm --filter @flashcards/srs typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
test(srs): add SM-2 unit tests
```

---

# TASK-07.05 Add SRS Prisma schema

## Status

DONE

## Context

The backend needs to persist per-user card review state and study sessions.

## Goal

Add SRS and lesson models to Prisma schema.

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add relations to `User`:

```prisma
cardReviewStates CardReviewState[]
studySessions    StudySession[]
studySessionReviews StudySessionReview[]
```

Add relations to `Card`:

```prisma
reviewStates CardReviewState[]
sessionReviews StudySessionReview[]
```

Add relations to `Deck`:

```prisma
studySessions StudySession[]
studySessionReviews StudySessionReview[]
```

Add enum:

```prisma
enum StudySessionStatus {
  ACTIVE
  COMPLETED
  ABANDONED
}

enum ReviewAnswer {
  KNOW
  DONT_KNOW
}
```

Add `CardReviewState`:

```prisma
model CardReviewState {
  id              String   @id @default(uuid())
  userId          String
  cardId          String

  easeFactor      Float    @default(2.5)
  intervalDays    Int      @default(0)
  repetitions     Int      @default(0)
  dueAt           DateTime
  lastReviewedAt  DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  card            Card     @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@unique([userId, cardId])
  @@index([userId])
  @@index([cardId])
  @@index([dueAt])
}
```

Add `StudySession`:

```prisma
model StudySession {
  id          String             @id @default(uuid())
  userId      String
  deckId      String
  status      StudySessionStatus @default(ACTIVE)
  lessonSize  Int
  startedAt   DateTime           @default(now())
  completedAt DateTime?
  abandonedAt DateTime?

  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  user        User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  deck        Deck               @relation(fields: [deckId], references: [id], onDelete: Cascade)
  reviews     StudySessionReview[]

  @@index([userId])
  @@index([deckId])
  @@index([status])
}
```

Add `StudySessionReview`:

```prisma
model StudySessionReview {
  id                   String       @id @default(uuid())
  sessionId            String
  userId               String
  deckId               String
  cardId               String
  answer               ReviewAnswer
  quality              Int
  reviewedAt           DateTime

  previousEaseFactor   Float?
  previousIntervalDays Int?
  previousRepetitions  Int?

  nextEaseFactor       Float
  nextIntervalDays     Int
  nextRepetitions      Int
  nextDueAt            DateTime

  createdAt            DateTime     @default(now())

  session              StudySession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  user                 User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  deck                 Deck         @relation(fields: [deckId], references: [id], onDelete: Cascade)
  card                 Card         @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@unique([sessionId, cardId])
  @@index([userId])
  @@index([deckId])
  @@index([cardId])
  @@index([reviewedAt])
}
```

## Important Decision

MVP rejects duplicate review for same session/card:

```txt
@@unique([sessionId, cardId])
```

This follows:

```txt
docs/domain/lesson-flow.md
```

## Security Requirements

```txt
- Review state is per user.
- User cannot access another user's study sessions.
- User cannot submit review for another user's session.
```

## Architecture Constraints

```txt
- This task only updates persistence schema.
- Do not implement repositories yet.
- Do not implement GraphQL yet.
```

## Acceptance Criteria

```txt
- CardReviewState model exists.
- StudySession model exists.
- StudySessionReview model exists.
- Prisma schema validates.
- Prisma client generates.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(db): add SRS and lesson schema
```

---

# TASK-07.06 Add lessons module skeleton

## Status

DONE

## Context

Lesson/SRS backend code should live in a dedicated lessons module.

## Goal

Create lessons module folder structure.

## Files to Create

```txt
apps/api/src/modules/lessons/lessons.module.ts

apps/api/src/modules/lessons/domain/.gitkeep
apps/api/src/modules/lessons/domain/types/.gitkeep
apps/api/src/modules/lessons/domain/services/.gitkeep

apps/api/src/modules/lessons/application/.gitkeep
apps/api/src/modules/lessons/application/ports/.gitkeep
apps/api/src/modules/lessons/application/use-cases/.gitkeep

apps/api/src/modules/lessons/infrastructure/.gitkeep
apps/api/src/modules/lessons/infrastructure/persistence/.gitkeep
apps/api/src/modules/lessons/infrastructure/mappers/.gitkeep

apps/api/src/modules/lessons/presentation/.gitkeep
apps/api/src/modules/lessons/presentation/graphql/.gitkeep
apps/api/src/modules/lessons/presentation/graphql/inputs/.gitkeep
apps/api/src/modules/lessons/presentation/graphql/types/.gitkeep
apps/api/src/modules/lessons/presentation/graphql/resolvers/.gitkeep
```

## Files to Modify

```txt
apps/api/src/app.module.ts
```

## Requirements

Create `LessonsModule`:

```ts
import { Module } from '@nestjs/common'

@Module({})
export class LessonsModule {}
```

Import `LessonsModule` into `AppModule`.

## Architecture Constraints

```txt
- Keep module empty for now.
- Do not implement business logic in this task.
```

## Acceptance Criteria

```txt
- LessonsModule exists.
- LessonsModule is imported into AppModule.
- Folder structure exists.
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
chore(lessons): add lessons module skeleton
```

---

# TASK-07.07 Add lesson domain types

## Status

DONE

## Context

Lesson use cases need framework-independent types.

## Goal

Add lesson domain types.

## Files to Create

```txt
apps/api/src/modules/lessons/domain/types/review-answer.type.ts
apps/api/src/modules/lessons/domain/types/study-session-status.type.ts
apps/api/src/modules/lessons/domain/types/card-review-state.type.ts
apps/api/src/modules/lessons/domain/types/study-session.type.ts
apps/api/src/modules/lessons/domain/types/study-session-review.type.ts
apps/api/src/modules/lessons/domain/types/deck-learning-stats.type.ts
apps/api/src/modules/lessons/domain/types/index.ts
```

## Requirements

Create types:

```ts
export type ReviewAnswer = 'KNOW' | 'DONT_KNOW'

export type StudySessionStatus = 'ACTIVE' | 'COMPLETED' | 'ABANDONED'
```

`CardReviewState`:

```ts
export type CardReviewState = {
  id: string
  userId: string
  cardId: string
  easeFactor: number
  intervalDays: number
  repetitions: number
  dueAt: Date
  lastReviewedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
```

`StudySession`:

```ts
export type StudySession = {
  id: string
  userId: string
  deckId: string
  status: StudySessionStatus
  lessonSize: number
  startedAt: Date
  completedAt: Date | null
  abandonedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
```

`StudySessionReview`:

```ts
import { ReviewAnswer } from './review-answer.type'

export type StudySessionReview = {
  id: string
  sessionId: string
  userId: string
  deckId: string
  cardId: string
  answer: ReviewAnswer
  quality: number
  reviewedAt: Date
  previousEaseFactor: number | null
  previousIntervalDays: number | null
  previousRepetitions: number | null
  nextEaseFactor: number
  nextIntervalDays: number
  nextRepetitions: number
  nextDueAt: Date
  createdAt: Date
}
```

`DeckLearningStats`:

```ts
export type DeckLearningStats = {
  deckId: string
  totalCards: number
  newCards: number
  dueCards: number
  reviewedCards: number
  nextDueAt: Date | null
}
```

## Architecture Constraints

```txt
- Types must not import Prisma.
- Types must not import GraphQL decorators.
- Types must not import NestJS.
```

## Acceptance Criteria

```txt
- Lesson domain types exist.
- Types are framework-independent.
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
chore(lessons): add lesson domain types
```

---

# TASK-07.08 Add review state and session repository ports

## Status

DONE

## Context

Lesson use cases need ports for review state and study sessions.

## Goal

Add repository ports.

## Files to Create

```txt
apps/api/src/modules/lessons/application/ports/card-review-state-repository.port.ts
apps/api/src/modules/lessons/application/ports/study-session-repository.port.ts
```

## Requirements

Create `CardReviewStateRepositoryPort`:

```ts
import { CardReviewState } from '../../domain/types'

export const CARD_REVIEW_STATE_REPOSITORY = Symbol('CARD_REVIEW_STATE_REPOSITORY')

export type UpsertCardReviewStateInput = {
  userId: string
  cardId: string
  easeFactor: number
  intervalDays: number
  repetitions: number
  dueAt: Date
  lastReviewedAt: Date
}

export type CardReviewStateRepositoryPort = {
  findByUserAndCard(userId: string, cardId: string): Promise<CardReviewState | null>
  findDueCardIdsForDeck(input: {
    userId: string
    deckId: string
    now: Date
    limit: number
  }): Promise<string[]>
  countReviewedForDeck(input: { userId: string; deckId: string }): Promise<number>
  countDueForDeck(input: { userId: string; deckId: string; now: Date }): Promise<number>
  findNextDueAtForDeck(input: { userId: string; deckId: string; now: Date }): Promise<Date | null>
  upsert(input: UpsertCardReviewStateInput): Promise<CardReviewState>
}
```

Create `StudySessionRepositoryPort`:

```ts
import { StudySession, StudySessionReview, ReviewAnswer } from '../../domain/types'

export const STUDY_SESSION_REPOSITORY = Symbol('STUDY_SESSION_REPOSITORY')

export type CreateStudySessionInput = {
  userId: string
  deckId: string
  lessonSize: number
}

export type CreateStudySessionReviewInput = {
  sessionId: string
  userId: string
  deckId: string
  cardId: string
  answer: ReviewAnswer
  quality: number
  reviewedAt: Date
  previousEaseFactor?: number | null
  previousIntervalDays?: number | null
  previousRepetitions?: number | null
  nextEaseFactor: number
  nextIntervalDays: number
  nextRepetitions: number
  nextDueAt: Date
}

export type StudySessionRepositoryPort = {
  abandonActiveForUserAndDeck(input: { userId: string; deckId: string }): Promise<void>
  create(input: CreateStudySessionInput): Promise<StudySession>
  findById(sessionId: string): Promise<StudySession | null>
  createReview(input: CreateStudySessionReviewInput): Promise<StudySessionReview>
  hasReviewForCard(input: { sessionId: string; cardId: string }): Promise<boolean>
  countReviews(sessionId: string): Promise<number>
  countReviewsByAnswer(input: { sessionId: string; answer: ReviewAnswer }): Promise<number>
  complete(sessionId: string, completedAt: Date): Promise<StudySession>
}
```

## Architecture Constraints

```txt
- Ports live in application layer.
- Ports must not import Prisma.
- Ports must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- CardReviewStateRepositoryPort exists.
- StudySessionRepositoryPort exists.
- Ports are framework-independent.
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
chore(lessons): add lesson repository ports
```

---

# TASK-07.09 Add Prisma review state repository

## Status

DONE

## Context

CardReviewState persistence should be implemented with Prisma infrastructure.

## Goal

Add Prisma implementation of `CardReviewStateRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/lessons/infrastructure/persistence/prisma-card-review-state.repository.ts
apps/api/src/modules/lessons/infrastructure/mappers/card-review-state.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Implement:

```txt
findByUserAndCard
findDueCardIdsForDeck
countReviewedForDeck
countDueForDeck
findNextDueAtForDeck
upsert
```

`findDueCardIdsForDeck` must:

```txt
- filter by userId
- card.deckId
- card.deletedAt = null
- card.deck.deletedAt = null
- dueAt <= now
- order by dueAt ascending
- limit result
```

`upsert` must use unique key:

```txt
userId + cardId
```

## Security Requirements

```txt
- Review state is per user.
- Never return another user's review state.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on port.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaCardReviewStateRepository exists.
- Mapper exists.
- Provider is registered.
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
chore(lessons): add Prisma review state repository
```

---

# TASK-07.10 Add Prisma study session repository

## Status

DONE

## Context

Study sessions and session reviews should be persisted with Prisma infrastructure.

## Goal

Add Prisma implementation of `StudySessionRepositoryPort`.

## Files to Create

```txt
apps/api/src/modules/lessons/infrastructure/persistence/prisma-study-session.repository.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session.mapper.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session-review.mapper.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Implement:

```txt
abandonActiveForUserAndDeck
create
findById
createReview
hasReviewForCard
countReviews
countReviewsByAnswer
complete
```

`abandonActiveForUserAndDeck`:

```txt
- find ACTIVE sessions for userId + deckId
- set status = ABANDONED
- set abandonedAt = now
```

`createReview`:

```txt
- creates StudySessionReview
- duplicate sessionId + cardId should fail
```

`complete`:

```txt
- set status = COMPLETED
- set completedAt = provided date
```

## Security Requirements

```txt
- Repository methods must filter by ids provided by use cases.
- Use cases enforce ownership.
```

## Architecture Constraints

```txt
- Repository lives in infrastructure.
- Use cases depend on port.
- Resolver must not use repository directly.
```

## Acceptance Criteria

```txt
- PrismaStudySessionRepository exists.
- Session mapper exists.
- Review mapper exists.
- Provider is registered.
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
chore(lessons): add Prisma study session repository
```

---

# TASK-07.11 Add lesson GraphQL types and inputs

## Status

DONE

## Context

GraphQL needs safe types and inputs for lesson operations.

## Goal

Add GraphQL types and inputs.

## Files to Create

```txt
apps/api/src/modules/lessons/presentation/graphql/types/review-answer.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/study-session-status.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/card-review-state.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/lesson-card.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/start-lesson-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/submit-review-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/complete-lesson-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/deck-learning-stats.type.ts

apps/api/src/modules/lessons/presentation/graphql/inputs/start-lesson.input.ts
apps/api/src/modules/lessons/presentation/graphql/inputs/submit-review.input.ts
apps/api/src/modules/lessons/presentation/graphql/inputs/complete-lesson.input.ts
```

## Requirements

Inputs:

```txt
StartLessonInput:
- deckId
- lessonSize optional

SubmitReviewInput:
- sessionId
- cardId
- answer

CompleteLessonInput:
- sessionId

AbandonLessonInput:
- sessionId
```

`LessonCardType`:

```txt
cardId
front
back
example
notes
position
reviewState optional
```

`StartLessonPayloadType`:

```txt
sessionId nullable
deckId
cards
lessonSize
totalCards
```

`SubmitReviewPayloadType`:

```txt
sessionId
cardId
reviewState
reviewedCards
```

`CompleteLessonPayloadType`:

```txt
sessionId
deckId
totalCards
reviewedCards
knownCount
dontKnowCount
completedAt
```

`AbandonLessonPayloadType`:

```txt
success
```

`DeckLearningStatsType`:

```txt
deckId
totalCards
newCards
dueCards
reviewedCards
nextDueAt
```

## Security Requirements

```txt
- Do not expose another user's review state.
- Do not expose deleted cards.
```

## Architecture Constraints

```txt
- GraphQL types live in presentation layer.
- No business logic in GraphQL types.
```

## Acceptance Criteria

```txt
- Lesson GraphQL types exist.
- Lesson inputs exist.
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
chore(lessons): add lesson GraphQL types
```

---

# TASK-07.12 Add StartLessonUseCase

## Status

DONE

## Context

Starting a lesson selects due cards first, then new cards.

## Goal

Add `StartLessonUseCase`.

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Input:

```ts
export type StartLessonUseCaseInput = {
  currentUser: AuthUser
  deckId: string
  lessonSize?: number
}
```

Output:

```ts
export type StartLessonUseCaseResult = {
  sessionId: string | null
  deckId: string
  cards: LessonCard[]
  lessonSize: number
  totalCards: number
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load deck.
4. Check deck visibility with DeckPermissionService.canViewDeck.
5. Resolve lesson size.
6. Count total non-deleted cards.
7. Select due cards first.
8. Select new cards after due cards.
9. If no cards available, return empty payload with sessionId null.
10. Abandon existing ACTIVE session for same user/deck.
11. Create new StudySession.
12. Return session id and selected cards.
```

Lesson size:

```txt
default = user settings lessonSize or 20
min = 5
max = 100
```

Due cards:

```txt
CardReviewState.dueAt <= now
```

New cards:

```txt
cards without CardReviewState for this user
```

Selection order:

```txt
1. due cards by dueAt ascending
2. new cards by position ascending, createdAt ascending
```

## Security Requirements

```txt
- User can start lessons only for viewable decks.
- Private deck from another user must not be accessible.
- Deleted cards must not be selected.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
- SRS is not calculated in start lesson.
```

## Acceptance Criteria

```txt
- StartLessonUseCase exists.
- Due cards are selected first.
- New cards are selected after due cards.
- Empty lesson works.
- Existing active session is abandoned.
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
feat(lessons): add start lesson use case
```

---

# TASK-07.13 Add startLesson mutation

## Status

DONE

## Context

Frontend needs a mutation to start a lesson.

## Goal

Add protected `startLesson` mutation.

## Files to Create

```txt
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Add mutation:

```graphql
startLesson(input: StartLessonInput!): StartLessonPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call StartLessonUseCase
- return lesson payload
```

Resolver must not:

```txt
- query Prisma
- select cards directly
- calculate SRS
```

## Security Requirements

```txt
- Must require auth.
- Must not expose inaccessible deck cards.
```

## Acceptance Criteria

```txt
- startLesson mutation exists.
- Mutation requires auth.
- Due/new selection works through use case.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(lessons): add start lesson mutation
```

---

# TASK-07.14 Add SubmitReviewUseCase

## Status

DONE

## Context

Submitting a review updates SRS state using `@flashcards/srs`.

## Goal

Add `SubmitReviewUseCase`.

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
apps/api/package.json
```

## Requirements

Add dependency:

```json
{
  "dependencies": {
    "@flashcards/srs": "workspace:*"
  }
}
```

Input:

```ts
export type SubmitReviewUseCaseInput = {
  currentUser: AuthUser
  sessionId: string
  cardId: string
  answer: 'KNOW' | 'DONT_KNOW'
}
```

Output:

```ts
export type SubmitReviewUseCaseResult = {
  sessionId: string
  cardId: string
  reviewState: CardReviewState
  reviewedCards: number
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load session.
4. Check session belongs to current user.
5. Check session status is ACTIVE.
6. Load card.
7. Check card belongs to session deck.
8. Check card is not deleted.
9. Check duplicate review for same session/card.
10. Map answer to SM-2 quality.
11. Load previous CardReviewState.
12. Call calculateNextReview from @flashcards/srs.
13. Upsert CardReviewState.
14. Create StudySessionReview.
15. Return updated review state and progress.
```

Answer mapping:

```txt
KNOW      -> 4
DONT_KNOW -> 1
```

Duplicate rule:

```txt
Reject duplicate review for same sessionId + cardId.
```

## Security Requirements

```txt
- User can submit only for own session.
- User cannot submit review for another user's session.
- User cannot submit for cards outside session deck.
- User cannot submit for deleted card.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case calls @flashcards/srs.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- SubmitReviewUseCase exists.
- KNOW updates review state.
- DONT_KNOW updates review state.
- Duplicate review is rejected.
- User cannot submit for another user's session.
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
feat(lessons): add submit review use case
```

---

# TASK-07.15 Add submitReview mutation

## Status

DONE

## Context

Frontend needs a mutation to submit review answers.

## Goal

Add protected `submitReview` mutation.

## Files to Modify

```txt
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Add mutation:

```graphql
submitReview(input: SubmitReviewInput!): SubmitReviewPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call SubmitReviewUseCase
- return updated review state/progress
```

Resolver must not:

```txt
- calculate SM-2
- update review state directly
- query Prisma
```

## Security Requirements

```txt
- Must require auth.
- Must not allow submitting another user's session.
```

## Acceptance Criteria

```txt
- submitReview mutation exists.
- Mutation requires auth.
- Review state updates through use case.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(lessons): add submit review mutation
```

---

# TASK-07.16 Add CompleteLessonUseCase

## Status

DONE

## Context

A lesson should be completed after all selected cards are reviewed.

## Goal

Add `CompleteLessonUseCase`.

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/complete-lesson.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Input:

```ts
export type CompleteLessonUseCaseInput = {
  currentUser: AuthUser
  sessionId: string
}
```

Output:

```ts
export type CompleteLessonUseCaseResult = {
  sessionId: string
  deckId: string
  totalCards: number
  reviewedCards: number
  knownCount: number
  dontKnowCount: number
  completedAt: Date
}
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load session.
4. Check session belongs to current user.
5. Check session status is ACTIVE.
6. Count reviews.
7. Count KNOW reviews.
8. Count DONT_KNOW reviews.
9. Mark session COMPLETED.
10. Return summary.
```

MVP rule:

```txt
Complete is allowed even if reviewedCards < lessonSize.
```

Reason:

```txt
User may exit early and complete current progress.
```

## Security Requirements

```txt
- User can complete only own session.
- User cannot complete another user's session.
```

## Architecture Constraints

```txt
- Use case depends on ports.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- CompleteLessonUseCase exists.
- User can complete own active session.
- User cannot complete another user's session.
- Completed session cannot be submitted to later.
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
feat(lessons): add complete lesson use case
```

---

# TASK-07.17 Add completeLesson mutation

## Status

DONE

## Context

Frontend needs a mutation to complete lessons.

## Goal

Add protected `completeLesson` mutation.

## Files to Modify

```txt
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Add mutation:

```graphql
completeLesson(input: CompleteLessonInput!): CompleteLessonPayloadType!
```

Mutation must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call CompleteLessonUseCase
- return summary
```

Resolver must not:

```txt
- query Prisma
- update session directly
```

## Security Requirements

```txt
- Must require auth.
- Must not allow completing another user's session.
```

## Acceptance Criteria

```txt
- completeLesson mutation exists.
- Mutation requires auth.
- Completion summary is returned.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(lessons): add complete lesson mutation
```

---

# TASK-07.18 Add DeckLearningStatsUseCase

## Status

TODO

## Context

Frontend needs learning stats for deck detail screens.

## Goal

Add `DeckLearningStatsUseCase`.

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/deck-learning-stats.use-case.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Input:

```ts
export type DeckLearningStatsUseCaseInput = {
  currentUser: AuthUser
  deckId: string
}
```

Output:

```ts
export type DeckLearningStatsUseCaseResult = DeckLearningStats
```

Use case must:

```txt
1. Validate authenticated user exists.
2. Reject blocked user.
3. Load deck.
4. Check deck visibility with DeckPermissionService.canViewDeck.
5. Count total non-deleted cards.
6. Count reviewed cards for user/deck.
7. Count due cards for user/deck.
8. Calculate newCards = totalCards - reviewedCards.
9. Load nextDueAt.
10. Return stats.
```

## Security Requirements

```txt
- Stats are per user.
- User cannot see stats for inaccessible private deck.
```

## Architecture Constraints

```txt
- Use case depends on ports/services.
- Use case must not import Prisma.
- Use case must not import GraphQL decorators.
```

## Acceptance Criteria

```txt
- DeckLearningStatsUseCase exists.
- Stats are per user.
- Inaccessible deck is rejected.
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
feat(lessons): add deck learning stats use case
```

---

# TASK-07.19 Add deckLearningStats query

## Status

TODO

## Context

Frontend needs a query to display learning stats for a deck.

## Goal

Add protected `deckLearningStats` query.

## Files to Modify

```txt
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
apps/api/src/modules/lessons/lessons.module.ts
```

## Requirements

Add query:

```graphql
deckLearningStats(deckId: ID!): DeckLearningStatsType!
```

Query must:

```txt
- require GqlAuthGuard
- use CurrentUser
- call DeckLearningStatsUseCase
- return stats
```

Resolver must not:

```txt
- query Prisma
- calculate stats directly
```

## Security Requirements

```txt
- Must require auth.
- Must return stats only for current user.
```

## Acceptance Criteria

```txt
- deckLearningStats query exists.
- Query requires auth.
- Stats are returned for current user.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(lessons): add deck learning stats query
```

---

# TASK-07.20 Add SRS and lessons final checks

## Status

TODO

## Context

Lessons are core product logic and must be checked carefully.

## Goal

Run final checks for SRS and lessons.

## Manual GraphQL Checks

Verify:

```txt
- startLesson requires auth
- startLesson works for own deck
- startLesson rejects non-owned deck (DECK_NOT_FOUND)
- startLesson rejects inaccessible private deck
- startLesson selects due cards first
- startLesson selects new cards after due cards
- startLesson returns empty payload when no cards available
- submitReview KNOW updates CardReviewState
- submitReview DONT_KNOW updates CardReviewState
- submitReview rejects duplicate session/card review
- submitReview rejects another user's session
- completeLesson completes own session
- completeLesson rejects another user's session
- completed session cannot accept submitReview
- abandonLesson abandons own session (idempotent)
- abandonLesson rejects missing/other user's session with LESSON_NOT_FOUND
- deckLearningStats returns user-specific stats
```

## SM-2 Checks

Verify:

```txt
- @flashcards/srs tests pass
- backend uses calculateNextReview from @flashcards/srs
- backend does not duplicate SM-2 formula
- frontend is not involved in SRS calculation
```

## Security Checks

Verify:

```txt
- Resolvers do not access Prisma directly.
- Permission logic is not inside resolvers.
- Review state is per user.
- Private decks cannot be studied by unrelated users.
- Deleted cards are not included.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs test
pnpm --filter @flashcards/srs typecheck
pnpm format:check
pnpm lint
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/api start:dev
```

## Do Not Do

```txt
- Do not move to CSV import until lesson checks pass.
- Do not duplicate SM-2 formula inside backend use cases.
- Do not calculate SRS in frontend.
```

## Acceptance Criteria

```txt
- SM-2 package works.
- SRS tests pass.
- Lessons work.
- Review state updates correctly.
- Session permissions work.
- Deck learning stats work.
- Format check passes.
- Lint passes.
- Prisma validate passes.
- API build passes.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(lessons): finalize SRS and lessons
```

---

## Epic Completion Criteria

EPIC-07 is complete when:

```txt
- @flashcards/srs package exists.
- SM-2 algorithm is implemented.
- SM-2 tests pass.
- CardReviewState schema exists.
- StudySession schema exists.
- StudySessionReview schema exists.
- LessonsModule exists.
- Lesson domain types exist.
- Review state repository port exists.
- Study session repository port exists.
- Prisma review state repository exists.
- Prisma study session repository exists.
- Lesson GraphQL types exist.
- StartLessonUseCase exists.
- startLesson mutation works.
- SubmitReviewUseCase exists.
- submitReview mutation works.
- CompleteLessonUseCase exists.
- completeLesson mutation works.
- DeckLearningStatsUseCase exists.
- deckLearningStats query works.
- due cards are selected before new cards.
- review state is per user.
- SM-2 follows docs/algorithms/sm-2.md.
- lesson flow follows docs/domain/lesson-flow.md.
- permissions follow docs/domain/permissions.md.
```

After this epic is complete, move to:

```txt
docs/tasks/08-csv-import.md
```

# EPIC-26 Learning Steps

## Epic Goal

Replace SM-2 review scheduling with a fixed **learning steps (0–8)** ladder, expose learning groups in Home / Decks / deck detail, and support **Home START** across due cards in own decks of the active target language.

This epic covers:

```txt
- Rewrite packages/srs for learning steps (pure TS; frontend never schedules)
- Replace CardReviewState / StudySessionReview SM-2 fields with learning-step fields
- Migration: reset all existing CardReviewState rows to step 0 / due now / count 0
- Create CardReviewState on card create / CSV / copy / preview approve (+ startLesson safety net)
- SubmitReview + StartLesson for steps, intervals, prompt direction
- Re-queue currently due cards inside an active session (incl. same card when due again)
- Home multi-deck START (own decks, active target, lessonSize)
- Aggregate + per-deck learning group counters (To learn / Practiced / Learned)
- Home UI: counters + START + empty CTAs (no deck list)
- Decks / deck detail counters; deck detail card row group badges
- Lesson prompt side from step rules (random 50/50 on steps 3, 4, 8)
- en/uk i18n for groups + home empty states
- Smoke checklist
```

This epic does **not** include:

```txt
- Group badges inside the active lesson UI (v1)
- Waiting / countdown UI when the next due is in the future
- Per-deck algorithm ladders
- Studying public/group decks without copying into own decks
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/07-srs-lessons.md
docs/tasks/16-frontend-lessons.md
docs/tasks/24-study-languages.md
docs/algorithms/sm-2.md
docs/smoke/learning-steps.md
```

## Epic Prerequisites

EPIC-24 and EPIC-25 should be complete.

Expected state:

```txt
- Study languages + activeTargetLanguage work
- Lessons start from deck detail (SM-2 still in packages/srs)
- CardReviewState has easeFactor / intervalDays / repetitions
- StudySession.deckId is required; StudySessionReview has @@unique([sessionId, cardId]) and SM-2 snapshot columns
- CardReviewState is created only on first submitReview upsert (not on card create)
- Home tab is a stub (apps/mobile/app/(tabs)/index.tsx)
- Deck detail shows DeckLearningStats (newCards / dueCards / reviewedCards)
- Local stack: Postgres + API (:3000) + mobile web (:8081)
```

## Agreed Decisions (Source of Truth)

### Replace SM-2

```txt
- Learning steps 0–8 replace SM-2 in the review flow.
- Algorithm lives in packages/srs as pure TypeScript.
- Frontend must not calculate learningStep, dueAt, or group transitions.
- docs/algorithms/learning-steps.md is the algorithm SoT.
- docs/algorithms/sm-2.md remains historical only.
```

### Groups (derived from step)

```txt
To learn:   0–1
Practiced:  2–6
Learned:    7–8
```

API enum: `LearningGroup` = `TO_LEARN` | `PRACTICED` | `LEARNED`.

### Prompt direction (first side shown)

```txt
0–2:     FRONT_TO_BACK
3, 4, 8: RANDOM 50/50 on every review attempt (do not persist choice)
5–7:     BACK_TO_FRONT
```

Backend resolves `promptDirection` when returning a lesson card (start + each next card after review).

### Know (steps 0–7)

```txt
newStep = min(oldStep + 1, 8)
dueAt = now + intervalFor(newStep)
```

`intervalFor(newStep)`:

```txt
1 → 90 sec
2 → 30 min
3 → 12 h
4 → 24 h
5 → 2 days
6 → 7 days
7 → 14 days
```

### Know 7 → 8 (enter long review; not a long-review success)

```txt
learningStep = 8
longReviewSuccessCount = 0
dueAt = now + 60 days
```

### Know already on step 8

```txt
longReviewSuccessCount += 1
count 1 → +60 days
count 2 → +90 days
count ≥3 → +180 days
```

Months = fixed day counts (60 / 90 / 180).

### Don't know

```txt
0–1: step unchanged; dueAt = now + 2 min
2–5: step = max(step - 1, 0); dueAt = now + 15 min
6–8: step = max(step - 2, 0); dueAt = now + 12 h; longReviewSuccessCount = 0
```

### Persistence / migration

```txt
CardReviewState:
  - remove easeFactor, intervalDays, repetitions
  - add learningStep Int (0..8, default 0)
  - add longReviewSuccessCount Int (default 0)
  - keep dueAt, lastReviewedAt
  - migrate every existing row → learningStep=0, dueAt=now, longReviewSuccessCount=0

StudySession:
  - add scope enum StudySessionScope: DECK | HOME_ACTIVE_TARGET
  - deckId becomes nullable (required when scope=DECK; null when HOME_ACTIVE_TARGET)

StudySessionReview:
  - remove quality + SM-2 previous/next ease/interval/repetitions columns
  - add previousLearningStep, previousLongReviewSuccessCount
  - add nextLearningStep, nextLongReviewSuccessCount, nextDueAt
  - DROP @@unique([sessionId, cardId]) so the same card can be reviewed again when re-queued
  - guard accidental double-submit of the same presentation; do not block legitimate re-queue

Create CardReviewState on:
  - create card
  - CSV confirm import
  - copy public deck / copy group deck
  - confirm deck preview
Safety net on startLesson / startHomeLesson if missing.

Ladder is global (not per-deck).
```

### Lesson selection and session length

```txt
- Due = dueAt <= now; order dueAt ASC; optional ties: lastReviewedAt ASC, card.position ASC.
- Start (deck or home): select up to lessonSize due cards; create ACTIVE session.
- After each review: if reviewedCount < lessonSize, select next due card in session scope
  (including cards not in the initial list and cards already reviewed in this session if due again).
- If reviewedCount >= lessonSize OR no due cards now → nextCard = null.
- No wait/countdown UI.
- submitReview returns nextCard (LessonCard | null).
```

### Home START vs deck lesson

```txt
- Home START: own decks where targetLanguage = activeTargetLanguage; due across those decks.
- Deck detail Start lesson: single deck; scope=DECK.
- Public/group originals are not in Home START (study after copy).
- StudySessionReview always stores the card’s deckId.
```

### Progress counters

```txt
Per deck and Home aggregate (own decks of active target):
  toLearnCount   = learningStep in 0..1
  practicedCount = learningStep in 2..6
  learnedCount   = learningStep in 7..8
Also expose dueCount (dueAt <= now) for empty states / START enablement.
Replace deckLearningStats newCards/reviewedCards with group counts in this epic.
```

### UI

```txt
- Home: aggregate counters + START; no deck list.
- Empty Home: 0 cards → “Додайте картки для вивчення”; has cards but dueCount=0 → “Немає карток для повторення зараз” (en/uk).
- Decks tab + deck detail: per-deck counters; deck detail card rows → learningGroup badge.
- Lesson UI v1: no group badge; sides follow promptDirection.
- Home visual: inspired by product mock, not 1:1 copy.
```

## Epic Rules

```txt
1. Keep each TASK small and reviewable (one task = one focused commit).
2. Do not refactor unrelated code.
3. Follow docs/algorithms/learning-steps.md and Agreed Decisions above.
4. Backend is source of truth for scheduling; frontend must not calculate steps/dueAt.
5. packages/srs must stay pure (no Nest/Prisma/GraphQL/React).
6. Do not weaken permissions or auth.
7. Do not show group badges inside the active lesson UI (v1).
8. Do not add wait/countdown UI for future dueAt.
9. Follow docs/domain/permissions.md for deck access.
10. Translate new user-facing strings (en/uk) in the dedicated i18n task.
```

## Recommended Task Order

```txt
26.01 → 26.02                    packages/srs algorithm + tests
26.03                            Prisma migration (CRS + session + review)
26.04 → 26.05                    domain types/mappers + repositories
26.06 → 26.07                    create-on-write + start safety net
26.08 → 26.09 → 26.10 → 26.11   submitReview, startLesson, startHomeLesson, nextCard
26.12 → 26.13                    GraphQL lesson types + progress queries
26.14 → 26.15 → 26.16 → 26.17   mobile GraphQL, Home, Decks/badges, lesson UI
26.18 → 26.19                    i18n + smoke
```

## Epic Summary

```md
- [ ] TASK-26.01 Replace @flashcards/srs SM-2 with learning-steps types and calculator
- [ ] TASK-26.02 Add learning-steps unit tests in @flashcards/srs
- [ ] TASK-26.03 Migrate Prisma CardReviewState, StudySession, StudySessionReview
- [ ] TASK-26.04 Update lessons domain types and mappers for learning steps
- [ ] TASK-26.05 Update CardReviewState and StudySession repository ports/impl
- [ ] TASK-26.06 Create CardReviewState on card create, CSV, copy, preview confirm
- [ ] TASK-26.07 Ensure missing CardReviewState on lesson start (safety net)
- [ ] TASK-26.08 Rewrite SubmitReviewUseCase for learning steps
- [ ] TASK-26.09 Update StartLessonUseCase for due-only selection and promptDirection
- [ ] TASK-26.10 Add StartHomeLessonUseCase and startHomeLesson mutation
- [ ] TASK-26.11 Return next due LessonCard from submitReview (session re-queue)
- [ ] TASK-26.12 Update GraphQL lesson/review types (drop SM-2 fields)
- [ ] TASK-26.13 Add homeLearningProgress and replace deckLearningStats groups
- [ ] TASK-26.14 Update mobile lessons GraphQL operations and regenerate types
- [ ] TASK-26.15 Redesign Home screen: counters, START, empty CTAs
- [ ] TASK-26.16 Add Decks/deck-detail counters and card learningGroup badges
- [ ] TASK-26.17 Lesson UI: honor promptDirection; consume nextCard from submitReview
- [ ] TASK-26.18 Add learning-steps i18n strings (en/uk)
- [ ] TASK-26.19 Learning steps smoke checks + final epic checks
```

---

# TASK-26.01 Replace @flashcards/srs SM-2 with learning-steps types and calculator

## Status

TODO

## Context

`@flashcards/srs` currently exports `calculateNextReview` / SM-2 types used by `SubmitReviewUseCase`. Product replaces SM-2 with learning steps 0–8.

## Goal

Implement learning-steps types and pure calculator; stop exporting SM-2 from the package public API.

## Related Documents

```txt
docs/algorithms/learning-steps.md
docs/algorithms/sm-2.md
```

## Files to Create

```txt
packages/srs/src/learning-steps.ts
```

## Files to Modify

```txt
packages/srs/src/types.ts
packages/srs/src/index.ts
packages/srs/src/sm2.ts (delete)
packages/srs/src/sm2.test.ts (delete or replace in 26.02)
```

## Requirements

Replace SM-2 types with:

```ts
export type ReviewAnswer = 'KNOW' | 'DONT_KNOW'

export type LearningGroup = 'TO_LEARN' | 'PRACTICED' | 'LEARNED'

export type PromptDirection = 'FRONT_TO_BACK' | 'BACK_TO_FRONT'

export type LearningStepsInput = {
  answer: ReviewAnswer
  previousLearningStep: number // 0..8
  previousLongReviewSuccessCount: number
  reviewedAt: Date
}

export type LearningStepsResult = {
  learningStep: number
  longReviewSuccessCount: number
  dueAt: Date
}
```

Implement:

```ts
export function calculateNextLearningState(input: LearningStepsInput): LearningStepsResult

export function learningGroupForStep(step: number): LearningGroup

export function resolvePromptDirection(input: {
  learningStep: number
  randomBit: 0 | 1
}): PromptDirection
```

```txt
1. Follow docs/algorithms/learning-steps.md exactly.
2. calculateNextLearningState must be deterministic (no Date.now(), no Math.random()).
3. Delete/stop exporting calculateNextReview, Sm2Input, Sm2Result, Sm2Quality.
4. Package must not import NestJS / Prisma / GraphQL / React.
```

## Security Requirements

```txt
- No secrets or PII in the package.
```

## Acceptance Criteria

```txt
- Public package API is learning-steps based.
- sm2.ts is removed from exports (preferably deleted).
- packages/srs typecheck/build pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs typecheck
pnpm --filter @flashcards/srs build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.01 Replace @flashcards/srs SM-2 with learning-steps calculator
```

---

# TASK-26.02 Add learning-steps unit tests in @flashcards/srs

## Status

TODO

## Context

Learning steps have many branches; regressions break scheduling for every user.

## Goal

Add table-driven Vitest coverage for Know / Don't know / groups / prompt direction.

## Related Documents

```txt
docs/algorithms/learning-steps.md
```

## Files to Create

```txt
packages/srs/src/learning-steps.test.ts
```

## Files to Modify

```txt
packages/srs/src/sm2.test.ts (delete if still present)
```

## Requirements

```txt
1. Fix reviewedAt in tests (e.g. 2026-01-01T00:00:00.000Z) and assert exact dueAt.
2. Cover Know: 0→1 (+90s), 1→2 (+30m), 2→3 (+12h), 3→4 (+24h), 4→5 (+2d), 5→6 (+7d), 6→7 (+14d).
3. Cover Know 7→8 (count=0, +60d).
4. Cover Know on step 8: count 0→1 (+60d), 1→2 (+90d), 2→3 (+180d), ≥3 (+180d).
5. Cover Don't know: steps 0–1 unchanged +2m; 2–5 step-1 +15m; 6–8 step-2 (floor 0) +12h and count=0.
6. Cover learningGroupForStep bands and resolvePromptDirection (fixed + randomBit for 3/4/8).
7. Remove SM-2 tests.
```

## Acceptance Criteria

```txt
- pnpm --filter @flashcards/srs test passes.
- SM-2 tests are gone.
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
TASK-26.02 Add learning-steps unit tests in @flashcards/srs
```

---

# TASK-26.03 Migrate Prisma CardReviewState, StudySession, StudySessionReview

## Status

TODO

## Context

Prisma still stores SM-2 fields. Home multi-deck lessons need nullable `StudySession.deckId` + scope. Re-queue of the same card requires dropping `StudySessionReview` uniqueness on `(sessionId, cardId)`.

## Goal

Ship one Prisma migration that switches review persistence to learning steps and supports Home sessions + re-queue.

## Related Documents

```txt
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
apps/api/prisma/migrations/<timestamp>_learning_steps/migration.sql
```

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

Add enum:

```prisma
enum StudySessionScope {
  DECK
  HOME_ACTIVE_TARGET
}
```

Change `CardReviewState`:

```prisma
learningStep           Int      @default(0)
longReviewSuccessCount Int      @default(0)
dueAt                  DateTime
lastReviewedAt         DateTime?
// remove: easeFactor, intervalDays, repetitions
```

Data migration for existing `CardReviewState` rows:

```txt
learningStep = 0, longReviewSuccessCount = 0, dueAt = NOW(), then drop SM-2 columns
```

Change `StudySession`:

```prisma
scope  StudySessionScope @default(DECK)
deckId String?           // was required
```

Change `StudySessionReview`:

```prisma
previousLearningStep           Int?
previousLongReviewSuccessCount Int?
nextLearningStep               Int
nextLongReviewSuccessCount     Int
nextDueAt                      DateTime
// remove: quality, previousEaseFactor, previousIntervalDays, previousRepetitions,
//         nextEaseFactor, nextIntervalDays, nextRepetitions
// DROP @@unique([sessionId, cardId])
```

Existing `StudySessionReview` / old ACTIVE sessions: delete or reset in migration if simpler (document in migration comment).

## Security Requirements

```txt
- Migration must not log or export user PII.
- Do not weaken FK/onDelete ownership rules.
```

## Acceptance Criteria

```txt
- Schema matches Requirements.
- Migration SQL resets CRS rows as specified.
- prisma validate + generate pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.03 Migrate Prisma CardReviewState and study sessions to learning steps
```

---

# TASK-26.04 Update lessons domain types and mappers for learning steps

## Status

TODO

## Context

Domain types and Prisma mappers still mirror SM-2 columns.

## Goal

Align `CardReviewState`, `StudySession`, `StudySessionReview` domain types and mappers with the new schema.

## Files to Modify

```txt
apps/api/src/modules/lessons/domain/types/card-review-state.type.ts
apps/api/src/modules/lessons/domain/types/study-session.type.ts
apps/api/src/modules/lessons/domain/types/study-session-review.type.ts
apps/api/src/modules/lessons/domain/types/index.ts
apps/api/src/modules/lessons/infrastructure/mappers/card-review-state.mapper.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session.mapper.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session-review.mapper.ts
(+ corresponding *.spec.ts)
```

## Requirements

```txt
1. CardReviewState domain: learningStep, longReviewSuccessCount, dueAt, lastReviewedAt (no SM-2 fields).
2. StudySession domain: scope DECK | HOME_ACTIVE_TARGET; deckId string | null.
3. StudySessionReview domain: previous/next learning step + count fields; nextDueAt; no quality/SM-2 snapshots.
4. Mappers round-trip Prisma ↔ domain.
5. Update mapper unit tests.
```

## Acceptance Criteria

```txt
- No SM-2 field names remain on these domain types.
- Mapper specs pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/infrastructure/mappers
pnpm --filter @flashcards/api exec prisma generate
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.04 Update lessons domain types and mappers for learning steps
```

---

# TASK-26.05 Update CardReviewState and StudySession repository ports/impl

## Status

TODO

## Context

Repository ports still upsert SM-2 fields and only select due cards for a single deck. Home START needs multi-deck due selection and group counts.

## Goal

Update review/session repository ports and Prisma implementations for learning steps, initial create, multi-deck due query, and group counting.

## Files to Modify

```txt
apps/api/src/modules/lessons/application/ports/card-review-state-repository.port.ts
apps/api/src/modules/lessons/application/ports/study-session-repository.port.ts
apps/api/src/modules/lessons/infrastructure/persistence/prisma-card-review-state.repository.ts
apps/api/src/modules/lessons/infrastructure/persistence/prisma-study-session.repository.ts
```

## Requirements

```txt
1. Upsert/update input uses learningStep, longReviewSuccessCount, dueAt, lastReviewedAt.
2. Add createInitialIfMissing / createInitialMany:
   learningStep=0, longReviewSuccessCount=0, dueAt=now, lastReviewedAt=null (idempotent).
3. Keep findDueCardIdsForDeck; add findDueCardIdsForOwnDecksWithTargetLanguage
   → Array<{ cardId, deckId }> ordered by dueAt ASC, limit N.
4. Add group count helpers for one deck and for own decks of a target language.
5. StudySession.create accepts scope + nullable deckId.
6. createReview persists learning-step snapshots (no quality).
7. abandonActiveForUser abandons any ACTIVE session for the user (Home sessions have null deckId).
8. Multi-deck due query must filter deck.userId = userId and targetLanguage.
```

## Security Requirements

```txt
- Review-state queries always filter by userId.
- Multi-deck due query only includes decks owned by userId.
```

## Acceptance Criteria

```txt
- Ports compile against new domain types.
- Owned-deck due query excludes other users’ decks and wrong targetLanguage.
- Initial create is idempotent.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec tsc --noEmit
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.05 Update review/session repositories for learning steps
```

---

# TASK-26.06 Create CardReviewState on card create, CSV, copy, preview confirm

## Status

TODO

## Context

Today `CardReviewState` is created only inside `SubmitReviewUseCase` upsert. Counters and due selection need state at card write time.

## Goal

Create initial review state for the deck owner whenever cards are added via create / CSV / copy / preview confirm.

## Files to Create

```txt
Optional shared helper, e.g.
apps/api/src/modules/lessons/application/services/ensure-card-review-state.service.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/application/use-cases/create-card.use-case.ts
apps/api/src/modules/csv-import/application/use-cases/confirm-csv-import.use-case.ts
apps/api/src/modules/decks/application/use-cases/copy-public-deck.use-case.ts
apps/api/src/modules/groups/application/use-cases/copy-group-deck.use-case.ts
apps/api/src/modules/languages/application/use-cases/confirm-deck-preview.use-case.ts
(+ module wiring + specs)
```

## Requirements

```txt
1. After cards exist for owner userId, ensure CRS: step 0, count 0, dueAt=now, lastReviewedAt=null.
2. Idempotent if state already exists (never reset progress).
3. Copy/preview: create state for the new owner for each created/updated study card.
4. Do not create review state for other users / public viewers.
```

## Security Requirements

```txt
- Only create CRS for the owner of the destination deck.
- Keep existing auth / blocked-user checks on these use cases.
```

## Acceptance Criteria

```txt
- createCard creates CRS for owner.
- confirmCsvImport creates CRS for each imported card.
- copy public/group and confirmDeckPreview create CRS for resulting owner cards.
- Specs cover createCard + at least one bulk path.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/decks/application/use-cases/create-card.use-case.spec.ts
pnpm --filter @flashcards/api exec vitest run src/modules/csv-import
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.06 Create CardReviewState on card write paths
```

---

# TASK-26.07 Ensure missing CardReviewState on lesson start (safety net)

## Status

TODO

## Context

Legacy cards or missed write paths may still lack CRS. Selection must not depend on “new card without state”.

## Goal

When starting a deck lesson, ensure every candidate card for the user has CRS (initial if missing) before due selection. Remove the “new without state” branch.

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
```

## Requirements

```txt
1. For deck start: createInitialIfMissing for all non-deleted cards in the deck for current user.
2. Do not overwrite existing learningStep / dueAt / count.
3. After ensure: select due cards only (dueAt <= now).
4. Same helper must be reusable from StartHomeLesson (26.10).
```

## Security Requirements

```txt
- Only ensure CRS for the authenticated user.
- Keep existing deck visibility / ownership checks.
```

## Acceptance Criteria

```txt
- Starting a lesson on a deck with cards but no CRS creates step-0 due-now states and can return those cards.
- Existing progressed states are unchanged by the safety net.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.07 Ensure missing CardReviewState on lesson start
```

---

# TASK-26.08 Rewrite SubmitReviewUseCase for learning steps

## Status

TODO

## Context

`SubmitReviewUseCase` maps KNOW/DONT_KNOW to SM-2 quality and calls `calculateNextReview`.

## Goal

Apply `@flashcards/srs` `calculateNextLearningState`, persist new CRS fields, write StudySessionReview without SM-2 snapshots.

## Related Documents

```txt
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
```

## Requirements

```txt
1. Input remains sessionId + cardId + KNOW/DONT_KNOW (no quality from client).
2. Load CRS; if missing, create initial then apply answer (or ensure-then-apply).
3. Call calculateNextLearningState with previous step/count + reviewedAt from clock.
4. Persist CRS + StudySessionReview previous/next learning fields + nextDueAt.
5. Guard accidental double-submit of the same presentation; allow later re-queue of same card.
6. Mock @flashcards/srs in unit tests; do not re-test algorithm math.
7. Keep session ownership / abandoned session / blocked user checks.
```

## Security Requirements

```txt
- Authenticated user only; blocked users rejected.
- Session must belong to current user.
- Card must belong to session scope (deck or home-owned decks).
```

## Acceptance Criteria

```txt
- No SM-2 imports remain in submit-review use case.
- Specs pass with mocked calculator.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.08 Rewrite SubmitReviewUseCase for learning steps
```

---

# TASK-26.09 Update StartLessonUseCase for due-only selection and promptDirection

## Status

TODO

## Context

StartLesson still selects due + “new without state” and returns SM-2-shaped review state.

## Goal

Start a DECK-scoped lesson: ensure CRS, select due cards only, attach `learningStep`, `learningGroup`, `promptDirection` on each lesson card.

## Related Documents

```txt
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
```

## Requirements

```txt
1. StudySession.scope = DECK; deckId set.
2. Abandon any ACTIVE session for the user, then create new session.
3. Due selection only; limit lessonSize; order dueAt ASC.
4. Each returned card includes:
   learningStep, learningGroup, promptDirection, reviewState (learning-step fields).
5. Resolve RANDOM prompt direction with injectable RNG / random bit (testable).
6. Empty due → empty cards / no session (keep existing empty-lesson convention).
```

## Security Requirements

```txt
- Authenticated; blocked rejected.
- User must be allowed to view/study the deck (as today).
```

## Acceptance Criteria

```txt
- StartLesson no longer returns cards without CRS.
- Lesson cards include promptDirection.
- Specs updated and green.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.09 Update StartLessonUseCase for learning steps and promptDirection
```

---

# TASK-26.10 Add StartHomeLessonUseCase and startHomeLesson mutation

## Status

TODO

## Context

Home START must study due cards across all own decks of `activeTargetLanguage`.

## Goal

Add backend use case + GraphQL mutation `startHomeLesson`.

## Related Documents

```txt
docs/domain/lesson-flow.md
docs/tasks/24-study-languages.md
```

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
(+ GraphQL input/payload types; prefer extending StartLessonPayload with scope + nullable deckId)
```

## Requirements

```txt
1. Require non-null activeTargetLanguage (domain error if missing).
2. Ensure CRS safety net for eligible own-deck cards.
3. Select due cards across own decks with that targetLanguage; limit lessonSize.
4. Create session: scope=HOME_ACTIVE_TARGET, deckId=null.
5. Abandon previous ACTIVE session.
6. Lesson cards include deckId (+ learningStep / learningGroup / promptDirection).
7. Only decks where deck.userId === currentUser.id.
```

## Security Requirements

```txt
- Authenticated; blocked rejected.
- Never include cards from decks the user does not own.
```

## Acceptance Criteria

```txt
- startHomeLesson returns mixed-deck due cards for active target.
- Spec covers multi-deck selection and missing activeTargetLanguage.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.10 Add StartHomeLessonUseCase and startHomeLesson mutation
```

---

# TASK-26.11 Return next due LessonCard from submitReview (session re-queue)

## Status

TODO

## Context

Short intervals mean a card can become due again while the session is active. Initial start snapshot alone is not enough.

## Goal

After a successful review, if `reviewedCount < lessonSize`, return `nextCard` for the session scope (with fresh `promptDirection`).

## Related Documents

```txt
docs/domain/lesson-flow.md
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
apps/api/src/modules/lessons/presentation/graphql/types/submit-review-payload.type.ts
```

## Requirements

```txt
1. SubmitReview result includes nextCard: LessonCard | null.
2. If reviewedCount < lessonSize: pick next due card in session scope (dueAt <= now, dueAt ASC).
3. Same cardId allowed when due again.
4. If reviewedCount >= lessonSize or no due cards → nextCard = null.
5. Resolve new promptDirection for nextCard.
6. Specs cover future-due vs immediately-due re-queue cases.
```

## Acceptance Criteria

```txt
- submitReview payload includes nextCard.
- Re-queue of same card is possible when due and under lessonSize.
- Specs green.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.11 Return next due LessonCard from submitReview
```

---

# TASK-26.12 Update GraphQL lesson/review types (drop SM-2 fields)

## Status

TODO

## Context

GraphQL still exposes SM-2 on `CardReviewState` / lesson payloads.

## Goal

Update Nest GraphQL types for CRS, LessonCard, Start/Submit payloads to learning-step fields + enums; remove SM-2 fields.

## Files to Modify

```txt
apps/api/src/modules/lessons/presentation/graphql/types/card-review-state.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/lesson-card.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/start-lesson-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/submit-review-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/complete-lesson-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
(+ registerEnumType for LearningGroup, PromptDirection, StudySessionScope)
```

## Requirements

`CardReviewState` GraphQL fields:

```txt
id, learningStep, longReviewSuccessCount, dueAt, lastReviewedAt
```

`LessonCard` adds:

```txt
deckId, learningStep, learningGroup, promptDirection, reviewState
```

`StartLesson` / home payload:

```txt
sessionId, scope, deckId (nullable), lessonSize, totalCards, cards
```

`SubmitReviewPayload`:

```txt
sessionId, cardId, reviewedCards, reviewState, nextCard
```

```txt
- Remove easeFactor / intervalDays / repetitions / quality from lesson GraphQL types.
```

## Acceptance Criteria

```txt
- Schema no longer contains SM-2 review fields on lesson types.
- API build passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.12 Update GraphQL lesson types for learning steps
```

---

# TASK-26.13 Add homeLearningProgress and replace deckLearningStats groups

## Status

TODO

## Context

`deckLearningStats` returns SM-2-era `newCards` / `dueCards` / `reviewedCards`. Product needs To learn / Practiced / Learned (+ due).

## Goal

Add `homeLearningProgress` query and reshape `deckLearningStats` (plus card `learningGroup` for owner).

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/home-learning-progress.use-case.ts
(+ spec)
apps/api/src/modules/lessons/presentation/graphql/types/home-learning-progress.type.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/deck-learning-stats.use-case.ts
(+ spec)
apps/api/src/modules/lessons/domain/types/deck-learning-stats.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/deck-learning-stats.type.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
(+ deck card GraphQL field for learningGroup)
```

## Requirements

`homeLearningProgress`:

```txt
activeTargetLanguage
toLearnCount
practicedCount
learnedCount
dueCount
totalCardCount
```

Scoped to own decks with `targetLanguage = activeTargetLanguage`.

`deckLearningStats(deckId)`:

```txt
deckId, toLearnCount, practicedCount, learnedCount, dueCount, totalCards, nextDueAt
```

```txt
1. Remove newCards / reviewedCards from GraphQL type.
2. Deck card list for owner includes learningGroup from CRS.
3. Prefer aggregate SQL over N+1 in resolvers.
```

## Security Requirements

```txt
- homeLearningProgress: current user only.
- deckLearningStats: enforce deck view permission as today.
- learningGroup reflects current user’s CRS only.
```

## Acceptance Criteria

```txt
- Queries return group counts matching step bands.
- Unauthorized access rejected.
- Specs green.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/application/use-cases/deck-learning-stats
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/application/use-cases/home-learning-progress
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.13 Add homeLearningProgress and learning-group deck stats
```

---

# TASK-26.14 Update mobile lessons GraphQL operations and regenerate types

## Status

TODO

## Context

`apps/mobile/src/features/lessons/graphql/lessons.graphql` still requests SM-2 fields and has no home start / progress / nextCard.

## Goal

Update GraphQL documents and regenerate hooks/types for the new API.

## Files to Modify

```txt
apps/mobile/src/features/lessons/graphql/lessons.graphql
apps/mobile/src/graphql/generated/index.ts (via codegen)
apps/mobile/src/features/lessons/types/*
apps/mobile/src/features/lessons/hooks/use-active-lesson.ts (minimal fixes if needed)
```

## Requirements

```txt
1. Update StartLesson / SubmitReview / CompleteLesson / DeckLearningStats field selections.
2. Add StartHomeLesson mutation and HomeLearningProgress query.
3. Select nextCard on submitReview.
4. Select promptDirection, learningGroup, learningStep, deckId on lesson cards.
5. Run mobile GraphQL codegen.
6. Fix lessons feature TypeScript breaks enough for typecheck to pass.
```

## Acceptance Criteria

```txt
- lessons.graphql matches new schema.
- Codegen + mobile typecheck pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile codegen
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.14 Update mobile lessons GraphQL for learning steps
```

---

# TASK-26.15 Redesign Home screen: counters, START, empty CTAs

## Status

TODO

## Context

`apps/mobile/app/(tabs)/index.tsx` is a stub. Home should be the primary study entry.

## Goal

Implement Home with aggregate learning counters + START + empty CTAs (no deck list).

## Files to Modify

```txt
apps/mobile/app/(tabs)/index.tsx
apps/mobile/src/features/home/** (create as needed)
apps/mobile/app/lessons/* (navigation into existing lesson routes)
```

## Requirements

```txt
1. Load homeLearningProgress.
2. Show counters: To learn / Practiced / Learned.
3. START → startHomeLesson → navigate to lesson review with sessionId.
4. totalCardCount === 0 → CTA to Decks / add cards.
5. totalCardCount > 0 && dueCount === 0 → no-review-now empty state.
6. No deck list on Home.
7. Visual style inspired by product mock, not 1:1 copy.
```

## Acceptance Criteria

```txt
- Home shows counters for active target.
- START starts home lesson when dueCount > 0.
- Empty CTAs match rules above.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile lint
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.15 Redesign Home screen with learning counters and START
```

---

# TASK-26.16 Add Decks/deck-detail counters and card learningGroup badges

## Status

TODO

## Context

Deck detail still shows SM-2-era `DeckLearningStatsCard`. Card rows have no learning group badge.

## Goal

Show per-deck group counters on Decks list / deck detail; badge each card row with learning group; keep single-deck Start lesson.

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/decks/** (list item / card row)
apps/mobile/src/features/decks/graphql/decks.graphql (learningGroup on cards if needed)
```

## Requirements

```txt
1. Stats card uses toLearn / practiced / learned (+ optional due).
2. Deck list: compact per-deck counters for own decks.
3. Deck detail card rows: badge from learningGroup.
4. Keep Start lesson → startLesson(deckId).
5. Do not show group badge on in-lesson flashcard UI.
```

## Acceptance Criteria

```txt
- Deck detail shows group counters and card badges.
- Start lesson from deck detail still works.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile lint
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.16 Add deck learning counters and card group badges
```

---

# TASK-26.17 Lesson UI: honor promptDirection; consume nextCard from submitReview

## Status

TODO

## Context

Lesson UI always treats front as prompt and advances only through the initial `cards` array.

## Goal

Show prompt/reveal based on `promptDirection`. After submit, use `nextCard` from the response.

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/review-flashcard.tsx
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/hooks/use-active-lesson.ts
apps/mobile/src/features/lessons/types/lesson-card.ts
apps/mobile/src/features/lessons/types/active-lesson.ts
```

## Requirements

```txt
1. FRONT_TO_BACK: show front first, reveal back.
2. BACK_TO_FRONT: show back first, reveal front.
3. After KNOW/DONT_KNOW: if nextCard present → make current; else completeLesson / summary.
4. Disable answer buttons while mutation in flight.
5. Remove any display of easeFactor / intervalDays / repetitions.
6. No group badge on lesson card.
7. No countdown / wait-for-due UI.
```

## Acceptance Criteria

```txt
- Back-first steps show source text first.
- Session continues via nextCard, not only the start snapshot.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile lint
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.17 Honor promptDirection and nextCard in lesson UI
```

---

# TASK-26.18 Add learning-steps i18n strings (en/uk)

## Status

TODO

## Context

Group names and Home empty CTAs need en/uk alongside existing i18n.

## Goal

Add and wire translation keys for learning groups, Home START, empty states, deck stats/badge labels.

## Files to Modify

```txt
apps/mobile i18n locale files (en/uk)
Home + decks string usages from 26.15 / 26.16
```

## Requirements

```txt
1. Keys for: To learn / Practiced / Learned, START, Home empty states, deck stats labels.
2. Ukrainian:
   - Додайте картки для вивчення
   - Немає карток для повторення зараз
3. English equivalents required.
4. No leftover hardcoded user-facing strings on Home counters/empty/START.
```

## Acceptance Criteria

```txt
- Switching interfaceLocale updates Home/deck learning strings.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile lint
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.18 Add learning-steps i18n strings
```

---

# TASK-26.19 Learning steps smoke checks + final epic checks

## Status

TODO

## Context

Need sign-off before marking EPIC-26 DONE.

## Goal

Run automated checks, complete `docs/smoke/learning-steps.md`, mark epic DONE.

## Related Documents

```txt
docs/smoke/learning-steps.md
docs/release/mvp-smoke-tests.md
```

## Files to Modify

```txt
docs/smoke/learning-steps.md
docs/tasks/26-learning-steps.md (statuses → DONE)
```

## Requirements

```txt
1. Automated: srs tests, api lessons tests/build, mobile typecheck/lint, format/lint.
2. Manual checklist in docs/smoke/learning-steps.md.
3. Mark all TASK-26.XX and Epic Status DONE when signed off.
```

## Acceptance Criteria

```txt
- Smoke sign-off filled.
- Epic Status = DONE.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs test
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.19 Sign off learning steps smoke checks
```

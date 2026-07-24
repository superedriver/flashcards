# EPIC-26 Learning Steps

## Epic Goal

Replace SM-2 review scheduling with a fixed **learning steps (0–8)** ladder, expose learning groups in Home / Decks / deck detail, and support **Home START** across due cards in own decks of the active target language.

This epic covers:

```txt
- Add learning-steps algorithm in packages/srs (SM-2 removed only after SubmitReview migrates)
- Migrate CardReviewState / StudySession / StudySessionReview to learning-step fields
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

### Sequencing (critical — do not violate)

```txt
1. Add learning-steps beside SM-2 first. Do NOT delete SM-2 exports until SubmitReview uses learning-steps.
2. Prisma cutover is two-phase:
   - Phase A (26.03): ADD learning-step columns / session scope; KEEP SM-2 columns so existing code still compiles.
   - Phase B (26.09): DROP SM-2 columns from DB and delete packages/srs SM-2 after SubmitReview migrated (26.08).
3. One task = one commit. Do not combine tasks. Do not start the next task until the current one is DONE + committed.
4. If a task’s Commands fail, stop and fix within that task’s scope — or ask. Do not pull in later tasks.
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
Phase A (26.03) — ADD (keep SM-2 columns):
  CardReviewState: +learningStep, +longReviewSuccessCount; reset those + dueAt=now on existing rows
  StudySession: +scope (DECK | HOME_ACTIVE_TARGET), deckId nullable
  StudySessionReview: +previous/next learning step fields; DROP @@unique([sessionId, cardId])
  Keep easeFactor/intervalDays/repetitions/quality/SM-2 snapshot columns until Phase B

Phase B (26.09) — DROP SM-2 columns from CardReviewState + StudySessionReview; delete packages/srs SM-2

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
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not refactor unrelated code.
4. Follow docs/algorithms/learning-steps.md and Agreed Decisions above.
5. Backend is source of truth for scheduling; frontend must not calculate steps/dueAt.
6. packages/srs must stay pure (no Nest/Prisma/GraphQL/React).
7. Do not remove SM-2 from packages/srs until TASK-26.09.
8. Do not drop SM-2 DB columns until TASK-26.09.
9. Do not weaken permissions or auth.
10. Do not show group badges inside the active lesson UI (v1).
11. Do not add wait/countdown UI for future dueAt.
12. Follow docs/domain/permissions.md for deck access.
13. Translate new user-facing strings (en/uk) in the dedicated i18n task.
14. Each task’s Commands to Run must pass before commit. If blocked, stop and ask — do not pull later tasks.
```

## Recommended Task Order

```txt
26.01 → 26.02                    add learning-steps (+ tests); SM-2 stays
26.03                            Prisma Phase A (add columns; keep SM-2 columns)
26.04 → 26.05                    domain/mappers + repositories (learning fields)
26.06 → 26.07                    create-on-write + start safety net
26.08                            SubmitReview → learning-steps
26.09                            Prisma Phase B + delete SM-2 from packages/srs
26.10 → 26.11 → 26.12           startLesson, startHomeLesson, nextCard
26.13 → 26.14                    GraphQL lesson types + progress queries
26.15 → 26.16 → 26.17 → 26.18   mobile GraphQL, Home, Decks/badges, lesson UI
26.19 → 26.20                    i18n + smoke
```

## Epic Summary

```md
- [x] TASK-26.01 Add learning-steps types and calculator alongside SM-2
- [x] TASK-26.02 Add learning-steps unit tests in @flashcards/srs
- [x] TASK-26.03 Prisma Phase A: add learning-step columns (keep SM-2 columns)
- [x] TASK-26.04 Update lessons domain types and mappers for learning steps
- [x] TASK-26.05 Update CardReviewState and StudySession repository ports/impl
- [x] TASK-26.06 Create CardReviewState on card create, CSV, copy, preview confirm
- [x] TASK-26.07 Ensure missing CardReviewState on lesson start (safety net)
- [x] TASK-26.08 Rewrite SubmitReviewUseCase for learning steps
- [x] TASK-26.09 Prisma Phase B: drop SM-2 columns; remove SM-2 from @flashcards/srs
- [x] TASK-26.10 Update StartLessonUseCase for due-only selection and promptDirection
- [x] TASK-26.11 Add StartHomeLessonUseCase and startHomeLesson mutation
- [x] TASK-26.12 Return next due LessonCard from submitReview (session re-queue)
- [x] TASK-26.13 Update GraphQL lesson/review types (drop SM-2 fields)
- [x] TASK-26.14 Add homeLearningProgress and replace deckLearningStats groups
- [x] TASK-26.15 Update mobile lessons GraphQL operations and regenerate types
- [x] TASK-26.16 Redesign Home screen: counters, START, empty CTAs
- [x] TASK-26.17 Add Decks/deck-detail counters and card learningGroup badges
- [x] TASK-26.18 Lesson UI: honor promptDirection; consume nextCard from submitReview
- [ ] TASK-26.19 Add learning-steps i18n strings (en/uk)
- [ ] TASK-26.20 Learning steps smoke checks + final epic checks
```

---

# TASK-26.01 Add learning-steps types and calculator alongside SM-2

## Status

DONE

## Context

Product replaces SM-2 with learning steps 0–8. SM-2 must remain exported until SubmitReview migrates (26.08) and SM-2 is removed (26.09).

## Goal

Add learning-steps types and pure calculator in `@flashcards/srs` **without removing SM-2**.

## Related Documents

```txt
docs/algorithms/learning-steps.md
```

## Files to Create

```txt
packages/srs/src/learning-steps.ts
```

## Files to Modify

```txt
packages/srs/src/types.ts (add learning-steps types; keep Sm2* types)
packages/srs/src/index.ts (export learning-steps AND existing sm2)
```

## Requirements

Add types:

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
3. Do NOT delete sm2.ts.
4. Do NOT remove calculateNextReview / Sm2* exports.
5. Package must not import NestJS / Prisma / GraphQL / React.
```

## Security Requirements

```txt
- No secrets or PII in the package.
```

## Acceptance Criteria

```txt
- Learning-steps API is exported and usable.
- SM-2 API still exported unchanged.
- packages/srs typecheck/build pass.
- pnpm lint passes (API still on SM-2).
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
TASK-26.01 Add learning-steps calculator alongside SM-2
```

---

# TASK-26.02 Add learning-steps unit tests in @flashcards/srs

## Status

DONE

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
None
```

## Requirements

```txt
1. Fix reviewedAt in tests (e.g. 2026-01-01T00:00:00.000Z) and assert exact dueAt.
2. Cover Know: 0→1 (+90s), 1→2 (+30m), 2→3 (+12h), 3→4 (+24h), 4→5 (+2d), 5→6 (+7d), 6→7 (+14d).
3. Cover Know 7→8 (count=0, +60d).
4. Cover Know on step 8: count 0→1 (+60d), 1→2 (+90d), 2→3 (+180d), ≥3 (+180d).
5. Cover Don't know: steps 0–1 unchanged +2m; 2–5 step-1 +15m; 6–8 step-2 (floor 0) +12h and count=0.
6. Cover learningGroupForStep bands and resolvePromptDirection (fixed + randomBit for 3/4/8).
7. Do NOT delete sm2.test.ts (removed later in 26.09).
```

## Acceptance Criteria

```txt
- pnpm --filter @flashcards/srs test passes (learning-steps + existing SM-2 tests).
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

# TASK-26.03 Prisma Phase A: add learning-step columns (keep SM-2 columns)

## Status

DONE

## Context

Need learning-step persistence and Home session scope without breaking current SM-2 TypeScript/API in the same commit.

## Goal

ADD learning-step / session-scope columns. KEEP all SM-2 columns. Reset learning fields on existing CRS rows. Drop `StudySessionReview` unique on `(sessionId, cardId)`.

## Related Documents

```txt
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
apps/api/prisma/migrations/<timestamp>_learning_steps_phase_a/migration.sql
```

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

```txt
1. Add enum StudySessionScope { DECK HOME_ACTIVE_TARGET }.
2. CardReviewState — ADD learningStep Int @default(0), longReviewSuccessCount Int @default(0);
   keep easeFactor, intervalDays, repetitions.
3. Data: every existing CRS row → learningStep=0, longReviewSuccessCount=0, dueAt=now.
4. StudySession — ADD scope default DECK; make deckId optional (String?).
5. StudySessionReview — ADD previousLearningStep, previousLongReviewSuccessCount,
   nextLearningStep @default(0), nextLongReviewSuccessCount @default(0);
   keep quality + SM-2 previous/next columns; DROP @@unique([sessionId, cardId]).
6. Do not change application TypeScript in this task except if prisma generate requires a
   trivial fix — prefer zero TS changes (new fields have defaults).
```

## Security Requirements

```txt
- Migration must not log or export user PII.
- Do not weaken FK/onDelete rules.
```

## Acceptance Criteria

```txt
- Schema has new columns and still has SM-2 columns.
- prisma validate + generate pass.
- Existing API code still typechecks / lint passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api exec tsc --noEmit
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.03 Prisma Phase A add learning-step columns keep SM-2
```

---

# TASK-26.04 Update lessons domain types and mappers for learning steps

## Status

DONE

## Context

Domain types still mirror SM-2-only fields. After Phase A, Prisma has learning fields too.

## Goal

Switch lessons domain `CardReviewState` / `StudySession` / `StudySessionReview` and mappers to learning-step fields (and session scope / nullable deckId). Mappers may ignore leftover SM-2 Prisma columns until 26.09.

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
2. StudySession: scope DECK | HOME_ACTIVE_TARGET; deckId string | null.
3. StudySessionReview: previous/next learning step + count; nextDueAt; no quality/SM-2 snapshots in domain.
4. Mappers map new Prisma columns ↔ domain.
5. Update mapper specs.
6. If use cases / GraphQL break typecheck, make the smallest compile-only adjustments in this task
   (e.g. temporary defaults) — do not rewrite SubmitReview algorithm here (26.08).
```

## Acceptance Criteria

```txt
- Domain types no longer expose SM-2 field names.
- Mapper specs pass.
- API typecheck + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec vitest run src/modules/lessons/infrastructure/mappers
pnpm --filter @flashcards/api exec tsc --noEmit
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

DONE

## Context

Repositories still upsert SM-2-shaped inputs. Need learning-step persistence helpers for later tasks.

## Goal

Update review/session repository ports and Prisma implementations for learning fields, initial create, multi-deck due query, group counts, session scope.

## Files to Modify

```txt
apps/api/src/modules/lessons/application/ports/card-review-state-repository.port.ts
apps/api/src/modules/lessons/application/ports/study-session-repository.port.ts
apps/api/src/modules/lessons/infrastructure/persistence/prisma-card-review-state.repository.ts
apps/api/src/modules/lessons/infrastructure/persistence/prisma-study-session.repository.ts
```

## Requirements

```txt
1. Upsert input: learningStep, longReviewSuccessCount, dueAt, lastReviewedAt.
   While SM-2 DB columns still exist (until 26.09), writes may set SM-2 columns to harmless defaults
   (e.g. easeFactor 2.5, intervalDays 0, repetitions 0) so NOT NULL constraints pass.
2. createInitialIfMissing / createInitialMany: step 0, count 0, dueAt=now (idempotent).
3. Keep findDueCardIdsForDeck; add findDueCardIdsForOwnDecksWithTargetLanguage.
4. Add group count helpers (per deck + own decks of target language).
5. StudySession.create accepts scope + nullable deckId.
6. createReview persists learning-step snapshots (and defaults for leftover SM-2 columns if still required).
7. abandonActiveForUser abandons any ACTIVE session for the user.
8. Multi-deck due query: deck.userId = userId and matching targetLanguage only.
```

## Security Requirements

```txt
- Review-state queries always filter by userId.
- Multi-deck due query only includes decks owned by userId.
```

## Acceptance Criteria

```txt
- Ports/repos compile and lint.
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

DONE

## Context

CRS is still created only on first submitReview. Counters/due need state at card write time.

## Goal

Create initial review state for the deck owner on create / CSV / copy / preview confirm.

## Files to Create

```txt
Optional helper, e.g.
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
1. Initial CRS: learningStep=0, longReviewSuccessCount=0, dueAt=now, lastReviewedAt=null.
2. Idempotent if state already exists (never reset progress).
3. Copy/preview: state for the new owner only.
4. Do not create CRS for public viewers / other users.
```

## Security Requirements

```txt
- Only create CRS for the owner of the destination deck.
```

## Acceptance Criteria

```txt
- createCard + at least one bulk path covered by specs.
- Lint / typecheck pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=create-card --watchman=false
pnpm --filter @flashcards/api exec tsc --noEmit
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

DONE

## Context

Legacy cards may lack CRS. Selection must not depend on “new without state”.

## Goal

On deck lesson start, ensure CRS for all candidate cards (initial if missing). Remove “new without state” branch.

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
```

## Requirements

```txt
1. createInitialIfMissing for non-deleted cards in the deck for current user.
2. Do not overwrite existing learningStep / dueAt / count.
3. After ensure: due selection only (dueAt <= now) — may still be refined in 26.10 for promptDirection.
4. Helper reusable by StartHomeLesson (26.11).
```

## Acceptance Criteria

```txt
- Missing CRS becomes step-0 due-now; existing progress untouched.
- Specs + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=start-lesson --watchman=false
pnpm --filter @flashcards/api exec tsc --noEmit
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

DONE

## Context

SubmitReview still uses `calculateNextReview` (SM-2). Learning-steps calculator and DB columns exist.

## Goal

Switch SubmitReview to `calculateNextLearningState`; persist learning-step fields.

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
1. KNOW/DONT_KNOW only from client (no quality).
2. Call calculateNextLearningState; upsert learning fields.
3. StudySessionReview stores learning-step snapshots.
4. While SM-2 DB columns remain, write harmless defaults if NOT NULL.
5. Mock @flashcards/srs learning-steps in unit tests; do not re-test algorithm math.
6. Keep ownership / active session / blocked checks.
7. Do NOT delete SM-2 from packages/srs in this task (26.09).
8. nextCard can stay null / absent until 26.12.
```

## Security Requirements

```txt
- Authenticated; blocked rejected; session owned by user; card in session scope.
```

## Acceptance Criteria

```txt
- No SM-2 calculateNextReview usage in SubmitReview.
- Specs + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=submit-review --watchman=false
pnpm --filter @flashcards/api exec tsc --noEmit
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.08 Rewrite SubmitReviewUseCase for learning steps
```

---

# TASK-26.09 Prisma Phase B: drop SM-2 columns; remove SM-2 from @flashcards/srs

## Status

DONE

## Context

SubmitReview no longer needs SM-2. Safe to drop legacy columns and package exports.

## Goal

DROP SM-2 columns from Prisma models; delete `sm2.ts` / `sm2.test.ts`; stop exporting SM-2 from `@flashcards/srs`.

## Files to Create

```txt
apps/api/prisma/migrations/<timestamp>_learning_steps_phase_b/migration.sql
```

## Files to Modify

```txt
apps/api/prisma/schema.prisma
packages/srs/src/index.ts
packages/srs/src/types.ts (remove Sm2* if still there)
packages/srs/src/sm2.ts (delete)
packages/srs/src/sm2.test.ts (delete)
(+ any remaining API references to SM-2 columns / imports)
```

## Requirements

```txt
1. Drop CardReviewState easeFactor, intervalDays, repetitions.
2. Drop StudySessionReview quality + SM-2 previous/next ease/interval/repetitions columns.
3. Delete SM-2 from packages/srs public API.
4. Fix any remaining compile breaks in API only as required by dropped columns.
5. Do not implement Home START / nextCard / GraphQL redesign here.
```

## Acceptance Criteria

```txt
- No SM-2 columns in schema.
- No SM-2 exports from @flashcards/srs.
- srs tests (learning-steps only) + API typecheck + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/srs test
pnpm --filter @flashcards/api exec tsc --noEmit
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.09 Drop SM-2 columns and remove SM-2 from @flashcards/srs
```

---

# TASK-26.10 Update StartLessonUseCase for due-only selection and promptDirection

## Status

DONE

## Context

StartLesson should return learning metadata and prompt direction for DECK scope.

## Goal

DECK-scoped start: due-only selection, `learningStep` / `learningGroup` / `promptDirection` on each card; `scope=DECK`.

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
1. scope=DECK; deckId set; abandon any ACTIVE session for user then create.
2. Due only; lessonSize; dueAt ASC.
3. Each card: learningStep, learningGroup, promptDirection, reviewState.
4. Injectable random bit for RANDOM steps.
5. Empty due → empty cards / no session (existing convention).
```

## Acceptance Criteria

```txt
- Cards include promptDirection; no cards without CRS.
- Specs + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=start-lesson --watchman=false
pnpm --filter @flashcards/api exec tsc --noEmit
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.10 Update StartLessonUseCase for learning steps and promptDirection
```

---

# TASK-26.11 Add StartHomeLessonUseCase and startHomeLesson mutation

## Status

DONE

## Context

Home START studies due cards across own decks of `activeTargetLanguage`.

## Goal

Add `StartHomeLessonUseCase` + GraphQL `startHomeLesson`.

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
(+ spec)
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
(+ payload types; prefer extending StartLessonPayload with scope + nullable deckId)
```

## Requirements

```txt
1. Require activeTargetLanguage.
2. CRS safety net for eligible own-deck cards.
3. Due across own decks of that target; lessonSize.
4. Session: scope=HOME_ACTIVE_TARGET, deckId=null.
5. Lesson cards include deckId + learning metadata.
6. Only deck.userId === currentUser.id.
```

## Security Requirements

```txt
- Authenticated; blocked rejected; never include non-owned decks.
```

## Acceptance Criteria

```txt
- Mixed-deck due cards for active target.
- Specs + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=start-home-lesson --watchman=false
pnpm --filter @flashcards/api exec tsc --noEmit
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.11 Add StartHomeLessonUseCase and startHomeLesson mutation
```

---

# TASK-26.12 Return next due LessonCard from submitReview (session re-queue)

## Status

DONE

## Context

Short intervals require re-queue inside the session without countdown UI.

## Goal

After review, if `reviewedCount < lessonSize`, return `nextCard` for session scope with fresh `promptDirection`.

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
apps/api/src/modules/lessons/presentation/graphql/types/submit-review-payload.type.ts
```

## Requirements

```txt
1. Result includes nextCard: LessonCard | null.
2. Pick next due in scope while reviewedCount < lessonSize.
3. Same cardId allowed when due again.
4. New promptDirection for nextCard.
```

## Acceptance Criteria

```txt
- Re-queue works under lessonSize; specs + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=submit-review --watchman=false
pnpm --filter @flashcards/api exec tsc --noEmit
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.12 Return next due LessonCard from submitReview
```

---

# TASK-26.13 Update GraphQL lesson/review types (drop SM-2 fields)

## Status

DONE

## Context

GraphQL still exposes SM-2-shaped review fields to clients.

## Goal

Update Nest GraphQL lesson/review types to learning-step fields + enums; remove SM-2 GraphQL fields.

## Files to Modify

```txt
apps/api/src/modules/lessons/presentation/graphql/types/card-review-state.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/lesson-card.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/start-lesson-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/submit-review-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/complete-lesson-payload.type.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
(+ enums LearningGroup, PromptDirection, StudySessionScope)
```

## Requirements

```txt
CardReviewState: id, learningStep, longReviewSuccessCount, dueAt, lastReviewedAt
LessonCard: deckId, learningStep, learningGroup, promptDirection, reviewState
Start payload: sessionId, scope, deckId nullable, lessonSize, totalCards, cards
Submit payload: sessionId, cardId, reviewedCards, reviewState, nextCard
Remove easeFactor / intervalDays / repetitions / quality from lesson GraphQL types.
```

## Acceptance Criteria

```txt
- Schema has no SM-2 review fields on lesson types.
- API build + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.13 Update GraphQL lesson types for learning steps
```

---

# TASK-26.14 Add homeLearningProgress and replace deckLearningStats groups

## Status

DONE

## Context

Need To learn / Practiced / Learned counters for Home and Decks.

## Goal

Add `homeLearningProgress`; reshape `deckLearningStats`; expose `learningGroup` on owner card list.

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/home-learning-progress.use-case.ts
(+ spec)
apps/api/src/modules/lessons/presentation/graphql/types/home-learning-progress.type.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/deck-learning-stats.use-case.ts
apps/api/src/modules/lessons/domain/types/deck-learning-stats.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/deck-learning-stats.type.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
(+ card learningGroup field)
```

## Requirements

```txt
homeLearningProgress: activeTargetLanguage, toLearnCount, practicedCount, learnedCount, dueCount, totalCardCount
deckLearningStats: deckId, toLearnCount, practicedCount, learnedCount, dueCount, totalCards, nextDueAt
Remove newCards / reviewedCards from GraphQL type.
Prefer aggregate SQL over N+1.
```

## Security Requirements

```txt
- Current user only; deck permission as today; learningGroup from current user’s CRS.
```

## Acceptance Criteria

```txt
- Counts match step bands; specs + lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=learning --watchman=false
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-26.14 Add homeLearningProgress and learning-group deck stats
```

---

# TASK-26.15 Update mobile lessons GraphQL operations and regenerate types

## Status

DONE

## Context

Mobile GraphQL still requests SM-2 fields.

## Goal

Update documents + codegen for learning-steps API (home start, progress, nextCard).

## Files to Modify

```txt
apps/mobile/src/features/lessons/graphql/lessons.graphql
apps/mobile/src/graphql/generated/index.ts (via codegen)
apps/mobile/src/features/lessons/types/*
apps/mobile/src/features/lessons/hooks/use-active-lesson.ts (minimal)
```

## Requirements

```txt
1. Update StartLesson / SubmitReview / CompleteLesson / DeckLearningStats selections.
2. Add StartHomeLesson + HomeLearningProgress.
3. Select nextCard, promptDirection, learningGroup, learningStep, deckId.
4. Codegen; typecheck passes.
5. Do not redesign Home UI here (26.16).
```

## Acceptance Criteria

```txt
- lessons.graphql matches schema; mobile typecheck passes.
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
TASK-26.15 Update mobile lessons GraphQL for learning steps
```

---

# TASK-26.16 Redesign Home screen: counters, START, empty CTAs

## Status

DONE

## Context

Home tab is a stub; should be primary study entry.

## Goal

Home: aggregate counters + START + empty CTAs; no deck list.

## Files to Modify

```txt
apps/mobile/app/(tabs)/index.tsx
apps/mobile/src/features/home/** (create as needed)
```

## Requirements

```txt
1. Load homeLearningProgress.
2. Counters: To learn / Practiced / Learned.
3. START → startHomeLesson → lesson review route.
4. totalCardCount === 0 → add-cards CTA; dueCount === 0 with cards → no-review-now.
5. No deck list. Mock is inspiration only.
```

## Acceptance Criteria

```txt
- Home counters + START + empty states work; typecheck/lint pass.
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
TASK-26.16 Redesign Home screen with learning counters and START
```

---

# TASK-26.17 Add Decks/deck-detail counters and card learningGroup badges

## Status

DONE

## Context

Need per-deck counters and card badges; keep single-deck Start lesson.

## Goal

Show group counters on Decks/detail; badge card rows; no badge in lesson UI.

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/decks/**
apps/mobile/src/features/decks/graphql/decks.graphql (if needed)
```

## Requirements

```txt
1. Stats: toLearn / practiced / learned (+ optional due).
2. Deck list compact counters for own decks.
3. Detail card rows: learningGroup badge.
4. Start lesson → startLesson(deckId).
5. No in-lesson group badge.
```

## Acceptance Criteria

```txt
- Counters/badges visible; deck start works; typecheck/lint pass.
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
TASK-26.17 Add deck learning counters and card group badges
```

---

# TASK-26.18 Lesson UI: honor promptDirection; consume nextCard from submitReview

## Status

DONE

## Context

Lesson UI always shows front first and walks only the initial cards array.

## Goal

Honor `promptDirection`; advance via `nextCard`.

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/review-flashcard.tsx
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/hooks/use-active-lesson.ts
apps/mobile/src/features/lessons/types/*
```

## Requirements

```txt
1. FRONT_TO_BACK / BACK_TO_FRONT from server.
2. After answer: nextCard or complete/summary.
3. Disable buttons while mutation in flight.
4. No SM-2 fields; no group badge; no countdown.
```

## Acceptance Criteria

```txt
- Prompt side + nextCard loop work; typecheck/lint pass.
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
TASK-26.18 Honor promptDirection and nextCard in lesson UI
```

---

# TASK-26.19 Add learning-steps i18n strings (en/uk)

## Status

TODO

## Context

Group names and Home empty CTAs need en/uk.

## Goal

Add and wire i18n keys for groups, START, empty states, deck stats labels.

## Files to Modify

```txt
apps/mobile i18n locale files (en/uk)
Home + decks string usages
```

## Requirements

```txt
1. To learn / Practiced / Learned, START, empty CTAs, deck stats labels.
2. UK: «Додайте картки для вивчення», «Немає карток для повторення зараз».
3. English equivalents.
4. No leftover hardcoded Home learning strings.
```

## Acceptance Criteria

```txt
- interfaceLocale switch updates strings.
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
TASK-26.19 Add learning-steps i18n strings
```

---

# TASK-26.20 Learning steps smoke checks + final epic checks

## Status

TODO

## Context

Sign-off before marking epic DONE.

## Goal

Run automated checks; complete `docs/smoke/learning-steps.md`; mark epic DONE.

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
2. Manual smoke checklist.
3. Mark all TASK-26.XX + Epic Status DONE when signed off.
```

## Acceptance Criteria

```txt
- Smoke signed off; Epic Status = DONE.
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
TASK-26.20 Sign off learning steps smoke checks
```

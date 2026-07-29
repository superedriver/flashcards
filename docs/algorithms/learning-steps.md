# Learning Steps Algorithm

## Purpose

This document defines the spaced-repetition **learning steps** algorithm used by Flashcards after EPIC-26.

It **replaces** the MVP SM-2 review flow documented in `docs/algorithms/sm-2.md` (kept for history only).

Implementation must live in:

```txt
packages/srs
```

The backend calls this package when a user submits a review answer.

The frontend must never calculate scheduling or learning step transitions.

## Package Location

```txt
packages/srs/
  package.json
  tsconfig.json
  src/
    index.ts
    learning-steps.ts
    types.ts
```

(`sm2.ts` was removed after EPIC-26 SubmitReview migration; see historical `docs/algorithms/sm-2.md`.)

## Core Rule

The algorithm must be implemented as a pure deterministic function for Know / Don't know transitions.

```ts
export function calculateNextLearningState(input: LearningStepsInput): LearningStepsResult
```

Rules:

```txt
- No database access.
- No NestJS / Prisma / GraphQL imports.
- No current time lookup inside the function (caller passes reviewedAt).
- Same input must always produce same output (except RANDOM prompt direction — see below).
- Prompt direction for fixed steps is derived from step; for random steps the caller may pass a resolved direction or the package may accept a randomBit.
```

## Card Groups

Derived from `learningStep` (never stored separately as source of truth):

```txt
To learn:   steps 0–1
Practiced:  steps 2–6
Learned:    steps 7–8
```

## State Fields (CardReviewState)

Per user per card:

```txt
learningStep: 0..8
longReviewSuccessCount: integer >= 0
dueAt: DateTime
lastReviewedAt: DateTime | null
```

Removed (SM-2 era):

```txt
easeFactor
intervalDays
repetitions
```

## Prompt Direction

Shown first side of the card, then reveal the other.

```txt
FRONT_TO_BACK  -> show front (target), reveal back (source)
BACK_TO_FRONT  -> show back (source), reveal front (target)
```

| Step | Direction                           |
| ---- | ----------------------------------- |
| 0    | FRONT_TO_BACK                       |
| 1    | FRONT_TO_BACK                       |
| 2    | FRONT_TO_BACK                       |
| 3    | RANDOM 50/50 **per review attempt** |
| 4    | RANDOM 50/50 **per review attempt** |
| 5    | BACK_TO_FRONT                       |
| 6    | BACK_TO_FRONT                       |
| 7    | BACK_TO_FRONT                       |
| 8    | RANDOM 50/50 **per review attempt** |

Random means: on each review attempt for that card, independently choose FRONT_TO_BACK or BACK_TO_FRONT with equal probability. Do not persist the choice across attempts.

The backend resolves `promptDirection` when building the lesson card payload (and again if the same card is re-queued later in the session).

## Know

```txt
oldStep = learningStep
newStep = min(oldStep + 1, 8)
```

### Know when oldStep is 0..6

```txt
learningStep = newStep
longReviewSuccessCount unchanged (typically 0 until Learned long reviews)
dueAt = reviewedAt + intervalFor(newStep)
```

`intervalFor(newStep)`:

| newStep | Interval   |
| ------- | ---------- |
| 1       | 90 seconds |
| 2       | 30 minutes |
| 3       | 12 hours   |
| 4       | 24 hours   |
| 5       | 2 days     |
| 6       | 7 days     |
| 7       | 14 days    |

### Know when oldStep is 7 (enter step 8)

```txt
learningStep = 8
longReviewSuccessCount = 0
dueAt = reviewedAt + 60 days
```

Reason: 7 → 8 is entry into Learned / long-review mode, not a completed long-review success.

### Know when oldStep is already 8

```txt
learningStep = 8
longReviewSuccessCount += 1

if longReviewSuccessCount === 1:
  dueAt = reviewedAt + 60 days
else if longReviewSuccessCount === 2:
  dueAt = reviewedAt + 90 days
else:
  dueAt = reviewedAt + 180 days
```

(Months are fixed day counts: 60 / 90 / 180.)

## Don't Know

### Steps 0–1

```txt
learningStep unchanged (0 or 1)
dueAt = reviewedAt + 2 minutes
longReviewSuccessCount unchanged
```

### Steps 2–5

```txt
learningStep = max(learningStep - 1, 0)
dueAt = reviewedAt + 15 minutes
longReviewSuccessCount unchanged
```

### Steps 6–8

```txt
learningStep = max(learningStep - 2, 0)
dueAt = reviewedAt + 12 hours
longReviewSuccessCount = 0
```

## Initial State

When `CardReviewState` is created:

```txt
learningStep = 0
longReviewSuccessCount = 0
dueAt = now
lastReviewedAt = null
```

Create state when:

```txt
- card create
- CSV import (each imported card)
- copy public/group deck (each card for the new owner)
- preview approve (each created/updated card that needs state for the owner)
```

Safety net on `startLesson` / home start:

```txt
If no CardReviewState for (userId, cardId) → create initial state as above.
```

## Migration From SM-2

On deploy of EPIC-26 schema migration:

```txt
For every existing CardReviewState row:
  learningStep = 0
  longReviewSuccessCount = 0
  dueAt = now
Drop easeFactor, intervalDays, repetitions (or stop writing them; prefer drop).
```

## Lesson Selection

Due card:

```txt
dueAt <= now
```

Order:

```txt
dueAt ascending
(optional tie-break: lastReviewedAt ascending, card position ascending)
```

Limit: `UserSettings.lessonSize` (5–100, default 20).

### Single-deck lesson

Unchanged entry point from deck detail: only cards of that deck.

### Home START (multi-deck)

```txt
Own decks only where targetLanguage = activeTargetLanguage
All due cards across those decks, dueAt ASC, limit lessonSize
```

Public/group decks are not included directly; users study them only after copy into own decks.

## Re-queue Inside an Active Lesson Session

```txt
After Know/Don't know, a card may become due again soon (e.g. +90 sec).
When picking the next card in the same session, re-query due cards (dueAt <= now)
for the lesson scope (one deck or multi-deck home scope).
Session continues while reviewedCount < lessonSize and a due card exists.
Same cardId may be reviewed again in the same session when due again
(StudySessionReview must NOT enforce @@unique([sessionId, cardId])).
submitReview returns nextCard (or null).
Do NOT block the UI waiting for timers.
Do NOT show a countdown.
If no due cards remain now (or lessonSize reached), nextCard is null.
```

## StudySessionReview Snapshots

Each answer stores learning-step snapshots (not SM-2):

```txt
previousLearningStep
previousLongReviewSuccessCount
nextLearningStep
nextLongReviewSuccessCount
nextDueAt
```

## Frontend Must Not

```txt
- compute learningStep transitions
- compute dueAt
- decide group from local heuristics without server fields
```

Frontend may display `learningGroup` / `promptDirection` returned by the API.

## Related Documents

```txt
docs/domain/lesson-flow.md
docs/tasks/done/26-learning-steps.md
docs/algorithms/sm-2.md (historical)
docs/tasks/done/07-srs-lessons.md (historical SM-2 implementation)
```

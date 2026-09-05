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
- Same input must always produce same output (except RANDOM presentation mode — see below).
- Base presentation mode for fixed steps is derived from step; for random steps the caller
  passes randomBit. TARGET_TEXT is never returned by the SRS resolver.
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

## Review presentation mode (base)

Question/answer layout and speak rules: `docs/domain/lesson-flow.md`.

This package resolves the **base** mode only. It must not apply `audioOnlyDisabled`.

```txt
TARGET_TEXT_AUDIO
SOURCE_TEXT
TARGET_AUDIO_ONLY
```

`TARGET_TEXT` exists on the GraphQL enum but is produced only by the session layer
when `audioOnlyDisabled` maps `TARGET_AUDIO_ONLY` → `TARGET_TEXT`.

| Step | Base mode                           |
| ---- | ----------------------------------- |
| 0    | TARGET_TEXT_AUDIO                   |
| 1    | TARGET_TEXT_AUDIO                   |
| 2    | TARGET_TEXT_AUDIO                   |
| 3    | RANDOM 50/50 **per review attempt** |
| 4    | RANDOM 50/50 **per review attempt** |
| 5    | RANDOM 50/50 **per review attempt** |
| 6    | RANDOM 50/50 **per review attempt** |
| 7    | RANDOM 50/50 **per review attempt** |
| 8    | RANDOM 50/50 **per review attempt** |

Random mapping:

```txt
Steps 3–4:
  randomBit 0 → TARGET_TEXT_AUDIO
  randomBit 1 → SOURCE_TEXT

Steps 5–8:
  randomBit 0 → SOURCE_TEXT
  randomBit 1 → TARGET_AUDIO_ONLY
```

Random means: on each review attempt for that card, independently choose with equal probability. Do not persist the choice across attempts.

The backend resolves base mode when building the lesson card payload (and again if the same card is re-queued later in the session), then maps to **effective** mode:

```txt
audioOnlyDisabled = false
  TARGET_TEXT_AUDIO → TARGET_TEXT_AUDIO
  SOURCE_TEXT       → SOURCE_TEXT
  TARGET_AUDIO_ONLY → TARGET_AUDIO_ONLY

audioOnlyDisabled = true
  TARGET_TEXT_AUDIO → TARGET_TEXT_AUDIO
  SOURCE_TEXT       → SOURCE_TEXT
  TARGET_AUDIO_ONLY → TARGET_TEXT
```

GraphQL `LessonCard.presentationMode` is the effective mode. There is no `promptDirection`.

`calculateNextLearningState` does not use presentation mode.

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

Queue membership (Home snapshot vs owned-deck live queue, max 3 answers, gap N):
`docs/domain/lesson-flow.md`. This file does not select the next card.

Due card:

```txt
dueAt <= now
card and deck not deleted
```

Home snapshot size: `UserSettings.lessonSize` (5–100, default 20). Deck sessions have no lessonSize cap.

### Single-deck review

Entry: owner Start review on My Decks when dueCount > 0, or deck detail Start review. Live ready queue of that owned deck only.

### Home START (multi-deck)

```txt
Own decks only where targetLanguage = activeTargetLanguage
Frozen snapshot of up to lessonSize unique ready cards
```

Public/group decks are not included directly; users study them only after copy into own decks.

## Repeats in an Active Review Session

Bounded repeats, freeze N at answer time, and when nextCard is null: `docs/domain/lesson-flow.md`.

```txt
Do NOT block the UI waiting for timers.
Do NOT show a countdown.
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
- decide presentationMode from learningStep or front/back
```

Frontend may display `learningGroup` / `presentationMode` returned by the API.

## Related Documents

```txt
docs/domain/lesson-flow.md
docs/tasks/done/26-learning-steps.md
docs/algorithms/sm-2.md (historical)
docs/tasks/done/07-srs-lessons.md (historical SM-2 implementation)
```

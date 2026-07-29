# SuperMemo 2 Algorithm

> **Historical only (pre–EPIC-26). Do not implement.**  
> The current review algorithm is **Learning Steps**: [`docs/algorithms/learning-steps.md`](./learning-steps.md).  
> This file exists only to explain EPIC-07 / EPIC-16 task history and the pre-migration SM-2 model.  
> Do not add SM-2 fields to Prisma, GraphQL, tests, or `packages/srs`. Do not treat this document as a live source of truth.

## Purpose

This document defined the spaced repetition algorithm used by Flashcards **before EPIC-26**.

Flashcards used a simplified SM-2 algorithm for MVP learning sessions **until Learning Steps replaced it**.

The historical implementation lived in `packages/srs` (`sm2.ts`). That module has been removed; `packages/srs` now exports Learning Steps only.

## Package Location (historical)

```txt
packages/srs/
  package.json
  tsconfig.json
  src/
    index.ts
    sm2.ts
    types.ts
```

## Core Rule (historical)

The algorithm was implemented as a pure deterministic function.

```ts
export function calculateNextReview(input: Sm2Input): Sm2Result
```

Rules:

```txt
- No database access.
- No NestJS imports.
- No Prisma imports.
- No GraphQL imports.
- No current time lookup inside the function.
- The caller must pass reviewedAt.
- Same input must always produce same output.
```

## Inputs

```ts
export type Sm2Input = {
  quality: number
  previousEaseFactor: number | null
  previousIntervalDays: number | null
  previousRepetitions: number | null
  reviewedAt: Date
}
```

## Outputs

```ts
export type Sm2Result = {
  easeFactor: number
  intervalDays: number
  repetitions: number
  dueAt: Date
}
```

## Quality Scale

Original SM-2 uses quality values from `0` to `5`.

For Flashcards MVP, the UI has only two review answers:

```txt
DONT_KNOW -> 1
KNOW      -> 4
```

Later, the app may add more buttons:

```txt
Again -> 1
Hard  -> 3
Good  -> 4
Easy  -> 5
```

## Defaults for New Cards

For a new card without previous review state:

```txt
easeFactor = 2.5
intervalDays = 0
repetitions = 0
```

Minimum ease factor:

```txt
1.3
```

## Ease Factor Formula

The new ease factor is calculated after every review:

```txt
newEaseFactor =
  previousEaseFactor +
  (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
```

Then clamp it:

```txt
newEaseFactor = max(1.3, newEaseFactor)
```

## Successful Review Rules

If `quality >= 3`, the review is successful.

```txt
if previousRepetitions == 0:
  intervalDays = 1

if previousRepetitions == 1:
  intervalDays = 6

if previousRepetitions >= 2:
  intervalDays = round(previousIntervalDays * newEaseFactor)

repetitions = previousRepetitions + 1
```

Important:

```txt
Use newEaseFactor for calculating the interval when previousRepetitions >= 2.
```

## Failed Review Rules

If `quality < 3`, the review is failed.

```txt
repetitions = 0
intervalDays = 1
easeFactor = recalculated ease factor, clamped to minimum 1.3
```

The card becomes due again tomorrow.

## Due Date Rule

```txt
dueAt = reviewedAt + intervalDays days
```

The function should preserve the time-of-day from `reviewedAt`.

Example:

```txt
reviewedAt = 2026-01-01T10:00:00Z
intervalDays = 1
dueAt = 2026-01-02T10:00:00Z
```

## Example 1: New Card + KNOW

Input:

```txt
quality = 4
previousEaseFactor = null
previousIntervalDays = null
previousRepetitions = null
reviewedAt = 2026-01-01T10:00:00Z
```

Initial values:

```txt
easeFactor = 2.5
intervalDays = 0
repetitions = 0
```

Quality is `4`, so the review is successful.

Ease factor:

```txt
newEaseFactor = 2.5 + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02))
newEaseFactor = 2.5 + (0.1 - 1 * (0.08 + 1 * 0.02))
newEaseFactor = 2.5 + (0.1 - 0.1)
newEaseFactor = 2.5
```

Result:

```txt
repetitions = 1
intervalDays = 1
easeFactor = 2.5
dueAt = 2026-01-02T10:00:00Z
```

## Example 2: Second Successful Review

Input:

```txt
quality = 4
previousEaseFactor = 2.5
previousIntervalDays = 1
previousRepetitions = 1
reviewedAt = 2026-01-02T10:00:00Z
```

Result:

```txt
repetitions = 2
intervalDays = 6
easeFactor = 2.5
dueAt = 2026-01-08T10:00:00Z
```

## Example 3: Third Successful Review

Input:

```txt
quality = 4
previousEaseFactor = 2.5
previousIntervalDays = 6
previousRepetitions = 2
reviewedAt = 2026-01-08T10:00:00Z
```

Result:

```txt
repetitions = 3
intervalDays = round(6 * 2.5) = 15
easeFactor = 2.5
dueAt = 2026-01-23T10:00:00Z
```

## Example 4: Failed Review

Input:

```txt
quality = 1
previousEaseFactor = 2.5
previousIntervalDays = 6
previousRepetitions = 2
reviewedAt = 2026-01-08T10:00:00Z
```

Ease factor:

```txt
newEaseFactor = 2.5 + (0.1 - (5 - 1) * (0.08 + (5 - 1) * 0.02))
newEaseFactor = 2.5 + (0.1 - 4 * (0.08 + 4 * 0.02))
newEaseFactor = 2.5 + (0.1 - 4 * 0.16)
newEaseFactor = 2.5 + (0.1 - 0.64)
newEaseFactor = 1.96
```

Result:

```txt
repetitions = 0
intervalDays = 1
easeFactor = 1.96
dueAt = 2026-01-09T10:00:00Z
```

## Example 5: Ease Factor Minimum

Input:

```txt
quality = 0
previousEaseFactor = 1.3
previousIntervalDays = 1
previousRepetitions = 0
reviewedAt = 2026-01-01T10:00:00Z
```

The formula may produce a value lower than `1.3`.

Result:

```txt
easeFactor = 1.3
```

## TypeScript Reference Implementation

```ts
export type Sm2Input = {
  quality: number
  previousEaseFactor: number | null
  previousIntervalDays: number | null
  previousRepetitions: number | null
  reviewedAt: Date
}

export type Sm2Result = {
  easeFactor: number
  intervalDays: number
  repetitions: number
  dueAt: Date
}

const DEFAULT_EASE_FACTOR = 2.5
const MIN_EASE_FACTOR = 1.3

export function calculateNextReview(input: Sm2Input): Sm2Result {
  if (!Number.isInteger(input.quality) || input.quality < 0 || input.quality > 5) {
    throw new Error('SM-2 quality must be an integer from 0 to 5.')
  }

  const previousEaseFactor = input.previousEaseFactor ?? DEFAULT_EASE_FACTOR
  const previousIntervalDays = input.previousIntervalDays ?? 0
  const previousRepetitions = input.previousRepetitions ?? 0

  const easeFactor = calculateEaseFactor(previousEaseFactor, input.quality)

  let intervalDays: number
  let repetitions: number

  if (input.quality < 3) {
    repetitions = 0
    intervalDays = 1
  } else {
    repetitions = previousRepetitions + 1

    if (previousRepetitions === 0) {
      intervalDays = 1
    } else if (previousRepetitions === 1) {
      intervalDays = 6
    } else {
      intervalDays = Math.round(previousIntervalDays * easeFactor)
    }
  }

  return {
    easeFactor,
    intervalDays,
    repetitions,
    dueAt: addDays(input.reviewedAt, intervalDays),
  }
}

function calculateEaseFactor(previousEaseFactor: number, quality: number): number {
  const qualityDelta = 5 - quality

  const nextEaseFactor = previousEaseFactor + (0.1 - qualityDelta * (0.08 + qualityDelta * 0.02))

  return Math.max(MIN_EASE_FACTOR, roundToTwoDecimals(nextEaseFactor))
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100
}
```

## Backend Usage Rule

When the user submits a review answer:

```txt
SubmitReviewUseCase
  -> maps answer to quality
  -> loads previous CardReviewState
  -> calls calculateNextReview()
  -> saves new CardReviewState
```

Mapping:

```txt
ReviewAnswer.KNOW      -> quality 4
ReviewAnswer.DONT_KNOW -> quality 1
```

## Frontend Rule

The frontend must never calculate SM-2.

Frontend only sends:

```txt
sessionId
cardId
answer: KNOW | DONT_KNOW
```

The backend is the source of truth for:

```txt
easeFactor
intervalDays
repetitions
dueAt
```

## Database State

The backend stores SRS state in `CardReviewState`.

Required fields:

```txt
userId
cardId
easeFactor
intervalDays
repetitions
dueAt
lastReviewedAt
createdAt
updatedAt
```

Unique constraint:

```txt
userId + cardId
```

## Testing Requirements

The SRS package must include unit tests for:

```txt
- new card + KNOW
- new card + DONT_KNOW
- second successful review
- third successful review
- failed review resets repetitions
- ease factor never goes below 1.3
- dueAt uses reviewedAt + intervalDays
- invalid quality throws an error
```

## Cursor Implementation Rules (historical)

Do **not** implement new work from this file.

For current scheduling, read and follow:

```txt
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
docs/tasks/done/26-learning-steps.md
```

This SM-2 document is retained only for reading historical EPIC-07 / EPIC-16 task logs:

```txt
docs/tasks/done/07-srs-lessons.md
TASK-07.01 Create packages/srs package
TASK-07.02 Implement SM-2 pure function
TASK-07.03 Add SRS unit tests
```

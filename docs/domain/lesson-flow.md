# Lesson Flow

## Purpose

This document defines how learning lessons work in Flashcards.

It is a source-of-truth document for backend lesson logic, frontend lesson UI, and learning-steps integration.

Relevant task files:

```txt
docs/tasks/26-learning-steps.md
docs/tasks/07-srs-lessons.md (historical SM-2 backend)
docs/tasks/16-frontend-lessons.md (historical frontend)
docs/algorithms/learning-steps.md
docs/algorithms/sm-2.md (historical)
docs/domain/permissions.md
```

## Core Concept

A lesson is a short study session for one user.

Scopes:

```txt
DECK                — cards from one deck (deck detail Start lesson)
HOME_ACTIVE_TARGET  — due cards across own decks of activeTargetLanguage (Home START)
```

The lesson flow is:

```txt
User starts lesson (Home or deck)
  -> Backend selects due cards for the scope
  -> User reviews cards one by one
  -> User answers KNOW or DONT_KNOW
  -> Backend updates learning-steps state
  -> Backend may return another currently due card (re-queue)
  -> User completes lesson when nothing due remains (or session rules say complete)
```

The backend is the source of truth for:

```txt
- which cards are in the lesson
- review state (learningStep, longReviewSuccessCount, dueAt)
- prompt direction for each attempt
- study session status
- lesson completion
```

The frontend is responsible for:

```txt
- showing the prompt side first (from promptDirection)
- revealing the other side
- collecting user answer
- calling backend mutations
- displaying progress
```

The frontend must not calculate learning steps or due times.

## Lesson Scope (current product)

Supports:

```txt
- single-deck lessons (deck detail)
- Home multi-deck lessons (own decks, active target language)
- authenticated users only
- due cards (dueAt <= now)
- configurable lesson size
- KNOW / DONT_KNOW answers
- backend learning-steps update after each answer
- re-query due cards within an active session (no countdown UI)
- lesson completion summary
```

Does not support (v1):

```txt
- studying public/group decks without copying into own decks
- group badges inside the active lesson UI
- waiting / countdown until a card becomes due
- custom lesson filters
- advanced answer buttons
- offline lesson mode
- collaborative lessons
```

## Entities

Lesson flow uses these backend entities:

```txt
Deck
Card
CardReviewState
StudySession
StudySessionReview
UserSettings
```

## Study Session Status

Study session statuses:

```txt
ACTIVE
COMPLETED
ABANDONED
```

## Review Answers

Review answers:

```txt
KNOW
DONT_KNOW
```

Frontend must not send quality scores or interval hints.

Scheduling rules: `docs/algorithms/learning-steps.md`.

## Prompt Direction

Each lesson card payload includes `promptDirection`:

```txt
FRONT_TO_BACK
BACK_TO_FRONT
```

Derived from `learningStep` (random 50/50 on steps 3, 4, 8 per attempt). See algorithm doc.

## Learning Groups

Derived from `learningStep` (API may also return `learningGroup`):

```txt
TO_LEARN:   steps 0–1
PRACTICED:  steps 2–6
LEARNED:    steps 7–8
```

Shown on Home aggregates, Decks counters, and deck detail card badges — not in the lesson UI in v1.

## Lesson Size

Lesson size is determined in this order:

```txt
1. Explicit lessonSize input if provided.
2. UserSettings.lessonSize if available.
3. Default lesson size.
```

Default lesson size:

```txt
20
```

Allowed lesson size range:

```txt
min = 5
max = 100
```

If input is outside this range, backend should reject it.

## Card Selection Rule

When starting a lesson, backend selects cards where:

```txt
dueAt <= now
```

Order:

```txt
1. dueAt ascending
2. lastReviewedAt ascending if needed
3. card position ascending if needed
```

Limit: `lessonSize`.

### Single-deck (DECK)

Only cards belonging to that deck (and viewable by the user).

### Home (HOME_ACTIVE_TARGET)

```txt
Own decks only
targetLanguage = UserSettings.activeTargetLanguage
due cards across those decks, dueAt ASC, limit lessonSize
```

### Initial review state

`CardReviewState` is created on card write paths (create / CSV / copy / preview approve) as:

```txt
learningStep = 0
longReviewSuccessCount = 0
dueAt = now
```

Safety net on lesson start: if missing for (userId, cardId), create the same initial state.

There is no separate “new cards without state” queue after EPIC-26 — step-0 due cards cover first exposure.

## Excluded Cards

Lesson must not include:

```txt
- deleted cards
- cards from deleted decks
- cards from decks the user cannot view
- cards from non-owned decks on Home START (public/group originals)
- duplicate cardIds in the initial selection snapshot (re-queue later is allowed when due again)
```

## Empty Lesson

If no due cards exist for the scope:

```txt
Return a successful payload with empty cards / no session (or equivalent), consistently for deck and Home start.
```

Frontend:

```txt
Home: dedicated empty CTAs (no cards vs none due) — see EPIC-26
Deck: No cards to review right now.
```

## Starting a Lesson

### StartLessonUseCase (deck)

```txt
1. Authenticate user.
2. Load deck; check visibility permission.
3. Resolve lesson size.
4. Ensure CardReviewState safety net for deck cards as needed.
5. Select due cards for that deck.
6. Abandon existing ACTIVE session; create StudySession (scope=DECK, deckId set).
7. Return cards with promptDirection + learning metadata.
```

### StartHomeLessonUseCase (Home)

```txt
1. Authenticate user.
2. Require activeTargetLanguage.
3. Resolve lesson size.
4. Select due cards across own decks of that target.
5. Abandon existing ACTIVE session; create StudySession (scope=HOME_ACTIVE_TARGET, deckId null).
6. Return cards (each review still records deckId).
```

## Active Session Handling

```txt
A user may have one ACTIVE session.
```

When starting a new lesson:

```txt
Abandon existing ACTIVE session and create a new ACTIVE session.
```

## StudySession Fields

Required fields:

```txt
id
userId
status
scope (DECK | HOME_ACTIVE_TARGET)
lessonSize
startedAt
completedAt
abandonedAt
createdAt
updatedAt
```

```txt
deckId — required when scope=DECK; null when scope=HOME_ACTIVE_TARGET
```

Recommended optional fields:

```txt
totalCards
reviewedCards
knownCount
dontKnowCount
```

## StudySessionReview Fields

Each answer creates one `StudySessionReview` including `deckId` for the card’s deck (even in Home multi-deck sessions).

## Submitting a Review

`SubmitReviewUseCase` must:

```txt
1. Authenticate user.
2. Load ACTIVE session owned by user.
3. Validate card belongs to session scope.
4. Reject duplicate review for same sessionId + cardId while still enforcing product re-queue rules (see Re-queue).
5. Load CardReviewState; apply packages/srs learning-steps with KNOW/DONT_KNOW.
6. Persist updated learningStep, longReviewSuccessCount, dueAt, lastReviewedAt.
7. Create StudySessionReview.
8. Return updated state / next-card hint as designed in EPIC-26.
```

Frontend must avoid duplicate submits by disabling buttons while loading.

## Re-queue Inside an Active Session

```txt
After KNOW/DONT_KNOW, dueAt may be soon (e.g. +90 seconds).
submitReview returns nextCard by re-querying due cards (dueAt <= now) for the session scope
while reviewedCount < lessonSize.
Do not block the UI waiting for timers; do not show a countdown.
If no cards are due now or lessonSize is reached, nextCard is null.
The same card may appear again in the same session once it is due again.
```

Persistence note:

```txt
StudySessionReview must allow multiple rows per (sessionId, cardId).
Do not keep @@unique([sessionId, cardId]).
Protect only against accidental double-submit of the same presentation, not against legitimate re-queue.
```

Product note: this differs from the old MVP rule “do not repeat failed cards in the same lesson.” Re-appearance is driven only by `dueAt`, not by an explicit fail-repeat queue.

## Completing a Lesson

Lesson can be completed when:

```txt
- no due cards remain for the session scope at completion time, or
- product chooses “initial snapshot exhausted and nothing due” — prefer due-based completion after EPIC-26
```

`CompleteLessonUseCase` must:

```txt
1. Authenticate user.
2. Load session; check ownership and ACTIVE.
3. Mark session COMPLETED; set completedAt.
4. Return summary.
```

Recommended summary:

```txt
sessionId
deckId (nullable for Home)
scope
totalCards / reviewedCards
knownCount
dontKnowCount
completedAt
```

## Abandoning a Lesson

Backend should expose abandon so the frontend can leave a lesson cleanly.

Backend abandons previous ACTIVE sessions when starting a new lesson.

## Home UI (learning entry)

```txt
- Aggregate counters: To learn / Practiced / Learned (own decks, active target)
- START → StartHomeLesson
- No deck list on Home
- Empty CTAs per EPIC-26
```

## Deck UI

```txt
- Per-deck counters on Decks tab / deck detail
- Card row group badges on deck detail
- Start lesson → single-deck StartLesson
```

## Permissions

```txt
- Lessons require authentication.
- Blocked users rejected.
- Deck lesson: user must be allowed to view the deck (owner, or rules for shared view — Home START is own decks only).
- Frontend visibility is UX only; backend enforces.
```

## Related Documents

```txt
docs/algorithms/learning-steps.md
docs/tasks/26-learning-steps.md
docs/architecture.md
docs/domain/permissions.md
```

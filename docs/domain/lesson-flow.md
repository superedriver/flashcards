# Lesson Flow

## Purpose

This document defines how **review sessions** work in Flashcards.

It is the live source of truth for backend queue logic, frontend review UI, and learning-steps integration.

Scheduling intervals and prompt direction stay in `docs/algorithms/learning-steps.md`.

Relevant task files:

```txt
docs/tasks/30-sot-discrepancies.md
docs/tasks/done/29-lesson-queue.md
docs/tasks/done/26-learning-steps.md
docs/tasks/done/07-srs-lessons.md (historical SM-2 backend)
docs/tasks/done/16-frontend-lessons.md (historical frontend)
docs/algorithms/learning-steps.md
docs/algorithms/sm-2.md (historical)
docs/domain/permissions.md
```

## Product terminology

```txt
User-facing (UI and live product docs):
  Review session / Повторення — one study session from Start until complete or abandon.
  Completion title: "Review complete" / "Повторення завершено".
  Do not say Lesson / Урок in the UI.

Technical identifiers (keep in code, GraphQL, Prisma):
  Lesson, StudySession, lessonSize, startLesson, completeLesson, abandonLesson.

Queue algorithm (keep; not the product name of the session):
  Repeat = 2nd or 3rd answer of the same cardId in this session.
```

## Core Concept

A review session is a short study session for one user.

Scopes:

```txt
DECK                — live ready queue of one owned deck (Own Play or deck detail Start)
HOME_ACTIVE_TARGET  — frozen unique-card snapshot across own decks of activeTargetLanguage (Home START)
```

The review-session flow is:

```txt
User starts a review session (Home or owned deck)
  -> Backend selects ready cards for the scope (snapshot or live)
  -> Backend returns the first card for display (not an answer; no showCount / no freeze N)
  -> User answers KNOW or DONT_KNOW
  -> Backend updates learning-steps state
  -> Backend records that answer on the queue (showCount + freeze N), then returns nextCard
  -> The review session completes when nothing is showable now
```

Display, answer, and planning a repeat are separate. Returning a card for the UI is not an answer.

The backend is the source of truth for:

```txt
- which cards may appear (snapshot vs live membership)
- queue state (show counts, repeat gaps)
- review state (learningStep, longReviewSuccessCount, dueAt)
- prompt direction for each attempt
- study session status
- review-session completion
```

The frontend is responsible for:

```txt
- showing the prompt side first (from promptDirection)
- revealing the other side
- collecting user answer
- calling backend mutations
- showing summary after COMPLETED
```

The frontend must not calculate learning steps, due times, gap, or show limits.

The review UI must not show progress or remaining-card counters.

## Review session scope (current product)

Supports:

```txt
- single-deck review sessions on owned decks
- Home multi-deck review sessions (own decks, active target language)
- authenticated users only
- ready cards (dueAt <= now, card and deck not deleted)
- Home snapshot sized by UserSettings.lessonSize
- KNOW / DONT_KNOW answers
- backend learning-steps update after each answer
- bounded repeats in the same session (max 3 answers per cardId)
- no countdown UI
- review completion summary
```

Does not support (v1):

```txt
- studying public/group decks without copying into own decks
- group badges inside the active review UI
- waiting / countdown until a card becomes due
- in-session remaining counters (new / due / repeats)
- resume of an abandoned or crashed session
- custom review-session filters
- advanced answer buttons
- offline lesson mode
- collaborative review sessions
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

Shown on Home aggregates, Decks counters, and deck detail card badges — not in the review UI.

## Ready

A card is ready when:

```txt
dueAt <= now
card.deletedAt is null
deck.deletedAt is null
```

Do not wait for a future `dueAt`. If nothing is showable now, the review session ends.

## Home queue (snapshot)

```txt
- lessonSize comes from UserSettings (5–100, default 20). No extra field on the start screen.
- On start, take a snapshot of up to lessonSize unique ready cards from own decks
  where targetLanguage = activeTargetLanguage.
- If more ready cards exist, take:
  dueAt ASC, then card.createdAt ASC, then cardId ASC.
- Snapshot is frozen: cardIds that become due later and are not in the snapshot never join.
- Cards in the snapshot may repeat in this session if they become ready again.
- If ready = 0 at start: do not create a session; hide the Start button.
```

Persist `StudySession.snapshotCardIds` for Home. Deck sessions store an empty snapshot.

## Deck queue (live)

```txt
- No lessonSize cap. StudySession.lessonSize may be stored as 0 (unused).
- Live queue of the owned deck: newly ready cards of this deck may join during the session.
- Only the deck owner may start a review session. Public/group decks must be copied first.
- If ready = 0 at start: do not create a session; hide the Start button.
```

## Display vs answer vs freeze N

These are three distinct steps:

```txt
1. Display — backend returns a card (start or nextCard). The user sees it.
   No answer yet, no new dueAt. Do not increment showCount. Do not freeze gap N.
2. Answer — user taps Know or Don’t know.
3. Plan the repeat — persist learning-steps, then increment showCount for the answered
   cardId, then freeze N from other cards that are ready AND showable at answer time.
```

A display without an answer does not fill anyone’s gap.

Example (N frozen at answer time, not at display):

```txt
18:00:00  Show A. Only B is ready. Do not freeze N yet.
18:00:20  C becomes due.
18:00:35  D becomes due.
18:00:40  User answers A. Others ready AND showable: B, C, D → N = 3.
          Sequence: A → B → C → D → A repeat.
```

## Primary vs repeat

```txt
- showCount counts answers in this session, not displays.
- Primary = first answer of a cardId in this session (showCount = 0).
- Repeat = 2nd or 3rd answer of that cardId.
- Max 3 answers per cardId per session. After that the card is excluded even if due.
```

## Next primary order

When no showable repeat exists, pick the next primary:

```txt
dueAt ASC, then card.createdAt ASC, then cardId ASC
```

Same order for Home (among unanswered snapshot members that are ready) and Deck.

## Repeat gap

```txt
After answering card A (not when A is displayed), freeze
  N = min(3, count of other cards that are currently ready AND still showable in this session).
N is a target for that pending repeat. Cards that became due between display of A and the
answer of A count toward N (see the 18:00 timeline above).

Gap fill = another card was answered (a completed showing). A repeat answer of B counts as +1
for A. Displaying B without answering does not fill A’s gap.

If N cannot be reached because no other ready/showable cards exist, shrink the remaining gap
to what is actually possible (including 0). Then A may show immediately if it is ready.

When a pending repeat’s gap is satisfied (or shrunk) and the card is ready and showCount < 3,
that repeat beats the next primary.

If several showable repeats exist: dueAt ASC, then cardId ASC.
```

Queue picker lives in the lessons domain (pure TypeScript). It must not live in `packages/srs`.

Persist show counts and pending repeats on `StudySession.queueState`.

## Skip

```txt
- Deleted or no access: drop that cardId from this session forever.
  Home does not replace it with a card outside the snapshot.
- Temporarily not ready (dueAt > now): keep the card in the session; it may become showable later
  under the usual rules.
```

## Initial review state

`CardReviewState` is created on card write paths (create / CSV / copy / preview approve) as:

```txt
learningStep = 0
longReviewSuccessCount = 0
dueAt = now
```

Safety net on review-session start: if missing for (userId, cardId), create the same initial state.

There is no separate “new cards without state” queue — step-0 due cards cover first exposure.

## Excluded Cards

The session must not include:

```txt
- deleted cards
- cards from deleted decks
- cards from decks the user does not own (deck lessons and Home)
- Home: cardIds outside the session snapshot
- cardIds already answered 3 times in this session
```

## Empty review session

If no ready cards exist for the scope at start:

```txt
Do not create a session.
Return a successful payload with empty cards / sessionId null.
Frontend hides the Start button.
```

## Starting a review session

### StartLessonUseCase (deck)

```txt
1. Authenticate user; reject blocked users.
2. Load deck; require ownership (not merely view).
3. Ensure CardReviewState safety net for deck cards as needed.
4. If no ready cards: return empty payload, no session.
5. Abandon existing ACTIVE session; create StudySession (scope=DECK, deckId set, lessonSize 0,
   empty snapshot, empty showCounts).
6. Return the first showable card (promptDirection + learning metadata).
   This display does not increment showCount and does not freeze N.
```

### StartHomeLessonUseCase (Home)

```txt
1. Authenticate user; reject blocked users.
2. Require activeTargetLanguage.
3. Resolve lessonSize from UserSettings (5–100, default 20).
4. Snapshot unique ready cards across own decks of that target (order above, limit lessonSize).
5. If snapshot empty: return empty payload, no session.
6. Abandon existing ACTIVE session; create StudySession (scope=HOME_ACTIVE_TARGET, deckId null,
   empty showCounts).
7. Return the first showable card (each later review still records the card’s deckId).
   This display does not increment showCount and does not freeze N.
```

## Active Session Handling

```txt
A user may have one ACTIVE session.
```

When starting a new lesson:

```txt
Abandon existing ACTIVE session and create a new ACTIVE session.
```

Leftover ACTIVE sessions (app killed) are abandoned on the next Start.

## StudySession Fields

Required fields:

```txt
id
userId
status
scope (DECK | HOME_ACTIVE_TARGET)
lessonSize          — Home: settings value; Deck: 0 (unused)
snapshotCardIds     — Home: frozen ids; Deck: empty
queueState          — showCounts + pendingRepeats
startedAt
completedAt
abandonedAt
createdAt
updatedAt
```

```txt
deckId — required when scope=DECK; null when scope=HOME_ACTIVE_TARGET
```

## StudySessionReview Fields

Each answer creates one `StudySessionReview` including `deckId` for the card’s deck (even in Home multi-deck sessions).

Multiple rows per `(sessionId, cardId)` are required (repeats). Do not keep `@@unique([sessionId, cardId])`.

## Submitting a Review

`SubmitReviewUseCase` must:

```txt
1. Authenticate user.
2. Load ACTIVE session owned by user.
3. Validate the card belongs to the session scope (Deck: that deck; Home: snapshot).
4. Load CardReviewState; apply packages/srs learning-steps with KNOW/DONT_KNOW.
5. Persist updated learningStep, longReviewSuccessCount, dueAt, lastReviewedAt.
6. Create StudySessionReview (attempts, not unique cards).
7. Record the answered card on queueState (increment showCount, freeze N from other
   ready+showable cards at this moment, fill other cards’ gaps).
8. Select nextCard with the domain picker. Do not record that next card as a showing.
9. Return nextCard or null. lessonSize must not stop the queue.
```

Frontend must avoid duplicate submits by disabling buttons while loading.

Frontend must not compute the next card.

## Completing a review session

The review session is completed when there is no ready primary and no showable repeat.

`CompleteLessonUseCase` must:

```txt
1. Authenticate user.
2. Load session; check ownership and ACTIVE.
3. Mark session COMPLETED; set completedAt.
4. Return summary.
```

Summary:

```txt
sessionId
deckId (nullable for Home)
scope
reviewedCards
knownCount
dontKnowCount
completedAt
```

API `knownCount` and `dontKnowCount` are numbers of answers (attempts). If card A was answered 3 times, all 3 answers count. The GraphQL payload is unchanged.

UI summary (product):

```txt
Review complete / Повторення завершено
Nice work
completedAt
Cards in this review: N   (unique answered cardIds; repeats of the same cardId count once)
```

Do not show Reviewed, Know, Don't know, or Known % on this screen. Attempt stats stay in the API only until a later product decision.

## Abandoning a review session

If the user leaves while cards remain:

```txt
- session → ABANDONED
- reviews already saved stay saved
- no summary
- no resume
- next Start always creates a new session
```

Frontend must call `abandonLesson` on confirmed leave.

Backend also abandons previous ACTIVE sessions when starting a new review session.

## Home UI (learning entry)

```txt
- Aggregate counters: To learn / Practiced / Learned (own decks, active target)
- START → StartHomeLesson when dueCount > 0
- Hide START when dueCount = 0
- No deck list on Home
- Do not add a new ready-count UI
```

## Deck UI

```txt
- Per-deck counters on Decks tab / deck detail
- Card row group badges on deck detail
- Card rows display #{position + 1} (storage stays 0-based). Owner Edit/Delete are
  icons on the right with accessibility labels; delete still confirms.
  Even/odd rows use alternating backgrounds; tighter vertical spacing.
- Own My Decks cards: Play (bottom-right) when dueCount > 0
- Tap Own card → deck detail; tap Play → startLesson (/lessons/start?deckId=), same as
  deck detail Start (no extra visit to detail)
- No Play when dueCount = 0
- No Play on Group, Public, or No language cards
- Deck detail (owner):
  Page title “Deck Detail” with language flags on the same row
  Header (deck title, description, visibility badge)
  Stats: Total left / Due now right; To learn, Practiced, Learned in one row
  (no Next review line)
  Primary: large Play icon when dueCount > 0 (a11y Start review)
  Quick icons: Edit, Add card, More ⋯ (a11y labels)
  More: Import CSV, Regenerate translations, Publish / Make private
  Danger zone: label left, Delete deck button right, still confirms
  Cards heading + word list in a bordered box with inner padding
  Assign languages stays visible when the deck has no languages
- Deck detail Start review only for the owner when dueCount > 0
- Non-owners must copy public/group decks before studying
```

## Permissions

```txt
- Review sessions require authentication.
- Blocked users rejected.
- Deck review session: user must own the deck.
- Home review session: own decks of activeTargetLanguage only.
- Frontend visibility is UX only; backend enforces.
```

## Related Documents

```txt
docs/algorithms/learning-steps.md
docs/tasks/30-sot-discrepancies.md
docs/tasks/done/29-lesson-queue.md
docs/tasks/done/26-learning-steps.md
docs/architecture.md
docs/domain/permissions.md
```

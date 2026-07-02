# Lesson Flow

## Purpose

This document defines how learning lessons work in Flashcards.

It is a source-of-truth document for backend lesson logic, frontend lesson UI, and SRS integration.

Relevant task files:

```txt
docs/tasks/07-srs-lessons.md
docs/tasks/16-frontend-lessons.md
docs/algorithms/sm-2.md
docs/domain/permissions.md
```

## Core Concept

A lesson is a short study session for one user and one deck.

The lesson flow is:

```txt
User selects deck
  -> Backend selects lesson cards
  -> User reviews cards one by one
  -> User answers KNOW or DONT_KNOW
  -> Backend updates SRS state
  -> User completes lesson
```

The backend is the source of truth for:

```txt
- which cards are in the lesson
- review state
- SRS scheduling
- study session status
- lesson completion
```

The frontend is responsible for:

```txt
- showing cards
- revealing answers
- collecting user answer
- calling backend mutations
- displaying progress
```

The frontend must not calculate SRS.

## MVP Lesson Scope

MVP lesson supports:

```txt
- one deck per lesson
- authenticated users only
- due cards first
- new cards after due cards
- configurable lesson size
- KNOW / DONT_KNOW answers
- backend SRS update after each answer
- lesson completion summary
```

MVP lesson does not support:

```txt
- multi-deck lessons
- custom lesson filters
- manual card ordering
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

MVP review answers:

```txt
KNOW
DONT_KNOW
```

Mapping to SM-2 quality:

```txt
KNOW      -> 4
DONT_KNOW -> 1
```

This mapping is defined by the backend.

Frontend must not send SM-2 quality directly.

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

When starting a lesson, backend selects cards in this order:

```txt
1. Due cards first.
2. New cards after due cards.
3. Stop when lessonSize is reached.
```

## Due Cards

A due card is a card with existing `CardReviewState` where:

```txt
dueAt <= now
```

Due cards should be ordered by:

```txt
1. dueAt ascending
2. lastReviewedAt ascending if needed
3. card position ascending if needed
```

## New Cards

A new card is a card without `CardReviewState` for the current user.

New cards should be ordered by:

```txt
1. card position ascending
2. card createdAt ascending
```

## Excluded Cards

Lesson must not include:

```txt
- deleted cards
- cards from deleted decks
- cards from decks the user cannot view
- duplicate cards inside one lesson
```

## Empty Lesson

If no due cards and no new cards exist:

```txt
StartLessonUseCase should return an empty lesson payload or a domain error depending on chosen API design.
```

Recommended MVP behavior:

```txt
Return a successful payload with:
- session = null or no active session
- cards = []
- message/state indicating no cards available
```

Frontend should show:

```txt
No cards to review right now.
```

If the API requires a session, then backend may create no session and return empty result.

This behavior must be consistent between backend and frontend.

## Starting a Lesson

`StartLessonUseCase` must:

```txt
1. Authenticate user.
2. Load deck.
3. Check deck visibility permission.
4. Resolve lesson size.
5. Select due cards.
6. Select new cards if there is remaining capacity.
7. Create StudySession if there are selected cards.
8. Return lesson cards and session metadata.
```

## Active Session Handling

MVP rule:

```txt
A user may have one ACTIVE session.
```

When starting a new lesson:

Recommended behavior:

```txt
- abandon existing ACTIVE session for this user
- create a new ACTIVE session
```

Alternative behavior:

```txt
- reuse existing ACTIVE session
```

Chosen MVP behavior:

```txt
Abandon existing ACTIVE session and create a new ACTIVE session.
```

This keeps lesson state simple.

## StudySession Fields

Required fields:

```txt
id
userId
deckId
status
lessonSize
startedAt
completedAt
abandonedAt
createdAt
updatedAt
```

Recommended optional fields:

```txt
totalCards
reviewedCards
knownCount
dontKnowCount
```

If counts can be derived from `StudySessionReview`, storing them is optional.

## StudySessionReview Fields

Required fields:

```txt
id
sessionId
userId
deckId
cardId
answer
quality
reviewedAt
createdAt
```

Optional fields:

```txt
previousEaseFactor
previousIntervalDays
previousRepetitions
nextEaseFactor
nextIntervalDays
nextRepetitions
nextDueAt
```

Storing previous/next values is useful for analytics and debugging, but not mandatory for MVP.

## Lesson Card Payload

Backend should return lesson cards with enough data for frontend display:

```txt
cardId
front
back
example
notes
position
reviewState optional
```

Frontend should not receive sensitive internal fields.

## Frontend Lesson UI States

Frontend lesson should support:

```txt
loading
empty
show front
show answer
submitting answer
completed
error
```

## Frontend Review Flow

For each card:

```txt
1. Show front.
2. User taps reveal answer.
3. Show back/example/notes.
4. User taps KNOW or DONT_KNOW.
5. Frontend calls submitReview.
6. Backend updates SRS state.
7. Frontend moves to next card.
```

Frontend should disable buttons while submitReview is in progress.

Frontend should not advance to next card if submitReview fails.

## Submit Review

`SubmitReviewUseCase` must:

```txt
1. Authenticate user.
2. Load study session.
3. Check session belongs to user.
4. Check session is ACTIVE.
5. Load card.
6. Check card belongs to session deck.
7. Map answer to SM-2 quality.
8. Load previous CardReviewState.
9. Call calculateNextReview from packages/srs.
10. Upsert CardReviewState.
11. Create StudySessionReview.
12. Return updated progress and next review data.
```

## Submit Review Idempotency

MVP simple rule:

```txt
Each submitReview call creates one StudySessionReview.
```

Frontend must avoid duplicate submits by disabling buttons while loading.

Backend should defensively prevent obvious duplicate submission if practical.

Optional backend protection:

```txt
Reject duplicate review for same sessionId + cardId if already reviewed in session.
```

Chosen MVP behavior:

```txt
Reject duplicate review for same sessionId + cardId.
```

This prevents double-click from corrupting SRS state.

## DONT_KNOW Behavior Inside Lesson

MVP rule:

```txt
DONT_KNOW updates SRS state immediately.
```

For repeating wrong cards inside the same lesson:

Recommended MVP behavior:

```txt
Do not automatically repeat failed cards in the same lesson.
```

Reason:

```txt
- simpler backend
- simpler frontend
- SRS state is still updated
- user can start another lesson later
```

Post-MVP behavior may add:

```txt
- repeat failed cards once at the end
- Again/Hard/Good/Easy buttons
- custom cram mode
```

## Completing a Lesson

Lesson can be completed when:

```txt
- all lesson cards have a StudySessionReview
```

`CompleteLessonUseCase` must:

```txt
1. Authenticate user.
2. Load session.
3. Check session belongs to user.
4. Check session is ACTIVE.
5. Check reviewed count.
6. Mark session COMPLETED.
7. Set completedAt.
8. Return summary.
```

Recommended summary:

```txt
sessionId
deckId
totalCards
reviewedCards
knownCount
dontKnowCount
completedAt
```

## Abandoning a Lesson

MVP may not expose a separate abandon mutation.

Backend should expose an abandon mutation so frontend can abandon a lesson when the user leaves the lesson screen.

Backend may abandon previous active sessions when starting a new lesson.

`AbandonLessonUseCase` should:

```txt
- authenticate user
- load session
- check ownership
- mark ACTIVE session as ABANDONED
- set abandonedAt
```

## Deck Learning Stats

Backend should expose deck learning stats for authenticated user.

Recommended query:

```txt
deckLearningStats(deckId)
```

Stats:

```txt
totalCards
newCards
dueCards
learningCards
reviewedCards
nextDueAt
```

Definitions:

```txt
totalCards:
- non-deleted cards in deck

newCards:
- cards without CardReviewState for user

dueCards:
- cards with CardReviewState.dueAt <= now

reviewedCards:
- cards with CardReviewState for user

nextDueAt:
- minimum dueAt in future for this user/deck
```

## Permissions

Lesson permissions must follow:

```txt
docs/domain/permissions.md
```

User can start lesson if:

```txt
- user is authenticated
- user owns deck
- deck is not deleted
```

User can submit review if:

```txt
- session belongs to user
- session is active
- card belongs to session deck
```

## SRS Integration

SRS calculation must follow:

```txt
docs/algorithms/sm-2.md
```

Backend call flow:

```txt
SubmitReviewUseCase
  -> map answer to quality
  -> calculateNextReview()
  -> save CardReviewState
```

Frontend must not calculate:

```txt
easeFactor
intervalDays
repetitions
dueAt
```

## Error Cases

Backend should handle:

```txt
UNAUTHORIZED:
- user is not authenticated

FORBIDDEN:
- user cannot access deck/session

DECK_NOT_FOUND:
- deck does not exist or is hidden

CARD_NOT_FOUND:
- card does not exist or does not belong to deck

LESSON_NOT_FOUND:
- session does not exist

LESSON_NOT_ACTIVE:
- session is completed or abandoned

LESSON_CARD_ALREADY_REVIEWED:
- duplicate review for same session/card

INVALID_REVIEW_ANSWER:
- answer is not KNOW or DONT_KNOW

NO_LESSON_CARDS_AVAILABLE:
- optional, if empty lesson is treated as error
```

## GraphQL Operations

Recommended backend operations:

```txt
startLesson(input): StartLessonPayload
submitReview(input): SubmitReviewPayload
completeLesson(input): CompleteLessonPayload
deckLearningStats(deckId): DeckLearningStats
```

Recommended inputs:

```ts
export type StartLessonInput = {
  deckId: string
  lessonSize?: number
}

export type SubmitReviewInput = {
  sessionId: string
  cardId: string
  answer: 'KNOW' | 'DONT_KNOW'
}

export type CompleteLessonInput = {
  sessionId: string
}
```

## Frontend Routing

Recommended frontend routes:

```txt
/apps/mobile/app/(app)/lesson/[deckId].tsx
/apps/mobile/app/(app)/lesson/session/[sessionId].tsx
/apps/mobile/app/(app)/lesson/session/[sessionId]/summary.tsx
```

## Frontend State Rule

Frontend may keep current lesson queue in memory while user is in lesson.

Frontend should not persist full lesson queue to localStorage.

If app reloads during lesson:

```txt
- MVP may require user to restart lesson
- backend has already saved submitted reviews
```

## Testing Requirements

Backend tests should cover:

```txt
- start lesson with due cards
- start lesson with new cards
- due cards come before new cards
- lesson size limit is respected
- cannot start lesson for inaccessible private deck
- can start lesson for own deck
- cannot start lesson for non-owned deck
- submit KNOW updates CardReviewState
- submit DONT_KNOW updates CardReviewState
- duplicate submitReview is rejected
- cannot submit review for another user's session
- cannot submit review for completed session
- complete lesson marks session completed
- deckLearningStats returns correct counts
```

Frontend manual checks should cover:

```txt
- start lesson from deck detail
- show front first
- reveal answer
- submit KNOW
- submit DONT_KNOW
- progress updates
- completion summary appears
- empty lesson state works
- network error does not advance card
```

## Cursor Implementation Rules

Cursor must read this document before implementing or modifying:

```txt
backend lesson use cases
SRS integration
CardReviewState logic
StudySession logic
lesson GraphQL operations
frontend lesson screens
deck learning stats
```

Implementation must follow this document exactly unless this document is explicitly updated.

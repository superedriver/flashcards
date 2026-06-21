# EPIC-16 Frontend Lessons

## Epic Goal

Implement frontend lesson and review flow for Flashcards.

This epic covers:

```txt
- deck learning stats
- start lesson flow
- lesson review screen
- KNOW / DONT_KNOW answer buttons
- review progress
- lesson completion summary
- frontend integration with backend SRS
```

Important:

```txt
Frontend must not calculate SRS.
Backend is the source of truth for card selection, review state, intervals, due dates, and lesson progress.
```

Backend SRS and lesson flow are handled in:

```txt
docs/tasks/07-srs-lessons.md
```

Deck/card frontend screens are handled in:

```txt
docs/tasks/15-frontend-decks-cards.md
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/algorithms/sm-2.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/07-srs-lessons.md
docs/tasks/13-frontend-foundation.md
docs/tasks/14-frontend-auth.md
docs/tasks/15-frontend-decks-cards.md
```

## Epic Prerequisites

EPIC-15 should be complete.

Expected state:

```txt
- Expo app works.
- Auth works.
- Apollo auth link works.
- Deck list works.
- Deck detail works.
- Deck/card GraphQL codegen works.
- Shared UI primitives exist.
```

## Epic Rules

```txt
1. Use Apollo Client for GraphQL operations.
2. Use generated GraphQL types/hooks when available.
3. Do not calculate SM-2 on frontend.
4. Do not calculate due dates on frontend.
5. Do not select lesson cards on frontend.
6. Do not mutate review state manually in Apollo cache unless backend response is authoritative.
7. Frontend sends only answer: KNOW or DONT_KNOW.
8. Backend maps answer to SM-2 quality.
9. Backend returns updated review state/progress.
10. Keep lesson UI usable on native and web.
11. Do not store secrets in frontend.
12. Do not rely on frontend permissions for security.
```

## MVP Lesson Flow

MVP supports:

```txt
- authenticated lessons only
- one deck per lesson
- due cards first
- new cards after due cards
- default lesson size from backend/user settings
- answer buttons: KNOW and DONT_KNOW
- completion summary
```

MVP does not support:

```txt
- offline lesson queue
- frontend SRS calculation
- multi-deck lessons
- Again/Hard/Good/Easy buttons
- repeating failed cards in the same lesson
```

## Expected Backend Operations

Expected operations from EPIC-07:

```graphql
mutation StartLesson($input: StartLessonInput!) {
  startLesson(input: $input) {
    sessionId
    deckId
    lessonSize
    totalCards
    cards {
      cardId
      front
      back
      example
      notes
      position
      reviewState {
        id
        easeFactor
        intervalDays
        repetitions
        dueAt
        lastReviewedAt
      }
    }
  }
}

mutation SubmitReview($input: SubmitReviewInput!) {
  submitReview(input: $input) {
    sessionId
    cardId
    reviewedCards
    reviewState {
      id
      easeFactor
      intervalDays
      repetitions
      dueAt
      lastReviewedAt
    }
  }
}

mutation CompleteLesson($input: CompleteLessonInput!) {
  completeLesson(input: $input) {
    sessionId
    deckId
    totalCards
    reviewedCards
    knownCount
    dontKnowCount
    completedAt
  }
}

query DeckLearningStats($deckId: ID!) {
  deckLearningStats(deckId: $deckId) {
    deckId
    totalCards
    newCards
    dueCards
    reviewedCards
    nextDueAt
  }
}
```

## Frontend Routes

Implement:

```txt
/lessons/start
/lessons/[sessionId]
/lessons/[sessionId]/summary
```

Recommended query params:

```txt
/lessons/start?deckId=<deckId>
/lessons/[sessionId]?deckId=<deckId>
/lessons/[sessionId]/summary?deckId=<deckId>
```

## Epic Summary

```md
- [ ] TASK-16.01 Add lesson GraphQL documents
- [ ] TASK-16.02 Generate lesson GraphQL types
- [ ] TASK-16.03 Add lessons feature structure
- [ ] TASK-16.04 Add deck learning stats component
- [ ] TASK-16.05 Add lesson start route
- [ ] TASK-16.06 Add lesson state model
- [ ] TASK-16.07 Add lesson review screen
- [ ] TASK-16.08 Add flashcard review component
- [ ] TASK-16.09 Add review answer actions
- [ ] TASK-16.10 Add lesson progress UI
- [ ] TASK-16.11 Add lesson completion flow
- [ ] TASK-16.12 Integrate lessons into deck detail
- [ ] TASK-16.13 Add frontend lesson final checks
```

---

# TASK-16.01 Add lesson GraphQL documents

## Status

TODO

## Context

Frontend lesson screens should use GraphQL documents and generated types.

## Goal

Add lesson GraphQL operation documents.

## Files to Create

```txt
apps/mobile/src/features/lessons/graphql/lessons.graphql
```

## Requirements

Add operations:

```graphql
mutation StartLesson($input: StartLessonInput!) {
  startLesson(input: $input) {
    sessionId
    deckId
    lessonSize
    totalCards
    cards {
      cardId
      front
      back
      example
      notes
      position
      reviewState {
        id
        easeFactor
        intervalDays
        repetitions
        dueAt
        lastReviewedAt
      }
    }
  }
}

mutation SubmitReview($input: SubmitReviewInput!) {
  submitReview(input: $input) {
    sessionId
    cardId
    reviewedCards
    reviewState {
      id
      easeFactor
      intervalDays
      repetitions
      dueAt
      lastReviewedAt
    }
  }
}

mutation CompleteLesson($input: CompleteLessonInput!) {
  completeLesson(input: $input) {
    sessionId
    deckId
    totalCards
    reviewedCards
    knownCount
    dontKnowCount
    completedAt
  }
}

query DeckLearningStats($deckId: ID!) {
  deckLearningStats(deckId: $deckId) {
    deckId
    totalCards
    newCards
    dueCards
    reviewedCards
    nextDueAt
  }
}
```

## Security Requirements

```txt
- Do not request another user's review state.
- Do not request deleted cards.
- Do not request internal backend fields.
```

## Acceptance Criteria

```txt
- Lesson GraphQL document exists.
- StartLesson operation exists.
- SubmitReview operation exists.
- CompleteLesson operation exists.
- DeckLearningStats operation exists.
- Only safe fields are requested.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(frontend-lessons): add lesson GraphQL documents
```

---

# TASK-16.02 Generate lesson GraphQL types

## Status

TODO

## Context

Frontend should use generated GraphQL types and hooks.

## Goal

Run codegen for lesson operations.

## Files to Modify

```txt
apps/mobile/src/graphql/generated/index.ts
```

## Requirements

Run backend locally if schema is loaded from local GraphQL endpoint.

Then run:

```bash
pnpm --filter @flashcards/mobile codegen
```

Generated output should include hooks/types for:

```txt
StartLesson
SubmitReview
CompleteLesson
DeckLearningStats
```

## Do Not Do

```txt
- Do not manually edit generated file.
- Do not commit generated file if repository convention excludes generated files.
```

## Acceptance Criteria

```txt
- Lesson generated types exist or codegen successfully runs.
- Mobile typecheck passes.
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
chore(frontend-lessons): generate lesson GraphQL types
```

---

# TASK-16.03 Add lessons feature structure

## Status

TODO

## Context

Lesson frontend code should be isolated in a feature folder.

## Goal

Create lesson feature folder structure.

## Files to Create

```txt
apps/mobile/src/features/lessons/components/.gitkeep
apps/mobile/src/features/lessons/hooks/.gitkeep
apps/mobile/src/features/lessons/screens/.gitkeep
apps/mobile/src/features/lessons/graphql/.gitkeep
apps/mobile/src/features/lessons/types/.gitkeep
apps/mobile/src/features/lessons/index.ts
```

## Requirements

Create index exports:

```ts
export * from './components'
export * from './hooks'
export * from './types'
```

Create index files as needed:

```txt
apps/mobile/src/features/lessons/components/index.ts
apps/mobile/src/features/lessons/hooks/index.ts
apps/mobile/src/features/lessons/types/index.ts
```

## Architecture Constraints

```txt
- Lesson feature code lives in src/features/lessons.
- Generic UI remains in src/ui.
- Do not put SRS algorithm in this feature.
- Do not duplicate backend lesson selection logic.
```

## Acceptance Criteria

```txt
- Lesson feature structure exists.
- Exports exist.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(frontend-lessons): add lessons feature structure
```

---

# TASK-16.04 Add deck learning stats component

## Status

TODO

## Context

Deck detail should show learning stats before starting a lesson.

## Goal

Add reusable deck learning stats component.

## Files to Create

```txt
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
```

## Requirements

Component should:

```txt
- accept deckId
- call DeckLearningStats query
- show total cards
- show new cards
- show due cards
- show reviewed cards
- show nextDueAt if available
- show loading state
- show error state
```

Display labels:

```txt
Total cards
New
Due
Reviewed
Next review
```

## Security Requirements

```txt
- Query uses current authenticated user.
- Backend enforces deck visibility.
```

## Acceptance Criteria

```txt
- DeckLearningStatsCard exists.
- Stats render for viewable deck.
- Loading/error states exist.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): add deck learning stats component
```

---

# TASK-16.05 Add lesson start route

## Status

TODO

## Context

Users need a route that starts a lesson for a selected deck.

## Goal

Add lesson start screen.

## Files to Create

```txt
apps/mobile/app/lessons/start.tsx
apps/mobile/src/features/lessons/screens/start-lesson-screen.tsx
```

## Requirements

Screen should:

```txt
1. Read deckId from route query params.
2. If deckId is missing, show error state.
3. Call StartLesson mutation.
4. If sessionId is null and cards is empty, show empty lesson state.
5. If sessionId exists, store lesson payload in local route/session state.
6. Navigate to /lessons/[sessionId]?deckId=<deckId>.
```

Empty lesson state should say:

```txt
No cards are ready for review right now.
```

Optional action:

```txt
Back to deck
```

## Important Rule

StartLesson backend creates the session and selects cards.

Frontend must not select cards itself.

## Security Requirements

```txt
- Do not start lesson without auth.
- Backend enforces deck visibility.
```

## Acceptance Criteria

```txt
- Lesson start route exists.
- Missing deckId is handled.
- StartLesson mutation is used.
- Empty lesson state works.
- Successful start navigates to lesson review route.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): add lesson start route
```

---

# TASK-16.06 Add lesson state model

## Status

TODO

## Context

After StartLesson, frontend needs to track the currently selected cards and local review progress.

This is UI state only.

Backend remains the source of truth for review state.

## Goal

Add lesson state model/hooks.

## Files to Create

```txt
apps/mobile/src/features/lessons/types/lesson-card.ts
apps/mobile/src/features/lessons/types/active-lesson.ts
apps/mobile/src/features/lessons/hooks/use-active-lesson.ts
```

## Requirements

Create UI types:

```ts
export type LessonCard = {
  cardId: string
  front: string
  back: string
  example?: string | null
  notes?: string | null
  position: number
}

export type ActiveLesson = {
  sessionId: string
  deckId: string
  cards: LessonCard[]
  currentIndex: number
  reviewedCardIds: string[]
}
```

Hook should support:

```txt
- get current card
- move to next card
- mark card reviewed locally after successful SubmitReview response
- calculate UI progress from backend-selected cards
```

## Important Rule

Local state may track UI progress only.

Local state must not calculate:

```txt
- easeFactor
- intervalDays
- repetitions
- dueAt
- next review scheduling
```

## Acceptance Criteria

```txt
- Lesson UI types exist.
- useActiveLesson hook exists.
- Hook tracks current card and progress.
- Hook does not calculate SRS.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
chore(frontend-lessons): add active lesson state model
```

---

# TASK-16.07 Add lesson review screen

## Status

TODO

## Context

Users need a screen to review cards in an active lesson.

## Goal

Implement lesson review screen.

## Files to Create

```txt
apps/mobile/app/lessons/[sessionId].tsx
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
```

## Requirements

Screen should:

```txt
- read sessionId from route params
- load active lesson state from navigation/store
- show current card
- show progress
- show answer buttons
- handle missing lesson state gracefully
```

If lesson state is missing:

```txt
- show error state
- provide action to go back to deck or decks list
```

Recommended fallback:

```txt
Lesson state was lost. Please start the lesson again.
```

## Important Rule

Do not fetch arbitrary session cards from frontend unless backend exposes a safe operation for that.

MVP can keep lesson cards from StartLesson payload in local state.

## Security Requirements

```txt
- SubmitReview backend validates session ownership.
- Frontend must not trust route params alone.
```

## Acceptance Criteria

```txt
- Lesson review route exists.
- Current card renders.
- Missing state is handled.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): add lesson review screen
```

---

# TASK-16.08 Add flashcard review component

## Status

TODO

## Context

Lesson review needs a reusable flashcard UI.

## Goal

Add flashcard review component.

## Files to Create

```txt
apps/mobile/src/features/lessons/components/review-flashcard.tsx
```

## Requirements

Component should show:

```txt
- front side first
- reveal answer action
- back side after reveal
- example if available
- notes if available
```

Props:

```ts
export type ReviewFlashcardProps = {
  front: string
  back: string
  example?: string | null
  notes?: string | null
  isRevealed: boolean
  onReveal: () => void
}
```

UX:

```txt
- large readable text
- clear reveal button
- keyboard/mouse friendly on web where practical
- touch friendly on mobile
```

## Important Rule

This component is display-only.

It must not submit reviews or calculate SRS.

## Acceptance Criteria

```txt
- ReviewFlashcard component exists.
- Front side displays before reveal.
- Back/example/notes display after reveal.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): add review flashcard component
```

---

# TASK-16.09 Add review answer actions

## Status

TODO

## Context

Users answer each card with KNOW or DONT_KNOW.

Frontend sends answer only.

## Goal

Add answer actions and SubmitReview integration.

## Files to Create

```txt
apps/mobile/src/features/lessons/components/review-answer-actions.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/hooks/use-active-lesson.ts
```

## Requirements

Answer buttons:

```txt
DONT_KNOW
KNOW
```

Button labels:

```txt
Don't know
Know
```

Submit behavior:

```txt
1. User reveals answer.
2. User taps Know or Don't know.
3. Call SubmitReview mutation with sessionId, cardId, answer.
4. Wait for backend success.
5. Mark card reviewed in local UI state.
6. Move to next card.
7. If no cards remain, navigate to summary flow.
```

Input must be:

```txt
answer = KNOW or DONT_KNOW
```

Frontend must not send:

```txt
quality
easeFactor
intervalDays
repetitions
dueAt
```

## Security Requirements

```txt
- Backend validates session ownership.
- Do not allow double-submit while mutation is loading.
```

## Acceptance Criteria

```txt
- Answer buttons exist.
- SubmitReview mutation is used.
- Frontend sends only KNOW/DONT_KNOW.
- Double submit is prevented.
- Successful review advances to next card.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): add review answer actions
```

---

# TASK-16.10 Add lesson progress UI

## Status

TODO

## Context

Users need to see progress through the lesson.

## Goal

Add lesson progress UI.

## Files to Create

```txt
apps/mobile/src/features/lessons/components/lesson-progress.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
```

## Requirements

Progress UI should show:

```txt
- current card number
- total cards
- reviewed cards
- simple progress bar
```

Example:

```txt
Card 3 of 20
Reviewed 2 / 20
```

Progress should be based on:

```txt
- cards returned from StartLesson
- successful SubmitReview responses
```

## Important Rule

Progress UI must not infer backend completion or SRS state.

## Acceptance Criteria

```txt
- LessonProgress component exists.
- Lesson review screen uses it.
- Progress updates after successful reviews.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): add lesson progress UI
```

---

# TASK-16.11 Add lesson completion flow

## Status

TODO

## Context

After reviewing cards, user should complete the lesson and see summary.

## Goal

Add lesson completion screen and flow.

## Files to Create

```txt
apps/mobile/app/lessons/[sessionId]/summary.tsx
apps/mobile/src/features/lessons/screens/lesson-summary-screen.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
```

## Requirements

When all cards are reviewed:

```txt
1. Call CompleteLesson mutation.
2. Navigate to summary screen.
3. Show summary result.
```

Summary screen should show:

```txt
- total cards
- reviewed cards
- known count
- don't know count
- completedAt
```

Actions:

```txt
- Back to deck
- Start another lesson
- Back to decks
```

If completion fails:

```txt
- show error state
- allow retry
```

## MVP Rule

Backend allows completing early.

Optional UI action:

```txt
Finish lesson now
```

If added, it should call CompleteLesson before all cards are reviewed.

## Security Requirements

```txt
- Backend validates session ownership.
- Frontend must not fabricate summary values.
- Summary must come from CompleteLesson response.
```

## Acceptance Criteria

```txt
- CompleteLesson mutation is used.
- Summary screen exists.
- Summary uses backend response.
- Finish flow works after last card.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): add lesson completion flow
```

---

# TASK-16.12 Integrate lessons into deck detail

## Status

TODO

## Context

Users should start lessons from deck detail.

## Goal

Add lesson entry points to deck detail screen.

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
```

## Requirements

Deck detail should show:

```txt
- DeckLearningStatsCard
- Start lesson button
```

Start lesson button should navigate to:

```txt
/lessons/start?deckId=<deckId>
```

Button state:

```txt
- enabled if deck has cards
- disabled or helpful message if totalCards = 0
```

## Security Requirements

```txt
- Backend validates whether current user can study deck.
- Frontend visibility is UX only.
```

## Acceptance Criteria

```txt
- Deck detail shows learning stats.
- Deck detail has start lesson button.
- Start lesson navigation works.
- Empty deck state is handled.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
feat(frontend-lessons): integrate lessons into deck detail
```

---

# TASK-16.13 Add frontend lesson final checks

## Status

TODO

## Context

Lesson flow is core product UX and must not duplicate backend SRS logic.

## Goal

Run final checks for frontend lessons.

## Manual Checks

Verify:

```txt
- Deck detail shows learning stats.
- Start lesson works from deck detail.
- Empty lesson state works.
- Review card front displays first.
- Reveal answer works.
- Know submits KNOW.
- Don't know submits DONT_KNOW.
- Frontend does not send quality.
- Frontend does not send easeFactor.
- Frontend does not send intervalDays.
- Frontend does not send dueAt.
- Progress updates after successful review.
- Double submit is prevented.
- Lesson completes after final card.
- Summary screen shows backend summary.
- Back to deck works.
- Start another lesson works.
```

## Security Checks

Verify:

```txt
- Frontend does not calculate SM-2.
- Frontend does not calculate due dates.
- Frontend does not select due/new cards.
- Frontend does not store auth tokens in localStorage/sessionStorage.
- Frontend does not include backend secrets.
```

Suggested checks:

```bash
grep -R "easeFactor\|intervalDays\|repetitions\|dueAt" apps/mobile/src/features/lessons || true
grep -R "localStorage" apps/mobile || true
grep -R "sessionStorage" apps/mobile || true
grep -R "JWT_ACCESS_SECRET\|JWT_REFRESH_SECRET\|DATABASE_URL\|AI_API_KEY\|INTERNAL_JOB_SECRET" apps/mobile || true
```

If SRS field names appear because they are rendered from backend response, verify they are not used for calculation.

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm --filter @flashcards/mobile web
pnpm format:check
pnpm lint
```

## Do Not Do

```txt
- Do not move to public/CSV/AI frontend until lesson checks pass.
- Do not implement SM-2 in frontend.
- Do not calculate review schedule in frontend.
```

## Acceptance Criteria

```txt
- Deck learning stats work.
- Start lesson works.
- Review flow works.
- SubmitReview works.
- CompleteLesson works.
- Summary works.
- Frontend sends only KNOW/DONT_KNOW as review answer.
- Frontend does not calculate SRS.
- Typecheck passes.
- Format check passes.
- Lint passes.
- No frontend secrets are present.
- git status is clean after commit.
```

## Expected Commit Message

```txt
chore(frontend-lessons): finalize lesson flow
```

---

## Epic Completion Criteria

EPIC-16 is complete when:

```txt
- Lesson GraphQL documents exist.
- Lesson generated types exist.
- Lessons feature structure exists.
- DeckLearningStatsCard exists.
- Lesson start route works.
- Active lesson UI state exists.
- Lesson review screen works.
- ReviewFlashcard component works.
- Review answer actions work.
- SubmitReview mutation sends only KNOW/DONT_KNOW.
- Lesson progress UI works.
- CompleteLesson mutation works.
- Lesson summary screen works.
- Deck detail has learning stats.
- Deck detail has start lesson action.
- Frontend does not calculate SM-2.
- implementation follows docs/domain/lesson-flow.md.
- implementation follows docs/security/security-checklist.md.
```

After this epic is complete, move to:

```txt
docs/tasks/17-frontend-public-csv-ai.md
```

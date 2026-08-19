# EPIC-29 Lesson Queue

## Epic Goal

Replace the shared `lessonSize` cap for both Home and Deck lessons with two queue modes: a fixed unique-card snapshot on Home, and a live ready-card queue on owned decks, with bounded repeats and no in-lesson progress UI.

This epic covers:

```txt
- Live SoT update for lesson flow (docs/domain/lesson-flow.md + related architecture/permissions)
- Pure next-card picker (gap, max 3 shows, primary vs repeat)
- Persist Home snapshot + per-session queue state
- StartLesson: own deck only, live due queue, no lessonSize stop
- StartHomeLesson: lessonSize unique due cards as a frozen snapshot
- SubmitReview: picker-driven nextCard; skip deleted / inaccessible cards
- Hide Start when dueCount = 0; hide Deck Start for non-owners
- Remove in-lesson progress UI
- Call abandonLesson when the user leaves an unfinished lesson
- Smoke checklist
```

This epic does **not** include:

```txt
- Countdown / waiting for future dueAt
- In-lesson remaining counters (new / due / repeats)
- Showing a new ready-count UI on Home or deck (dueCount may stay as today for enabling Start)
- Changing learning-steps intervals or promptDirection
- Resume of an abandoned or crashed session
- Studying public/group decks without copying
- Changing UserSettings.lessonSize field or settings UI (Home still reads it)
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/26-learning-steps.md
docs/tasks/done/27-learning-steps-bugfixes.md
docs/smoke/learning-steps.md
```

## Epic Prerequisites

EPIC-28 should be complete.

Expected state:

```txt
- Learning steps are the review model (@flashcards/srs)
- StartLesson uses canViewDeck (public/group view is enough today — this epic tightens to owner)
- StartLesson and StartHomeLesson cap selection with lessonSize
- SubmitReview returns nextCard while reviewedCards < lessonSize
- Home already hides START when dueCount = 0
- Deck detail Start is shown to non-owners if the deck has cards
- Leave-lesson on mobile clears local state and does not call abandonLesson
- Local stack: Postgres + API (:3000) + mobile
```

## Agreed Decisions (Source of Truth)

`docs/domain/lesson-flow.md` is the live SoT. This section is the decision record used to write that document.

### Ready

```txt
Ready = dueAt <= now, card not deleted, deck not deleted.
```

### Home

```txt
- lessonSize comes from UserSettings (5–100, default 20). No extra field on the start screen.
- On start, take a snapshot of up to lessonSize unique ready cards from own decks
  where targetLanguage = activeTargetLanguage.
- If more ready cards exist, take the oldest:
  dueAt ASC, then card.createdAt ASC, then cardId ASC.
- Snapshot is frozen: cardIds that become due later and are not in the snapshot never join.
- Cards in the snapshot may repeat in this session if they become ready again.
- If ready = 0 at start: do not create a session; hide the Start button.
```

### Deck

```txt
- No lessonSize cap. StudySession.lessonSize may be stored as 0 (unused).
- Live queue of the owned deck: newly ready cards of this deck may join during the session.
- Only the deck owner may start a lesson. Public/group decks must be copied first.
- If ready = 0 at start: do not create a session; hide the Start button.
```

### Primary vs repeat

```txt
- Primary = first showing of a cardId in this session (showCount = 0).
- Repeat = 2nd or 3rd showing of that cardId.
- Max 3 showings per cardId per session. After that the card is excluded even if due.
```

### Next primary order

```txt
When no showable repeat exists, pick the next primary:
dueAt ASC, then card.createdAt ASC, then cardId ASC.
Same order for Home (among unshown snapshot members that are ready) and Deck.
```

### Repeat gap

```txt
After answering card A, freeze
  N = min(3, count of other cards that are currently ready AND still showable in this session).
N is a target for that pending repeat.

Gap counts every showing of another card (a repeat of B counts as +1 for A).

If N cannot be reached because no other ready/showable cards exist, shrink the remaining gap
to what is actually possible (including 0). Then A may show immediately if it is ready.

When a pending repeat’s gap is satisfied (or shrunk) and the card is ready and showCount < 3,
that repeat beats the next primary.

If several showable repeats exist: dueAt ASC, then cardId ASC.
Do not wait for a future dueAt.
```

### Skip

```txt
- Deleted or no access: drop that cardId from this session forever.
  Home does not replace it with a card outside the snapshot.
- Temporarily not ready (dueAt > now): keep the card in the session; it may become showable later
  under the usual rules.
```

### End of lesson

```txt
- Nothing showable now (no ready primary and no showable repeat) → COMPLETED + summary.
- Summary know / dontKnow = number of answers (attempts), not unique cards.
- User leaves while cards remain → ABANDONED, no summary, reviews already saved, no resume.
- Next Start always creates a new session (Home: new snapshot; Deck: new live flow).
- Starting a lesson abandons any leftover ACTIVE session for that user (as today).
```

### UI

```txt
- No progress / remaining counters inside the lesson screen.
- Do not add a new ready-count UI. Keep To learn / Practiced / Learned as today.
- Hide Start when dueCount = 0 (Home already does this).
- Hide Deck Start for non-owners.
```

### Backend vs frontend

```txt
- Backend is source of truth for nextCard, snapshot, and queue state.
- Frontend must not compute gap, show limits, or dueAt.
- Learning-steps and promptDirection stay in @flashcards/srs unchanged.
- Queue picker lives in lessons domain (pure TypeScript), not in packages/srs.
```

### Persistence

```txt
StudySession gains:
- snapshotCardIds String[]  (Home: frozen ids; Deck: empty)
- queueState Json           (showCounts + pendingRepeats)

Do not keep @@unique([sessionId, cardId]) on StudySessionReview (already dropped).
```

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not refactor unrelated code.
4. Follow Agreed Decisions; after 29.01 follow docs/domain/lesson-flow.md.
5. Backend is source of truth for the queue; frontend must not calculate it.
6. Do not change learning-steps formulas or promptDirection rules.
7. Do not weaken auth, permissions, or the security checklist.
8. Deck lessons require ownership. Do not allow public/group originals.
9. Do not add wait/countdown UI.
10. Do not show in-lesson progress.
11. Translate any new user-facing strings (en/uk) in the task that adds them.
12. Each task’s Commands to Run must pass before commit. If blocked, stop and ask.
```

## Recommended Task Order

```txt
29.01                            live SoT docs
29.02                            pure picker + tests
29.03 → 29.04                    Prisma + repository
29.05 → 29.06 → 29.07            start deck, start home, submitReview
29.08 → 29.09 → 29.10            mobile progress, Start visibility, abandon on leave
29.11                            smoke
```

## Epic Summary

```md
- [x] TASK-29.01 Update live lesson-flow source of truth
- [x] TASK-29.02 Add lesson-queue picker and unit tests
- [x] TASK-29.03 Add StudySession snapshot and queueState columns
- [x] TASK-29.04 Persist snapshot and queueState in the lessons repository
- [x] TASK-29.05 Update StartLessonUseCase for owner-only live deck queue
- [x] TASK-29.06 Update StartHomeLessonUseCase for unique-card snapshot
- [x] TASK-29.07 Update SubmitReviewUseCase to use the lesson-queue picker
- [x] TASK-29.08 Remove in-lesson progress UI
- [x] TASK-29.09 Hide Start when no due cards and for non-owned decks
- [ ] TASK-29.10 Call abandonLesson when leaving an unfinished lesson
- [ ] TASK-29.11 Add lesson-queue smoke checks
```

---

# TASK-29.01 Update live lesson-flow source of truth

## Status

DONE

## Context

Lesson queue rules were agreed in chat. Live docs still describe a shared lessonSize cap and view-based deck lessons.

## Goal

Rewrite live SoT so agents implement the new queue, not EPIC-26 lessonSize re-queue.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/tasks/README.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
```

## Requirements

```txt
1. Replace current lessonSize-for-both-scopes rules with Agreed Decisions from this epic.
2. State Home snapshot vs Deck live queue, gap/repeats, owner-only deck lessons, abandon vs complete.
3. Keep learning-steps.md as the scheduling SoT; do not copy SM-2 back in.
4. Do not rewrite docs/tasks/done/*.
5. permissions.md must say start-lesson requires deck ownership (already closer than the API).
```

## Security Requirements

```txt
- Docs-only. Do not weaken permissions.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- This task is documentation only.
```

## Implementation Notes

```txt
- Copy Agreed Decisions into lesson-flow.md in product language.
- architecture.md section 14 and clean-arch lesson/queue bullets must match.
```

## Acceptance Criteria

```txt
- A reader of live SoT cannot conclude that lessonSize stops a deck lesson.
- Home snapshot and Deck live queue are explicit.
- pnpm docs:lint and pnpm format:check pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change application code.
- Do not implement the picker yet.
```

## Expected Commit Message

```txt
TASK-29.01 Update live lesson-flow source of truth
```

---

# TASK-29.02 Add lesson-queue picker and unit tests

## Status

DONE

## Context

Next-card choice has gap, max-3, primary vs repeat, and Home vs Deck membership. It must be pure and tested before use cases call it.

## Goal

Add a framework-free picker in the lessons domain with table-driven tests.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/src/modules/lessons/domain/services/select-next-lesson-card.ts
apps/api/src/modules/lessons/domain/services/select-next-lesson-card.spec.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/domain/types/index.ts (export new types if needed)
```

## Requirements

```txt
1. Export types for queue state, candidates, and picker result (next cardId or null).
2. Export selectNextLessonCard and a function that updates queue state after a showing
   (freeze N, increment other cards’ filled gap, bump showCount).
3. Home: only snapshotCardIds may be selected.
4. Deck: any candidate in the provided ready set may be selected (caller scopes to the deck).
5. Exclude showCount >= 3.
6. Showable repeat (gap done or shrunk, ready, showCount 1..2) beats primary.
7. Multiple showable repeats: dueAt ASC, cardId ASC.
8. Next primary: dueAt ASC, createdAt ASC, cardId ASC.
9. Shrink remaining gap to 0 when no other ready/showable candidates exist.
10. No Date.now(), no Nest/Prisma/GraphQL imports.
11. Tests cover: Home snapshot exclusion, Deck new primary joining, max 3, gap of 3,
    gap shrink to 0, repeat priority, tie-break, empty result.
```

## Security Requirements

```txt
- No secrets or PII in the picker.
```

## Architecture Constraints

```txt
- Domain must not import NestJS, Prisma, or GraphQL.
- Do not put this logic in GraphQL resolvers or packages/srs.
```

## Implementation Notes

```txt
- Caller supplies the ready candidate list; the picker does not query the database.
- Deleted cards are omitted from candidates by the caller (drop forever).
```

## Acceptance Criteria

```txt
- Picker tests pass.
- API unit test run includes the new spec.
- pnpm --filter @flashcards/api build passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- select-next-lesson-card
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change Prisma or use cases in this task.
- Do not change frontend.
```

## Expected Commit Message

```txt
TASK-29.02 Add lesson-queue picker and unit tests
```

---

# TASK-29.03 Add StudySession snapshot and queueState columns

## Status

DONE

## Context

Home snapshot and frozen gap N must survive across submitReview calls.

## Goal

Add Prisma fields on StudySession without changing use cases yet.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/prisma/migrations/<timestamp>_lesson_queue_state/migration.sql
```

## Files to Modify

```txt
apps/api/prisma/schema.prisma
```

## Requirements

```txt
1. StudySession.snapshotCardIds String[] @default([])
2. StudySession.queueState Json?
3. Existing rows: empty snapshot, null or empty queueState.
4. Do not drop lessonSize; Deck will store 0 later.
```

## Security Requirements

```txt
- Do not commit .env or database URLs.
- Do not run migrate reset.
```

## Architecture Constraints

```txt
- Schema only. No resolver/Prisma access from presentation.
```

## Implementation Notes

```txt
- Use prisma migrate.
```

## Acceptance Criteria

```txt
- prisma validate and generate succeed.
- API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not wire use cases yet.
- Do not rewrite unrelated models.
```

## Expected Commit Message

```txt
TASK-29.03 Add StudySession snapshot and queueState columns
```

---

# TASK-29.04 Persist snapshot and queueState in the lessons repository

## Status

DONE

## Context

Ports still create sessions with only lessonSize. Due queries order only by dueAt.

## Goal

Map new columns through domain types and repository; order due cards by dueAt, createdAt, cardId.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/domain/types/study-session.type.ts
apps/api/src/modules/lessons/application/ports/study-session-repository.port.ts
apps/api/src/modules/lessons/application/ports/card-review-state-repository.port.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session.mapper.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session.mapper.spec.ts
apps/api/src/modules/lessons/infrastructure/persistence/prisma-study-session.repository.ts
apps/api/src/modules/lessons/infrastructure/persistence/prisma-card-review-state.repository.ts
```

## Requirements

```txt
1. Domain StudySession includes snapshotCardIds and queueState.
2. create/update can persist both fields.
3. findDueCardIdsForDeck and findDueCardIdsForOwnDecksWithTargetLanguage order by
   dueAt ASC, card.createdAt ASC, cardId ASC.
4. Add a way to load due candidates with dueAt + createdAt for the picker (not only ids)
   if the current id-only query is insufficient.
5. Mapper tests cover the new fields.
```

## Security Requirements

```txt
- Do not expose queueState through GraphQL in this task.
```

## Architecture Constraints

```txt
- Use cases still not switched (compile with defaults: empty snapshot).
- Prisma stays in infrastructure.
```

## Implementation Notes

```txt
- Keep existing create() working: default snapshotCardIds = [], queueState = null.
- Update mapper specs; fix compile errors in create() call sites with defaults.
```

## Acceptance Criteria

```txt
- Mapper tests pass.
- API builds.
- Due queries use the three-key order.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- study-session.mapper
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change GraphQL schema.
- Do not change picker rules.
```

## Expected Commit Message

```txt
TASK-29.04 Persist snapshot and queueState in the lessons repository
```

---

# TASK-29.05 Update StartLessonUseCase for owner-only live deck queue

## Status

DONE

## Context

StartLesson currently allows any viewer and caps the session with lessonSize.

## Goal

Owner-only live deck start: all currently ready cards eligible; persist empty snapshot; lessonSize 0.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
```

## Requirements

```txt
1. Reject unless the user owns the deck (use manage/owner check, not canViewDeck).
   Return DECK_NOT_FOUND for non-owners (do not leak private decks).
2. Ignore input.lessonSize for stopping the queue; persist lessonSize = 0.
3. snapshotCardIds = [].
4. Initialize queueState for the first card showing.
5. If no ready cards: return sessionId null, do not create a session (same payload shape as today).
6. Abandon leftover ACTIVE sessions, then create DECK session.
7. First card from the picker; still return a cards array with at least the first card
   (keep current GraphQL start payload: cards[]).
8. Tests: owner ok, non-owner forbidden, group/public viewer forbidden, empty due, first card order.
```

## Security Requirements

```txt
- Authenticated user required.
- Blocked users rejected.
- Backend enforces ownership. Frontend hiding is not security.
```

## Architecture Constraints

```txt
- Resolver still only calls the use case.
- Use case must not import Prisma or GraphQL.
```

## Implementation Notes

```txt
- Remove DeckGroupShare lookup from this use case if it exists only for view access.
- Returning multiple cards on start is optional; at least the first showable card is required.
  Prefer returning only the first card to avoid a stale client queue; follow existing payload
  if GraphQL clients expect cards.length for bootstrap — then return [firstCard] only.
```

## Acceptance Criteria

```txt
- Non-owner cannot start.
- Owner with due cards gets an ACTIVE session and first card.
- Owner with zero due gets sessionId null.
- Specs pass; API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- start-lesson.use-case
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change StartHomeLesson in this task.
- Do not change mobile.
```

## Expected Commit Message

```txt
TASK-29.05 Update StartLessonUseCase for owner-only live deck queue
```

---

# TASK-29.06 Update StartHomeLessonUseCase for unique-card snapshot

## Status

DONE

## Context

Home currently takes up to lessonSize due cards but SubmitReview can pull other due cardIds later.

## Goal

Freeze unique snapshot of size lessonSize (from settings) and only serve those cardIds.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
```

## Requirements

```txt
1. lessonSize from UserSettings (5–100, default 20). No start-screen override required.
2. Select unique ready own-deck cards for activeTargetLanguage, order dueAt/createdAt/cardId,
   take up to lessonSize, store as snapshotCardIds.
3. Persist queueState; return first picker card as cards[0].
4. Zero ready → sessionId null, no session.
5. Tests: snapshot length, order, empty, does not include other users’ decks.
```

## Security Requirements

```txt
- Authenticated user required.
- Blocked users rejected.
- Own decks only.
```

## Architecture Constraints

```txt
- Use case must not import Prisma or GraphQL.
```

## Implementation Notes

```txt
- Keep GraphQL startHomeLesson payload shape.
```

## Acceptance Criteria

```txt
- Snapshot is stored and used as membership.
- Specs pass; API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- start-home-lesson.use-case
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change SubmitReview yet (Home start may still look like old nextCard until 29.07).
```

## Expected Commit Message

```txt
TASK-29.06 Update StartHomeLessonUseCase for unique-card snapshot
```

---

# TASK-29.07 Update SubmitReviewUseCase to use the lesson-queue picker

## Status

DONE

## Context

SubmitReview still stops at reviewedCards < lessonSize and re-queries any due card in scope.

## Goal

Apply learning-steps as today, then pick nextCard via the domain picker and persisted queueState.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
```

## Requirements

```txt
1. Keep calculateNextLearningState from @flashcards/srs.
2. After saving the review, update queueState (showCount, freeze N, fill gaps).
3. Load ready candidates for the scope (Deck: that deck; Home: snapshot ∩ ready own cards).
4. Omit deleted / inaccessible cardIds permanently from this session.
5. nextCard = picker result (null if nothing showable now). Do not use lessonSize as a stop.
6. Home must never return a cardId outside snapshotCardIds.
7. Tests: Home snapshot isolation, Deck live join, max 3, gap shrink, nextCard null ends the
   client flow, multiple reviews of the same cardId allowed.
```

## Security Requirements

```txt
- Session must belong to the current user and be ACTIVE.
- Blocked users rejected.
- Do not leak other users’ cards.
```

## Architecture Constraints

```txt
- Use case must not import Prisma or GraphQL.
- Resolver unchanged except existing nextCard field.
```

## Implementation Notes

```txt
- Frontend still calls completeLesson when nextCard is null.
- Do not auto-complete inside submitReview unless tests prove it is required; prefer current
  completeLesson mutation.
```

## Acceptance Criteria

```txt
- lessonSize no longer cuts Home/Deck nextCard.
- Specs pass; API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- submit-review.use-case
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change learning-steps formulas.
- Do not add GraphQL queueState fields.
```

## Expected Commit Message

```txt
TASK-29.07 Update SubmitReviewUseCase to use the lesson-queue picker
```

---

# TASK-29.08 Remove in-lesson progress UI

## Status

DONE

## Context

Lesson review shows a progress bar based on lessonSize / totalCards. Product wants no in-lesson progress.

## Goal

Remove LessonProgress from the review screen.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/components/index.ts
```

## Requirements

```txt
1. Do not render LessonProgress on the review screen.
2. Keep Know / Don't know, reveal, nextCard, summary navigation.
3. Leave the LessonProgress component file in place unless nothing imports it; then delete it.
```

## Security Requirements

```txt
- Do not store auth tokens in localStorage or sessionStorage.
```

## Architecture Constraints

```txt
- Use Apollo generated hooks already on the screen.
- Do not compute dueAt or gap on the client.
```

## Implementation Notes

```txt
- totalCards in Zustand may remain unused; do not refactor the store unless required to compile.
```

## Acceptance Criteria

```txt
- Review screen has no progress bar or “card X of Y”.
- Mobile typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add remaining new/due/repeat counters.
- Do not change summary screen counts (already attempts via completeLesson).
```

## Expected Commit Message

```txt
TASK-29.08 Remove in-lesson progress UI
```

---

# TASK-29.09 Hide Start when no due cards and for non-owned decks

## Status

DONE

## Context

Home already hides START when dueCount = 0. Deck detail still shows Start for any viewer with cards.

## Goal

Deck Start only for owners when dueCount > 0.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
```

## Requirements

```txt
1. Show Deck Start only if isOwner and deckLearningStats.dueCount > 0.
2. Do not add a new ready-count label.
3. Keep Home START hiding when dueCount = 0 (verify; change only if broken).
4. Non-owner public/group deck: no Start (copy remains the study path).
```

## Security Requirements

```txt
- Frontend hide is UX only; backend owner check from 29.05 is security.
```

## Architecture Constraints

```txt
- Use existing deckLearningStats / dueCount query.
```

## Implementation Notes

```txt
- DeckLearningStatsCard already loads dueCount; reuse rather than a new query if possible.
```

## Acceptance Criteria

```txt
- Owner with due cards sees Start.
- Owner with zero due does not.
- Non-owner does not.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not remove To learn / Practiced / Learned counters.
```

## Expected Commit Message

```txt
TASK-29.09 Hide Start when no due cards and for non-owned decks
```

---

# TASK-29.10 Call abandonLesson when leaving an unfinished lesson

## Status

TODO

## Context

Leaving the review screen only clears Zustand. The session stays ACTIVE until the next Start.

## Goal

Call abandonLesson on confirmed leave so the session is ABANDONED immediately.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/domain/auth-token-strategy.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/graphql/lessons.graphql
```

## Requirements

```txt
1. On confirmed leave, call abandonLesson then clear local lesson state.
2. Do not show summary.
3. If abandon fails, still clear local state and leave (same idea as logout: local session ends).
4. Add the GraphQL operation if missing; run codegen.
```

## Security Requirements

```txt
- Send access token via existing Apollo auth link.
- Do not log tokens.
```

## Architecture Constraints

```txt
- Use generated Apollo hooks.
```

## Implementation Notes

```txt
- Keep the existing leave confirmation dialog.
```

## Acceptance Criteria

```txt
- Leave triggers abandonLesson.
- No summary route on leave.
- Typecheck passes.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not implement resume.
```

## Expected Commit Message

```txt
TASK-29.10 Call abandonLesson when leaving an unfinished lesson
```

---

# TASK-29.11 Add lesson-queue smoke checks

## Status

TODO

## Context

Queue rules are easy to regress in manual QA.

## Goal

Add a smoke checklist and a section in MVP smoke tests.

## Related Documents

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/smoke/learning-steps.md
```

## Files to Create

```txt
docs/smoke/lesson-queue.md
```

## Files to Modify

```txt
docs/release/mvp-smoke-tests.md
docs/tasks/29-lesson-queue.md
```

## Requirements

```txt
1. Checklist: Home snapshot cap, Deck live join, max 3 shows, gap shrink, owner-only start,
   hide Start when due=0, leave abandons, summary counts attempts, no in-lesson progress.
2. Link it from mvp-smoke-tests.md (new section).
3. Mark this epic task DONE in the Epic Summary when checks are written.
4. Automated note: picker + use case tests from earlier tasks; manual UI still human QA.
```

## Security Requirements

```txt
- Do not put real passwords or secrets in the smoke doc.
```

## Architecture Constraints

```txt
- Docs only besides checking the epic checklist box.
```

## Implementation Notes

```txt
- Follow docs/smoke/learning-steps.md structure (short).
```

## Acceptance Criteria

```txt
- Smoke file exists and is linked.
- pnpm docs:lint and format:check pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None in this task (the checklist is the deliverable).
```

## Do Not Do

```txt
- Do not implement leftover product ideas (ready-count UI, countdown).
```

## Expected Commit Message

```txt
TASK-29.11 Add lesson-queue smoke checks
```

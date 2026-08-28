# EPIC-30 SoT Discrepancies

## Epic Goal

Fix mismatches between live sources of truth and the current implementation. Keep one standing bucket: when docs and code disagree, record the discrepancy here, then align docs and/or code in focused tasks.

This epic covers:

```txt
- a discrepancy register (append new entries as they are found)
- focused tasks to make live SoT unambiguous and to make code match that SoT
```

This epic does **not** include:

```txt
- new product features unrelated to a registered discrepancy
- general repository dead-code cleanup
- cosmetic refactoring
- silently making product decisions during implementation
- changing learning-steps intervals or promptDirection
```

New discrepancies found later should be appended here as new register entries and TASK-30.XX items (one discrepancy ≈ one or more focused tasks ≈ one commit each).

## Epic Status

DONE

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/29-lesson-queue.md
docs/smoke/lesson-queue.md
```

## Epic Prerequisites

EPIC-29 should be complete (lesson queue on main).

Expected state:

```txt
- Backend is SoT for lesson queue and SRS
- Queue picker lives in lessons domain (pure TypeScript)
- StudySession persists snapshotCardIds + queueState
- Local stack: Postgres + API (:3000) + mobile
```

## Known Discrepancies (backlog source)

```txt
1. Repeat gap frozen at display time vs SoT “after answering”
   - Fixed in TASK-30.01–30.03
2. Product says review session / Повторення; UI and live docs still said Lesson / Урок
   - Technical identifiers Lesson, StudySession, lessonSize stay in code
3. Summary showed Know / Don't know / % as attempts; product wants unique cards only
   - Fixed in TASK-30.06 (UI only; GraphQL completeLesson payload unchanged)
4. Own deck cards had no Start when due > 0 (only deck detail)
   - Fixed in TASK-30.07
5. Owner deck detail is a flat stack of equally weighted buttons
   - Fixed in TASK-30.08
6. Card rows show 0-based #, bulky Edit/Delete, flush to the scrollbar
   - Fixed in TASK-30.09
```

## Discrepancy Register

Decision records for this epic. Implementation tasks are below.

### Register statuses

```txt
OPEN       — documented, no decision yet
APPROVED   — decision approved; implementation task may proceed
DONE       — approved fix landed (docs and code match)
DEFERRED   — explicitly postponed with owner note
```

### DISC-001 Repeat gap frozen at display, not at answer

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.01–30.03):

```txt
SoT after TASK-30.01:
  - docs/domain/lesson-flow.md: display ≠ answer ≠ freeze N; N at answer time
  - docs/architecture.md and backend-clean-architecture.md match that timing

Implementation after TASK-30.03:
  - recordLessonCardAnswer in select-next-lesson-card.ts (answer event, not display)
  - Start persists empty showCounts; first card is display only
  - SubmitReview records the answered card, then returns nextCard without recording that display

Was wrong (before 30.03):
  - recordLessonCardShowing at Start (first card) and SubmitReview (nextCard)
```

---

### DISC-002 UI and live docs say Lesson / Урок

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.04):

```txt
Product:
  - Review session / Повторення
  - Completion title: "Review complete" / "Повторення завершено"

Was wrong:
  - UI en/uk: Lesson / Урок (start, leave, summary, settings lessonSize)
  - Live docs described a “lesson” as the product session name
```

Product decision (approved in chat):

```txt
User-facing: Повторення, not Урок.
Live docs: review session / repeat session as the product model.
Technical names in code (Lesson, StudySession, lessonSize, GraphQL) stay
if they do not change logic.

Queue “repeat” (2nd/3rd answer of the same cardId) is not the product name
of the session.
```

Action:

```txt
TASK-30.04 Use review session and Повторення in UI and live docs
```

Impact:

```txt
docs: lesson-flow.md, architecture.md, permissions.md, smoke, mvp-smoke-tests
frontend i18n: lessons, home, decks, settings (en/uk)
backend / Prisma / GraphQL identifiers: unchanged
```

Product decision (approved in chat):

```txt
Show, answer, and planning a repeat are separate.

1. Show A — user sees the card. No answer yet, no new dueAt.
   Do not increment showCount. Do not freeze gap N.
2. Answer Know / Don’t know.
3. Then apply learning-steps, persist new step/dueAt, increment showCount for A,
   freeze N = min(3, other currently ready AND showable cards) at answer time.

Example:
  Show A at 18:00 with only B ready.
  C due 18:00:20, D due 18:00:35.
  User answers A at 18:00:40.
  Others ready+showable: B, C, D → N = 3
  Sequence: A → B → C → D → A repeat.

Gap fill = a completed showing of another card (that other card was answered).
Display without an answer does not fill anyone’s gap.
```

Action:

```txt
TASK-30.01  make SoT wording unambiguous (display ≠ answer ≠ freeze N)
TASK-30.02  picker tests for answer-time freeze, including late-due C/D
TASK-30.03  Start + SubmitReview call record on the answered card, not on display
```

Impact:

```txt
docs: lesson-flow.md, architecture.md, backend-clean-architecture.md, smoke/lesson-queue.md
backend: picker tests; StartLesson, StartHomeLesson, SubmitReview
frontend / Prisma / GraphQL: none expected
```

---

### DISC-003 Review summary shows attempt stats, not unique cards

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.06):

```txt
Product (approved in chat during EPIC-29 QA):
  - Summary: title, Nice work, completedAt, “Cards in this review: N”
  - N = unique answered cardIds in this session
  - Do not show Reviewed, Know, Don't know, Known %

Was wrong:
  - UI showed cardsInLesson + reviewedCards + knownCount + dontKnowCount + %
  - Home completeLesson.totalCards equals reviewedCards (attempts)
  - Live SoT said Know / Don't know on the result screen are attempts
```

Product decision (approved in chat):

```txt
Hide attempt stats for now. Unique card count only.
Keep Start another review / Home / Back to deck as today.
Do not change CompleteLessonUseCase or GraphQL payload.
```

Action:

```txt
TASK-30.06 Show unique card count on review summary
```

Impact:

```txt
frontend: lesson summary screen, LessonCompletion uniqueCardCount
docs: lesson-flow.md, architecture.md, smoke/lesson-queue.md, mvp-smoke-tests
backend / Prisma / GraphQL: unchanged
```

---

### DISC-004 Own deck cards have no Start when due > 0

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.07):

```txt
Product (approved in chat during EPIC-29 QA):
  - Own My Decks cards: Play bottom-right when dueCount > 0
  - Tap card → deck detail
  - Tap Play → startLesson (same path as deck detail Start), no extra visit to detail
  - dueCount = 0 → no Play
  - Group / Public / No language cards: no Play

Was wrong:
  - Start existed only on deck detail for the owner
```

Action:

```txt
TASK-30.07 Add Play start on own deck cards when due
```

Impact:

```txt
frontend: DeckListItem + Play control; /lessons/start?deckId=
docs: live SoT for deck start entry points (code is SoT)
backend / Prisma / GraphQL: unchanged
```

---

### DISC-005 Owner deck detail has no action hierarchy

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.08):

```txt
Product (approved in chat):
  - One primary: Start review (owner + dueCount > 0)
  - Quick: Edit, Add card (labeled, not icon-only)
  - More ⋯: Import CSV, Regenerate translations, Publish / Make private
  - Danger zone: Delete deck
  - Assign languages stays visible when the deck has no languages
  - Non-owner copy flow unchanged
  - Rare actions stay labeled in a menu, not mystery icons

Was wrong:
  - Deck detail listed Edit, Add card, CSV, Regenerate, Publish, Delete
    as equal full-width buttons
```

Action:

```txt
TASK-30.08 Restructure owner deck detail actions
```

Impact:

```txt
frontend: deck header More, stats Start below card, DeckActions, DeckMoreMenu
docs: lesson-flow Deck UI
backend / Prisma / GraphQL: unchanged
```

---

### DISC-006 Card rows: 0-based index, bulky actions, flush scrollbar

Status:

```txt
DONE
```

Conflicting sources (as found; fixed in TASK-30.09):

```txt
Product (approved in chat):
  - Display index is 1-based (#{position + 1}); storage stays 0-based
  - Owner Edit / Delete are icons on the right, with a11y labels
  - List content has padding from the scrollbar
  - UI only

Was wrong:
  - #{card.position} showed #0 for the first card
  - Full-width Edit / Delete under the text
```

Action:

```txt
TASK-30.09 Compact card rows with 1-based index
```

Impact:

```txt
frontend: CardList, CardListItem, public deck card rows
docs: lesson-flow card row note
backend / Prisma / GraphQL: unchanged
```

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not add features or drive-by refactors.
4. Do not implement an OPEN discrepancy without approval (chat or register Status: APPROVED).
5. After 30.01, follow docs/domain/lesson-flow.md as live SoT for lesson queue timing.
6. Backend is source of truth for the queue; frontend must not calculate it.
7. Do not change learning-steps formulas or promptDirection rules.
8. Do not weaken auth, permissions, or the security checklist.
9. Do not rewrite docs/tasks/done/* to erase history.
10. Append new discrepancies here; do not start a parallel epic for the same class of fix.
11. Each task’s Commands to Run must pass before commit. If blocked, stop and ask.
```

## Recommended Task Order

```txt
30.01                            SoT wording (docs + smoke)
30.02                            picker tests (answer-time freeze)
30.03                            Start + SubmitReview call timing
30.04                            review session / Повторення in UI and live docs
30.05                            local demo seed for queue QA
30.06                            unique card count on review summary (no attempt stats)
30.07                            Play start on own deck cards when due
30.08                            owner deck detail action hierarchy
30.09                            compact card rows, 1-based index, scrollbar inset
```

## Epic Summary

```md
- [x] TASK-30.01 Clarify show vs answer vs freeze-N in lesson-flow SoT
- [x] TASK-30.02 Freeze lesson-queue gap from answer-time candidates
- [x] TASK-30.03 Record queue showing after answer, not on display
- [x] TASK-30.04 Use review session and Повторення in UI and live docs
- [x] TASK-30.05 Seed lesson-queue QA decks for local demo
- [x] TASK-30.06 Show unique card count on review summary
- [x] TASK-30.07 Add Play start on own deck cards when due
- [x] TASK-30.08 Restructure owner deck detail actions
- [x] TASK-30.09 Compact card rows with 1-based index
```

---

# TASK-30.01 Clarify show vs answer vs freeze-N in lesson-flow SoT

## Status

DONE

## Context

DISC-001: live SoT already says freeze N after answering, but still talks about “showing” for gap fill and never states that display is not an answer. Agents and tests treated returning a card as a showing. Make the three steps explicit, including the A/B/C/D timeline, before changing picker tests or use cases.

## Goal

A reader of live SoT cannot conclude that displaying a card increments showCount or freezes gap N.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/smoke/lesson-queue.md
docs/tasks/done/29-lesson-queue.md
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
docs/smoke/lesson-queue.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. In lesson-flow.md, state explicitly:
   - Display (returning nextCard / first card) is not an answer.
   - Display does not increment showCount and does not freeze N.
   - After Know / Don’t know: persist learning-steps, then increment showCount for the
     answered cardId, then freeze N from other cards that are ready AND showable at that moment.
   - Gap fill = another card was answered (a completed showing), not merely displayed.
2. Include the timeline example:
   Show A at 18:00 with only B ready; C due 18:00:20; D due 18:00:35;
   answer A at 18:00:40 → others B,C,D → N = 3 → A → B → C → D → A repeat.
3. Keep max 3, shrink-to-0, primary vs repeat, Home snapshot vs Deck live, owner-only deck start.
4. architecture.md section 14 and backend-clean-architecture lesson-queue bullets must match.
5. Add one smoke line in docs/smoke/lesson-queue.md: display ≠ answer ≠ freeze N; late-due
   cards at answer time count toward N. Do not rewrite the whole smoke file.
6. Point lesson-flow.md related task files at this epic as well as EPIC-29.
7. Do not rewrite docs/tasks/done/* or EPIC-29 task logs.
8. Mark TASK-30.01 done in this file’s Epic Summary. Leave DISC-001 APPROVED until 30.03.
```

## Security Requirements

```txt
- Docs-only. Do not weaken permissions.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- This task is documentation only.
- Backend remains SoT for queue; frontend must not calculate gap or showCount.
```

## Implementation Notes

```txt
- Copy the product decision from DISC-001 into lesson-flow.md in product language.
- Do not describe the current (wrong) call sites as the intended behavior.
```

## Acceptance Criteria

```txt
- Display, answer, and freeze N are three distinct steps in live SoT.
- The A/B/C/D answer-time N=3 example is in lesson-flow.md.
- architecture.md and backend-clean-architecture.md do not contradict that timing.
- docs/smoke/lesson-queue.md has a check that N is frozen at answer time.
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
- Do not implement the picker or use-case timing yet.
- Do not add a fourth task or extra smoke files.
```

## Expected Commit Message

```txt
TASK-30.01 Clarify show vs answer vs freeze-N in lesson-flow SoT
```

---

# TASK-30.02 Freeze lesson-queue gap from answer-time candidates

## Status

DONE

## Context

`recordLessonCardShowing` already freezes N from the candidate list passed at call time, but tests describe that call as a display. DISC-001 needs an explicit answer-time case: cards that were not due at display but are due at answer must count toward N.

## Goal

Picker unit tests treat `recordLessonCardShowing` as an answer event and cover late-due others (C/D) so N is computed from candidates at answer time.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/domain/services/select-next-lesson-card.ts
apps/api/src/modules/lessons/domain/services/select-next-lesson-card.spec.ts
```

Rename-only imports (no call-timing change) if the function is renamed:

```txt
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
```

## Requirements

```txt
1. Keep freeze / fill / shrink / max-3 / primary-vs-repeat / Home vs Deck membership.
   Only clarify that record runs on answer, not on display.
2. Candidates passed into record are the ready+showable list at answer time (caller supplies them).
3. Add a test for the DISC-001 timeline:
   At display of A only B is due; at answer of A, candidates are B, C, D (all ready+showable).
   After recording A, N = 3. Sequence of later answers B, C, D then A is showable as a repeat.
4. Add a contrast test: if A is recorded with only B in candidates, N = 1 even if C and D
   appear later in selectNextLessonCard candidates. N does not grow after freeze.
5. Existing tests that call record must be readable as answer events (names/comments), not display.
6. Optional rename: recordLessonCardShowing → recordLessonCardAnswer (and input type).
   If renamed, update imports only. Do not change Start/SubmitReview call timing in this task.
7. Do not freeze N inside selectNextLessonCard. Picking the next card is not an answer.
```

## Security Requirements

```txt
- Domain-only. No auth change.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Domain must not import NestJS, Prisma, or GraphQL.
- Do not move this logic into packages/srs or GraphQL resolvers.
```

## Implementation Notes

```txt
- Caller still supplies the ready candidate list; the picker does not query the database.
- If the rename makes 30.03 diffs smaller, do it here; otherwise keep the name.
```

## Acceptance Criteria

```txt
- Late-due C/D at answer time freeze N = 3 for A.
- Recording with only B freezes N = 1; later-ready C/D do not raise that N.
- Picker tests pass.
- API builds.
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
- Do not change Start/SubmitReview when they call record (except a rename import).
- Do not change Prisma, GraphQL, or frontend.
- Do not change learning-steps formulas.
```

## Expected Commit Message

```txt
TASK-30.02 Freeze lesson-queue gap from answer-time candidates
```

---

# TASK-30.03 Record queue showing after answer, not on display

## Status

DONE

## Context

Start records the first returned card as a showing. SubmitReview records `nextCard`, not the card that was just answered. DISC-001: persist empty `showCounts` on start; after learning-steps on submit, record the answered card with current ready+showable candidates, then pick nextCard without recording that display.

## Goal

Queue state advances only when a card is answered. Displaying the first or next card does not increment showCount or freeze N.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
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
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. StartLessonUseCase and StartHomeLessonUseCase:
   - Persist createLessonQueueState (empty showCounts, empty pendingRepeats).
   - selectNextLessonCard for the first card.
   - Return that card without calling recordLessonCardShowing / recordLessonCardAnswer.
2. SubmitReviewUseCase, after calculateNextLearningState and persisting the review row
   and CardReviewState:
   - Load ready+showable candidates at answer time (now / reviewedAt), same membership
     rules as today (Deck live; Home snapshot ∩ ready own cards).
   - Record the answered cardId with those candidates (increment showCount, freeze N,
     fill other cards’ gaps).
   - Then selectNextLessonCard on the updated state.
   - Persist queueState.
   - Return nextCard without recording that card as a showing.
3. If nextCard is null, still persist the answered-card queueState.
4. Skip / exclude deleted or inaccessible cards as today; that is not a showing.
5. Tests to update:
   - Start specs must not expect showCount 1 for the first returned card.
   - Submit specs that seed “card already shown on start” must seed empty (or zero)
     showCounts for a displayed-but-unanswered card.
   - After answering A, showCounts[A] === 1 and nextCard is not yet in showCounts.
   - Late-due others at answer time: answering A with B,C,D ready freezes N = 3.
   - Answering B fills A’s gap by 1 (display of B without submit does not).
6. Keep session ownership, ACTIVE, blocked-user, and card-in-scope checks.
7. Mark TASK-30.03 and DISC-001 DONE in this epic file when finished.
```

## Security Requirements

```txt
- Session must belong to the current user and be ACTIVE.
- Blocked users rejected.
- Do not leak other users’ cards.
- Frontend visibility is not security.
```

## Architecture Constraints

```txt
- Use case must not import Prisma or GraphQL.
- Queue math stays in the lessons domain picker.
- Do not compute gap or showCount on the client.
```

## Implementation Notes

```txt
- Load candidates after the answered card’s new dueAt is persisted so A is only
  “ready” if learning-steps still say dueAt <= now. A is excluded from N as the
  answered card regardless.
- C and D that became due between display of A and submit of A must be in the
  candidate list passed to record.
- Frontend still calls completeLesson when nextCard is null.
```

## Acceptance Criteria

```txt
- Start does not increment showCount for the first card.
- Submit records the answered card, not nextCard.
- N uses other ready+showable cards at answer time (late-due C/D included).
- Start and SubmitReview specs pass; API builds.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- start-lesson.use-case
pnpm --filter @flashcards/api test -- start-home-lesson.use-case
pnpm --filter @flashcards/api test -- submit-review.use-case
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None (human smoke stays in docs/smoke/lesson-queue.md after 30.01).
```

## Do Not Do

```txt
- Do not change Prisma schema or GraphQL contracts.
- Do not change frontend.
- Do not change learning-steps formulas or promptDirection.
- Do not add wait/countdown UI or in-lesson progress.
```

## Expected Commit Message

```txt
TASK-30.03 Record queue showing after answer, not on display
```

---

# TASK-30.04 Use review session and Повторення in UI and live docs

## Status

DONE

## Context

DISC-002: product name is review session / Повторення. UI and live docs still said Lesson / Урок. Queue “repeat” (another answer of the same cardId) must stay distinct from the session name.

## Goal

User-facing copy and live SoT say review session / Повторення. Code identifiers stay Lesson / StudySession / lessonSize.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/domain/permissions.md
docs/smoke/lesson-queue.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
apps/mobile/src/i18n/resources/en/home.ts
apps/mobile/src/i18n/resources/uk/home.ts
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
apps/mobile/src/i18n/resources/en/settings.ts
apps/mobile/src/i18n/resources/uk/settings.ts
docs/domain/lesson-flow.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/smoke/lesson-queue.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. UI uk: Повторення, not Урок. Completion title exactly: Повторення завершено.
2. UI en: Review / review session, not Lesson. Completion title: Review complete.
3. Settings lessonSize label: Розмір повторення / Review size (field name stays lessonSize).
4. Live SoT: product model is review session / Повторення. Add a terminology note
   that technical Lesson* names stay, and queue repeat ≠ session name.
5. Do not rename GraphQL, Prisma, use cases, or routes.
6. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.04 and DISC-002 DONE in this epic file.
```

## Security Requirements

```txt
- Copy-only / docs. Do not weaken permissions.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Frontend must not start calculating the queue.
- Backend identifiers may stay Lesson / StudySession.
```

## Implementation Notes

```txt
- Keep i18n keys (lessons.summary.completeTitle, decks.deckDetail.startLesson).
- Change values only.
```

## Acceptance Criteria

```txt
- No user-facing Урок / Lesson for the session (en/uk i18n).
- Summary title is Повторення завершено / Review complete.
- lesson-flow.md states the product terminology.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (smoke i18n checklist updated for human QA).
```

## Do Not Do

```txt
- Do not rename Lesson / StudySession / lessonSize in code.
- Do not change queue repeat-gap rules.
- Do not change learning-steps formulas.
```

## Expected Commit Message

```txt
TASK-30.04 Use review session and Повторення in UI and live docs
```

---

# TASK-30.05 Seed lesson-queue QA decks for local demo

## Status

DONE

## Context

Local QA of the lesson queue needs G1 / G2 / Q / S, lessonSize 5, active target es, and CardReviewState so Home and deck Start are visible. The previous demo seed only created language-less Demo Spanish Basics / Demo Public Phrases.

This is a local fixture follow-up, not a SoT discrepancy. Keep it in this epic so queue QA work stays in one place.

## Goal

`pnpm --filter @flashcards/api db:seed` leaves the demo user ready for Home snapshot and deck-queue checks.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/smoke/lesson-queue.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/prisma/seed.ts
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Keep demo@example.com and the two language-less demo decks (they must not
   join the Spanish Home snapshot).
2. Seed private decks G1, G2, Q, S with targetLanguage es and sourceLanguage en.
3. G1 cards in createdAt order: apple, bread, cheese, milk, wine, oil, salt.
4. G2: dog/perro. Q: river/río and forest/bosque only. S: one/uno.
5. Demo settings: lessonSize 5, nativeLanguage en, activeTargetLanguage es,
   plus UserStudyLanguage es.
6. Create initial CardReviewState (step 0, due in the past) for those decks so
   dueCount > 0 and Start is shown.
7. Keep the existing production seed guard. Do not add migrate reset as a script.
8. Mark TASK-30.05 DONE in this file’s Epic Summary.
```

## Security Requirements

```txt
- Do not commit real secrets or DATABASE_URL.
- Demo password may stay as the existing local-only seed credential.
- Do not add prisma migrate reset as a package script.
```

## Architecture Constraints

```txt
- Seed may use Prisma directly (it is not a GraphQL/use-case path).
- Do not change queue picker, StartLesson, or learning-steps.
```

## Implementation Notes

```txt
- Stagger G1–S card createdAt so Home snapshot of 5 is apple…wine.
- createMany CardReviewState with skipDuplicates so re-seed is safe.
```

## Acceptance Criteria

```txt
- After seed, Мої for Spanish shows G1, G2, Q, S with due counts 7 / 1 / 2 / 1.
- Demo decks remain under Без мови.
- format:check and docs:lint pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
- Local: pnpm --filter @flashcards/api db:seed, then Мої shows G1–S for es.
```

## Do Not Do

```txt
- Do not seed mountain/sea on Q.
- Do not run migrate reset against any non-local database.
- Do not change GraphQL or Prisma schema.
- Do not start a new epic for this fixture.
```

## Expected Commit Message

```txt
TASK-30.05 Seed lesson-queue QA decks for local demo
```

---

# TASK-30.06 Show unique card count on review summary

## Status

DONE

## Context

DISC-003: after a Home review with 5 unique cards and repeats, the summary showed Cards in this review: 9, Reviewed: 9, Know / Don't know, and Known %. Those numbers are attempts. Product wants only unique answered cards and no attempt stats.

## Goal

Review complete shows title, Nice work, completedAt, and Cards in this review: N where N is unique answered cardIds. Buttons stay as today.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/smoke/lesson-queue.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/types/active-lesson.ts
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/features/lessons/screens/lesson-summary-screen.tsx
docs/domain/lesson-flow.md
docs/architecture.md
docs/smoke/lesson-queue.md
docs/release/mvp-smoke-tests.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Persist uniqueCardCount on LessonCompletion from reviewedCardIds.length before
   clearActiveLesson. Do not use completeLesson.totalCards or reviewedCards for N.
2. Summary layout: completeTitle, then Nice work, then completedAt, then
   Cards in this review: uniqueCardCount.
3. Remove Reviewed, Know, Don't know, and Known % from the summary screen.
4. Do not change Start another review / Home / Back to deck / Back to decks.
5. Do not change CompleteLessonUseCase, Prisma, or GraphQL schema/resolvers.
6. Live SoT: UI summary unique count; API knownCount/dontKnowCount remain attempts
   but are not shown. Update architecture.md result-screen bullet and smoke checks.
7. Do not rewrite docs/tasks/done/*.
8. Mark TASK-30.06 and DISC-003 DONE in this epic file.
```

## Security Requirements

```txt
- Do not weaken permissions.
- Do not commit secrets.
- Frontend unique count is UX only; backend remains SoT for queue and reviews.
```

## Architecture Constraints

```txt
- Frontend must not calculate learning-steps, dueAt, or the lesson queue.
- Unique card count may be derived from client reviewedCardIds for this screen.
- Do not add a new GraphQL field in this task.
```

## Implementation Notes

```txt
- reviewedCardIds already skips duplicate cardIds.
- Keep unused completeLesson fields in the GraphQL query if already requested.
- Keep unused i18n keys unless this screen was their only use and removal is smaller.
```

## Acceptance Criteria

```txt
- Summary shows unique answered cards, not attempts.
- Attempt stats are not on the summary screen.
- Navigation buttons unchanged.
- API is unchanged.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human QA after this commit: Home snapshot of 5 with repeats → N is 5).
```

## Do Not Do

```txt
- Do not change the backend completeLesson payload.
- Do not add countdown, in-lesson progress, or new summary stats.
- Do not change queue picker or learning-steps.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.06 Show unique card count on review summary
```

---

# TASK-30.07 Add Play start on own deck cards when due

## Status

DONE

## Context

DISC-004: Own cards on My Decks show Due but Start exists only on deck detail. Product: Play bottom-right when dueCount > 0; tap card still opens detail; Play starts the same owner deck review as deck detail.

## Goal

Own deck cards with dueCount > 0 show a Play control that starts `/lessons/start?deckId=`. Group, Public, and No language cards do not. Live SoT matches this code.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/architecture.md
docs/algorithms/learning-steps.md
docs/smoke/lesson-queue.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/components/deck-start-play-button.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
docs/domain/lesson-flow.md
docs/architecture.md
docs/algorithms/learning-steps.md
docs/smoke/lesson-queue.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Own section only (showLearningCounters). Play bottom-right when dueCount > 0.
2. Tap card → existing deck detail href. Tap Play → /lessons/start?deckId= (same as
   deck detail Start). Play must not open detail.
3. dueCount = 0 → no Play. Group / Public / No language → no Play.
4. Reuse deckLearningStats dueCount (Apollo cache ok). Accessibility label = startLesson i18n.
5. Do not change StartLessonUseCase, GraphQL, or deck detail Start rules.
6. After implementation, update live SoT that contradicts this entry point. Code is SoT.
   Point lesson-steps lesson-selection leftovers at lesson-flow.md if they still say
   deck sessions stop at lessonSize. Do not rewrite docs/tasks/done/*.
7. Mark TASK-30.07 and DISC-004 DONE in this epic file.
```

## Security Requirements

```txt
- Play is UX only. Backend still requires ownership for startLesson.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Frontend must not calculate the queue or learning-steps.
- Do not start public/group originals from this control.
```

## Implementation Notes

```txt
- Keep Play a sibling of the card Pressable (absolute), not a nested child, so taps do not
  bubble to detail.
- Ionicons play; match due-count blue if possible.
```

## Acceptance Criteria

```txt
- Own + due > 0 shows Play; due = 0 does not.
- Play starts the deck review without opening detail first.
- Card tap still opens detail.
- Live docs describe both Play and deck-detail Start.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: Own G1 with Due → Play; tap card vs tap Play).
```

## Do Not Do

```txt
- Do not add Play to Group, Public, or No language cards.
- Do not change Home START.
- Do not change the backend.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.07 Add Play start on own deck cards when due
```

---

# TASK-30.08 Restructure owner deck detail actions

## Status

DONE

## Context

DISC-005: owner deck detail is a stack of equally weighted buttons. Product wants one primary Start review, labeled quick actions, rare actions in More, and Delete in a danger zone. Not icon-only for Publish / CSV / Regenerate.

## Goal

Owner deck detail: Header + More, stats, Start review, Edit / Add card, Danger zone Delete. More holds CSV, regenerate, publish/unpublish. Non-owner copy flow unchanged.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/domain/permissions.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/components/deck-more-menu.tsx
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-header.tsx
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/src/features/decks/screens/deck-detail-screen.tsx
apps/mobile/src/features/lessons/components/deck-learning-stats-card.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Header: title, language pair, Private/Public badge, ⋯ More (owner only).
2. Drop duplicate cardCount from header (total stays on stats).
3. Stats card is stats only. Start review is the primary below it, owner + dueCount > 0.
4. Quick actions: Edit and Add card, labeled (icon+label ok). Not icon-only.
5. More menu (labeled items): Import CSV, Regenerate translations (when languages exist),
   Publish / Make private. Same confirms and language gate as today.
6. Assign languages remains a visible CTA when the deck has no languages. Not in More.
7. Delete deck in a Danger zone at the bottom of owner actions, still confirm-destructive.
8. Non-owner: GroupDeckCopyActions only. No More / Delete / Start.
9. Keep pending-moderation copy visible when relevant.
10. Update live SoT Deck UI to this hierarchy. Code is SoT. Do not rewrite docs/tasks/done/*.
11. Mark TASK-30.08 and DISC-005 DONE.
```

## Security Requirements

```txt
- Hidden More items are UX only. Backend still enforces owner/publish/delete.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not change GraphQL or use cases.
- Frontend must not calculate the lesson queue.
```

## Implementation Notes

```txt
- Use a Modal or equivalent so More is not clipped by the card list.
- Reuse existing publish / unpublish / regenerate / CSV handlers.
```

## Acceptance Criteria

```txt
- Owner detail is not a flat button stack.
- Start is the only primary; hidden when dueCount = 0.
- CSV / regenerate / publish are in More with labels.
- Delete is separate from More and quick actions.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: owner G1 detail — Start, Edit, Add card, More, Delete).
```

## Do Not Do

```txt
- Do not replace rare actions with unlabeled icons.
- Do not change public deck detail or Home START.
- Do not change the backend.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.08 Restructure owner deck detail actions
```

---

# TASK-30.09 Compact card rows with 1-based index

## Status

DONE

## Context

DISC-006: card rows show #0, Edit/Delete as large buttons under the text, and content sits against the scrollbar. Product: 1-based display, icon actions on the right, extra list inset. UI only.

## Goal

Owner (and public) card rows display #{position + 1}. Owner actions are edit/delete icons on the right. Card lists have padding away from the scrollbar.

## Related Documents

```txt
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-list.tsx
apps/mobile/src/features/decks/components/card-list-item.tsx
apps/mobile/src/features/public-decks/screens/public-deck-detail-screen.tsx
docs/domain/lesson-flow.md
docs/tasks/30-sot-discrepancies.md
```

## Requirements

```txt
1. Show #{card.position + 1}. Do not change stored position or GraphQL.
2. Owner Edit / Delete: icons on the right (create-outline, trash-outline), a11y labels.
   Delete still uses the existing confirm flow. Not unlabeled mystery for rare deck actions.
3. Add paddingRight on the card list so badges/icons are not flush with the scrollbar.
4. Public deck detail uses the same 1-based display (no owner icons there).
5. Update live SoT card-row note if needed. Do not rewrite docs/tasks/done/*.
6. Mark TASK-30.09 and DISC-006 DONE.
```

## Security Requirements

```txt
- Hidden icon labels are UX only; delete still confirms. Backend enforces owner.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- UI only. Do not change Prisma, GraphQL, or use cases.
```

## Implementation Notes

```txt
- Keep example text under front/back on the left.
- Badge stays top-right; icons under or beside it on the right column.
```

## Acceptance Criteria

```txt
- First card shows #1.
- Owner rows use icon Edit/Delete on the right.
- List is not flush against the scrollbar.
- API unchanged.
- Mobile typecheck, format:check, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: G1 card list #1… and icons).
```

## Do Not Do

```txt
- Do not reindex cards in the database.
- Do not change Home START or deck More menu.
- Do not push.
```

## Expected Commit Message

```txt
TASK-30.09 Compact card rows with 1-based index
```

---

# Cursor Execution Rules

When working on a task in this epic, Cursor must follow these rules:

```txt
1. Read this epic and all Related Documents listed in the task first.
2. Implement only the current task. Do not start 30.02 or 30.03 from 30.01.
3. Do not add product features that are not in the task.
4. After 30.01, treat docs/domain/lesson-flow.md as live SoT for queue timing.
5. Do not weaken auth, permissions, or the security checklist.
6. Run all Commands to Run. Fix issues they find. Then commit with the Expected Commit Message.
7. If blocked or the discrepancy is still OPEN, stop and ask.
```

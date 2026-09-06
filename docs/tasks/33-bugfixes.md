# EPIC-33 Bugfixes (post–EPIC-32 smoke)

## Epic Goal

Fix bugs found during manual verification after EPIC-32 Review Presentation Modes.

This epic covers:

```txt
- web navigation and review-UI regressions found in local smoke
- follow-up bugs discovered while re-running review / decks smoke
```

This epic does **not** add new product features.

New bugs found during smoke should be appended here as new TASK-33.XX items (one bug ≈ one task ≈ one commit).

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/15-frontend-decks-cards.md
docs/tasks/done/27-learning-steps-bugfixes.md
docs/tasks/done/32-review-presentation-modes.md
docs/smoke/review-presentation.md
docs/release/mvp-smoke-tests.md
```

## Epic Prerequisites

EPIC-32 is complete (in `docs/tasks/done/`).

Expected state:

```txt
- Review presentation modes are on local main
- Local stack: Postgres + API (:3000) + mobile web (:8081)
- Manual smoke in progress or blocked by known bugs below
```

## Known Bugs (backlog source)

```txt
1. After deleting a deck, the user is not sent to /decks
   - Nested Decks stack on web: replace('/(tabs)/decks') and navigate('/decks') leave /decks/:deckId
   - awaitRefetchQueries + DeckLearningStats 404s ("Deck not found") so dismissTo never runs
   - Pop with dismissTo('/decks') after a successful delete (do not refetch that deck's stats)
2. Add Card: Create Card succeeds but only clears the form (no success confirmation)
   - Cancel goes to the deck but is labeled Cancel
   - Return to deck; confirm when the form is not empty
3. Start review shows Internal server error (StudySession.audioOnlyDisabled missing)
   - Error UI is the old Start review + gray Retry page
4. Don't know on steps 0–1 waits 2 minutes before the card is due again
   - Product: dueAt = reviewedAt so it can repeat in the same session (gap unchanged)
5. SOURCE_TEXT auto-speaks the target after flip
   - Product: SOURCE_TEXT never speaks and never shows 🔊 (question or answer)
6. Lost-review screen is a red ErrorState plus three equal gray buttons
   - Product: same ~480px column as empty/complete/start-error (icon, title, body, one primary, text links)
```

## Epic Rules

```txt
1. One task = one focused bug fix = one commit.
2. Do not add features or drive-by refactors.
3. Prefer smallest fix that restores acceptance / smoke.
4. Do not weaken validation or permissions.
5. Do not commit secrets.
6. After each fix, re-check the manual step that failed.
7. When a new smoke bug appears, add TASK-33.XX before fixing it.
8. Run Commands to Run in each task before committing.
9. Mark epic DONE only when known checklist bugs are fixed and smoke can proceed.
10. Do not push.
```

## Recommended Task Order

```txt
33.01 Redirect to /decks after deleting a deck
33.02 Add Card success feedback and return-to-deck
33.03 Fix start review 500 and restyle the error screen
33.04 Don't know on steps 0–1 is due immediately
33.05 Don't auto-speak SOURCE_TEXT after flip
33.06 Restyle lost-review screen like empty/complete
(+ append new bugs in discovery order)
```

## Epic Summary

```md
- [x] TASK-33.01 Redirect to /decks after deleting a deck
- [x] TASK-33.02 Add Card success feedback and return-to-deck
- [x] TASK-33.03 Fix start review 500 and restyle the error screen
- [x] TASK-33.04 Don't know on steps 0–1 is due immediately
- [x] TASK-33.05 Don't auto-speak SOURCE_TEXT after flip
- [x] TASK-33.06 Restyle lost-review screen like empty/complete
```

---

# TASK-33.01 Redirect to /decks after deleting a deck

## Status

DONE

## Context

After confirming Delete Deck on deck detail, the mutation succeeds but the web user can stay on `/decks/:deckId` (empty/error for a deleted deck) instead of the decks list.

`DeckActions` used `router.replace('/(tabs)/decks')`, then `router.navigate('/decks')`. Both leave the nested `[deckId]` screen on web, so the URL stays `/decks/:deckId`.

A later attempt used `dismissTo('/decks')`, but `awaitRefetchQueries` still refetched `DeckLearningStats` for the deleted deck. The API returns "Deck not found", Apollo rejects the mutation, the catch path shows that error (and the stats card shows "Could not load learning stats"), and `dismissTo` never runs.

`dismissTo('/decks')` pops the decks stack until the list after a successful delete. Do not refetch `DeckLearningStats` for the removed deck.

## Goal

After a successful delete, land on the decks list at `/decks`. Failed delete must stay on detail and show the existing error.

## Related Documents

```txt
docs/tasks/33-bugfixes.md
docs/architecture.md
docs/domain/lesson-flow.md
docs/tasks/done/15-frontend-decks-cards.md
docs/tasks/done/27-learning-steps-bugfixes.md
apps/mobile/src/features/decks/components/deck-actions.tsx
apps/mobile/app/(tabs)/_layout.tsx
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-actions.tsx
docs/architecture.md
docs/domain/lesson-flow.md
docs/tasks/33-bugfixes.md
```

## Requirements

```txt
1. On successful deleteDeck, land on the decks list (`/decks`) and drop `/decks/:deckId` from the stack.
2. Use `router.dismissTo('/decks')` (not navigate/replace to `/(tabs)/decks`).
3. Do not refetch DeckLearningStats after delete (404 blocks the mutation promise).
4. Do not navigate away when the mutation fails or returns false.
5. Mark TASK-33.01 DONE.
```

## Security Requirements

```txt
- Keep using the generated deleteDeck mutation.
- Do not weaken owner-only delete UX; backend still enforces ownership.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Frontend-only navigation fix.
- Do not change the deleteDeck GraphQL contract.
```

## Implementation Notes

```txt
- Use dismissTo('/decks') so nested detail is popped on web.
- Keep HomeLearningProgress / MyDecks / DecksPage refetch; skip DeckLearningStats.
- Do not change confirm copy or danger-zone layout.
```

## Acceptance Criteria

```txt
- After Delete → confirm → success, URL and screen are the decks list (`/decks`).
- Deleted deck is gone from the list.
- Success must not leave the user on detail with "Deck not found" / stats load errors.
- Failed delete stays on detail with the existing error.
- Mobile typecheck, format:check, and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
1. Open an owned deck on web (/decks/:deckId).
2. Delete Deck → confirm.
3. Land on /decks; the deck is not in the list.
4. Cancel on the confirm dialog stays on detail.
```

## Do Not Do

```txt
- Do not change delete permissions or the API.
- Do not refactor DeckActions beyond the redirect.
- Do not push.
```

## Expected Commit Message

```txt
TASK-33.01 Redirect to /decks after deleting a deck
```

---

# TASK-33.02 Add Card success feedback and return-to-deck

## Status

DONE

## Context

On Add Card, Create Card succeeds and the form clears, but there is no success confirmation. The secondary action is labeled Cancel even though it returns to the deck.

## Goal

After a successful create, stay on Add Card with an empty form and a short success line. Label the leave action Return to deck / Повернутися до колоди. Confirm before leaving when the form is not empty (or a bulk queue is active).

## Related Documents

```txt
docs/tasks/33-bugfixes.md
docs/architecture.md
docs/domain/bulk-card-add.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/smoke/bulk-card-add.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-form.tsx
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/architecture.md
docs/domain/bulk-card-add.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/smoke/bulk-card-add.md
docs/tasks/33-bugfixes.md
```

## Requirements

```txt
1. After successful createCard, keep staying on Add Card with a cleared form and show Card created / Картку створено.
2. Clear the success line on the next submit, error, paste, or skip; Edit Card stays Cancel.
3. Add Card secondary action is Return to deck / Повернутися до колоди (not Cancel).
4. Empty form: leave with no confirm. Non-empty form or active bulk queue: confirm (existing unsaved / leave-queue copy).
5. Update live SoT and smoke expected copy. Mark TASK-33.02 DONE.
```

## Security Requirements

```txt
- Do not change createCard permissions or the API.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Frontend-only UX on Add Card.
- Keep bulk queue / stay-on-Add-Card behavior from EPIC-31.
```

## Implementation Notes

```txt
- Pass cancelLabel from CreateCardScreen. Reuse confirmAction on the leave button.
- Do not change Edit Card Cancel.
```

## Acceptance Criteria

```txt
- Create Card shows a success line and an empty form; URL stays Add Card.
- Return to deck with empty form goes to the deck with no dialog.
- Return to deck with typed fields (or a queue) asks to confirm; cancel stays.
- en/uk copy for success and the leave button.
- Mobile typecheck, format:check, and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
pnpm docs:lint
```

## Manual Checks

```txt
1. Add Card → Create Card → success line, empty fields, still on Add Card.
2. Return to deck on empty form → deck detail, no confirm.
3. Type Front/Back, Return to deck → confirm; dismiss stays; confirm leaves.
```

## Do Not Do

```txt
- Do not navigate to deck detail after create.
- Do not change Edit Card or delete-card copy.
- Do not push.
```

## Expected Commit Message

```txt
TASK-33.02 Add Card success feedback and return-to-deck
```

---

# TASK-33.03 Fix start review 500 and restyle the error screen

## Status

DONE

## Context

Start review (`/lessons/start?deckId=`) returns GraphQL "Internal server error" because `StudySession.audioOnlyDisabled` from EPIC-32 is in Prisma but was not migrated on local Postgres. The error UI is still the old Start review title plus a gray Retry, unlike empty/complete review screens.

## Goal

Start review can create a session. Failed start uses the same centered empty-state layout (icon, title, message, primary Retry, Back to deck text). Do not show a Start review page chrome for errors.

## Related Documents

```txt
docs/tasks/33-bugfixes.md
docs/domain/lesson-flow.md
docs/smoke/review-presentation.md
docs/tasks/done/32-review-presentation-modes.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/start-lesson-screen.tsx
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
docs/domain/lesson-flow.md
docs/tasks/33-bugfixes.md
```

## Requirements

```txt
1. Apply the local StudySession.audioOnlyDisabled migration so startLesson no longer 500s.
2. Restyle start-review error (and missing deckId) like empty start review: ~480px column, icon, title, body, primary action, text leave action.
3. Do not surface raw Internal server error; use Could not start review copy.
4. Keep empty and loading behavior. Update live SoT. Mark TASK-33.03 DONE.
```

## Security Requirements

```txt
- Do not leak Prisma/stack traces to the client.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Frontend error layout only; the 500 is a missing DB column, not a use-case change.
- Do not change startLesson GraphQL contract.
```

## Implementation Notes

```txt
- Reuse empty-state spacing and #1a56db primary.
- Error: Retry primary, Back to deck text. Missing deckId: All decks primary.
```

## Acceptance Criteria

```txt
- Start review on a due deck opens the review card (no Internal server error).
- If start fails, the screen matches empty/complete layout (not Start review + gray Retry).
- Mobile typecheck, format:check, lint, and docs:lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
pnpm docs:lint
```

## Manual Checks

```txt
1. Start review on a deck with due cards → review screen, target spoken.
2. Error layout: icon, title, Retry, Back to deck (no Start review heading).
```

## Do Not Do

```txt
- Do not restyle global ErrorState.
- Do not change SRS or presentationMode mapping.
- Do not push.
```

## Expected Commit Message

```txt
TASK-33.03 Fix start review 500 and restyle the error screen
```

---

# TASK-33.04 Don't know on steps 0–1 is due immediately

## Status

DONE

## Context

Don't know on learning steps 0–1 set `dueAt = reviewedAt + 2 minutes`. The in-session queue only repeats cards that are already due, so the same card did not come back until two minutes later.

Product: `dueAt = reviewedAt`. Queue gap is unchanged (other due cards can still fill N first). Steps 2–5 (+15m) and 6–8 (+12h) stay as they are.

## Goal

Don't know on steps 0–1 keeps the step and schedules the card as due now so it can reappear in the same session.

## Related Documents

```txt
docs/tasks/33-bugfixes.md
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
docs/smoke/learning-steps.md
packages/srs/src/learning-steps.ts
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
packages/srs/src/learning-steps.ts
packages/srs/src/learning-steps.test.ts
docs/algorithms/learning-steps.md
docs/smoke/learning-steps.md
docs/release/mvp-smoke-tests.md
docs/tasks/33-bugfixes.md
```

## Requirements

```txt
1. Don't know on steps 0–1: learningStep unchanged, dueAt = reviewedAt, count unchanged.
2. Update SRS unit tests. Do not change Know intervals or Don't know 2–8.
3. Update live SoT (learning-steps.md) and smoke copy. Do not rewrite docs/tasks/done/*.
4. Mark TASK-33.04 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Change only packages/srs learning-steps. Queue picker and gap stay in lessons domain.
```

## Implementation Notes

```txt
- Rebuild @flashcards/srs so the running API can pick up dist.
```

## Acceptance Criteria

```txt
- SRS tests: Don't know 0 and 1 → dueAt equals reviewedAt.
- Don't know 2–8 intervals unchanged.
- Mobile/API typecheck and srs tests pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs test
pnpm --filter @flashcards/srs build
pnpm --filter @flashcards/api test -- start-lesson.use-case.spec.ts submit-review.use-case.spec.ts
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
pnpm docs:lint
```

## Manual Checks

```txt
1. New card, Don't know: next card can be the same one if no other due cards (or after the gap).
2. Don't know on a practiced card still uses +15m / +12h.
```

## Do Not Do

```txt
- Do not change the queue gap or max-3-answers.
- Do not change Know intervals.
- Do not push.
```

## Expected Commit Message

```txt
TASK-33.04 Don't know on steps 0–1 is due immediately
```

---

# TASK-33.05 Don't auto-speak SOURCE_TEXT after flip

## Status

DONE

## Context

`SOURCE_TEXT` showed the source on the question (no TTS) and auto-spoke the target after flip, with 🔊. During smoke the target TTS on the answer side was unwanted: the card is a translation prompt, not a listening task.

## Goal

`SOURCE_TEXT` never auto-speaks and never shows 🔊, on the question or after flip.

## Related Documents

```txt
docs/tasks/33-bugfixes.md
docs/architecture.md
docs/domain/lesson-flow.md
docs/smoke/review-presentation.md
docs/release/mvp-smoke-tests.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/utils/get-review-sides.ts
docs/architecture.md
docs/domain/lesson-flow.md
docs/smoke/review-presentation.md
docs/release/mvp-smoke-tests.md
docs/tasks/33-bugfixes.md
```

## Requirements

```txt
1. shouldSpeakReviewTarget returns false for SOURCE_TEXT whether revealed or not (same as TARGET_TEXT).
2. TARGET_TEXT_AUDIO and TARGET_AUDIO_ONLY still auto-speak on the question; 🔊 still shows there.
3. Update live SoT and smoke. Do not rewrite docs/tasks/done/*.
4. Mark TASK-33.05 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Speak stays a client render of presentationMode. Do not change SRS or GraphQL.
```

## Implementation Notes

```txt
- 🔊 uses the same helper as auto-speak, so it is hidden for SOURCE_TEXT too.
```

## Acceptance Criteria

```txt
- SOURCE_TEXT question: source text, no TTS, no 🔊.
- SOURCE_TEXT after flip: target text, no TTS, no 🔊.
- TARGET_TEXT_AUDIO / TARGET_AUDIO_ONLY speak behavior unchanged.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
pnpm docs:lint
```

## Manual Checks

```txt
1. SOURCE_TEXT card: English (source) on the question is silent, no 🔊.
2. Flip: Spanish (target) appears, no auto-speak, no 🔊.
```

## Do Not Do

```txt
- Do not change TARGET_TEXT_AUDIO or TARGET_AUDIO_ONLY speak rules.
- Do not change presentation-mode mapping or Can’t listen.
- Do not push.
```

## Expected Commit Message

```txt
TASK-33.05 Don't auto-speak SOURCE_TEXT after flip
```

---

# TASK-33.06 Restyle lost-review screen like empty/complete

## Status

DONE

## Context

After a refresh or HMR, `/lessons/:sessionId` can lose in-memory review state. The screen used the old ErrorState plus three equal gray buttons (Start review again, Back to deck, Back to decks), unlike empty start review, start error, and Review complete.

## Goal

Restyle lost-review and missing-session screens to the same ~480px outcome column: alert icon, title, body, one primary action, text links.

## Related Documents

```txt
docs/tasks/33-bugfixes.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
docs/domain/lesson-flow.md
docs/tasks/33-bugfixes.md
```

## Requirements

```txt
1. Lost and missing-session screens: icon, Review unavailable title, body, no PageTitle + ErrorState stack.
2. Deck session: primary Start review again; Back to deck and All decks as text.
3. Home session: primary Home; All decks as text.
4. Do not restyle global ErrorState (inline submit errors stay).
5. Update live SoT. Mark TASK-33.06 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Layout only. Do not persist review state across refresh.
```

## Implementation Notes

```txt
- Reuse empty/complete spacing and #1a56db primary.
```

## Acceptance Criteria

```txt
- Lost-review looks like start-error / complete, not three gray buttons.
- Start review again still goes to /lessons/start?deckId= when deckId is present.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
pnpm docs:lint
```

## Manual Checks

```txt
1. Open a deck review, refresh or lose in-memory state: icon, title, blue Start review again, text Back to deck and All decks.
2. Start review again resumes a session from that deck.
```

## Do Not Do

```txt
- Do not restyle global ErrorState.
- Do not change queue or SRS.
- Do not push.
```

## Expected Commit Message

```txt
TASK-33.06 Restyle lost-review screen like empty/complete
```

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
(+ append new bugs in discovery order)
```

## Epic Summary

```md
- [x] TASK-33.01 Redirect to /decks after deleting a deck
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

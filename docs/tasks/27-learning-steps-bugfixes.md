# EPIC-27 Bugfixes (post–EPIC-26 smoke)

## Epic Goal

Fix bugs found during manual verification of EPIC-26 Learning Steps.

This epic covers:

```txt
- regressions that block Home START / complete lesson smoke
- follow-up bugs discovered while re-running learning-steps smoke
```

This epic does **not** add new product features.

New bugs found during smoke should be appended here as new TASK-27.XX items (one bug ≈ one task ≈ one commit).

## Epic Status

TODO

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
docs/tasks/done/26-learning-steps.md
docs/smoke/learning-steps.md
docs/release/mvp-smoke-tests.md
```

## Epic Prerequisites

EPIC-26 should be complete (feature work DONE).

Expected state:

```txt
- Learning steps code is on main
- Local stack: Postgres + API (:3000) + mobile
- Manual smoke of EPIC-26 in progress or blocked by known bugs below
```

## Known Bugs (backlog source)

```txt
1. completeLesson fails for Home sessions with LESSON_NOT_FOUND
   - HOME_ACTIVE_TARGET sessions have deckId = null
   - CompleteLessonUseCase rejected null deckId
2. Lesson progress bar uses lessonSize when fewer cards are in the lesson
   - Deck Start with 3 due cards and lessonSize=5 showed progress of 5
   - Actual lesson had only 3 cards
3. Decks tab does not return to decks list from deck detail
   - On /decks/:deckId, tapping Decks tab leaves the user on the detail screen
4. Decks tab restores previous deck after visiting Home
   - Decks → deck detail → Home → Decks shows the old deck instead of the list
5. Deck list cards uneven height / cluttered body
   - Description shown in list; learning counters are one long line
```

## Epic Rules

```txt
1. One task = one focused bug fix = one commit.
2. Do not add features or drive-by refactors.
3. Prefer smallest fix that restores acceptance / smoke.
4. Do not weaken validation or permissions.
5. Do not commit secrets.
6. After each fix, re-check the manual step that failed.
7. When a new smoke bug appears, add TASK-27.XX before fixing it.
8. Run Commands to Run in each task before committing.
9. Mark epic DONE only when known checklist bugs are fixed and smoke can proceed.
```

## Recommended Task Order

```txt
27.01 Fix completeLesson for Home sessions (null deckId)
27.02 Fix lesson progress bar when due cards < lessonSize
27.03 Reset Decks tab stack to list on re-tap
27.04 Always open decks list when selecting Decks tab
27.05 Deck list cards: title only + column learning counters
```

## Task Checklist

- [x] TASK-27.01 Fix completeLesson for Home sessions with null deckId
- [x] TASK-27.02 Fix lesson progress bar when due cards < lessonSize
- [x] TASK-27.03 Reset Decks tab stack to list on re-tap
- [x] TASK-27.04 Always open decks list when selecting Decks tab
- [x] TASK-27.05 Deck list cards: title only + column learning counters

---

# TASK-27.01 Fix completeLesson for Home sessions with null deckId

## Status

DONE

## Context

During EPIC-26 manual smoke, finishing a Home START lesson (`scope=HOME_ACTIVE_TARGET`, `deckId=null`) returned GraphQL error **Lesson not found** instead of the summary screen.

`docs/domain/lesson-flow.md` requires `CompleteLessonUseCase` summary `deckId` to be nullable for Home. Deck-scoped sessions still require `deckId`.

Mobile summary assumed a deck id for “start another” / “back to deck” navigation.

## Goal

Allow completing Home lessons; return nullable `deckId`; keep deck-lesson completion unchanged; fix Home summary navigation.

## Related Documents

```txt
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/tasks/done/26-learning-steps.md
docs/smoke/learning-steps.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/lessons/application/use-cases/complete-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/complete-lesson.use-case.spec.ts
apps/api/src/modules/lessons/presentation/graphql/types/complete-lesson-payload.type.ts
apps/mobile/src/features/lessons/screens/lesson-summary-screen.tsx
docs/tasks/27-learning-steps-bugfixes.md
```

## Requirements

```txt
1. CompleteLessonUseCase:
   - Reject missing/foreign sessions with LESSON_NOT_FOUND (unchanged).
   - Reject non-ACTIVE with LESSON_NOT_ACTIVE (unchanged).
   - For scope=DECK: require deckId; totalCards = countByDeckId(deckId).
   - For scope=HOME_ACTIVE_TARGET: allow deckId=null; totalCards = reviewedCards (session review count).
   - Return deckId: string | null.
2. GraphQL CompleteLessonPayload.deckId: String, nullable.
3. Spec: Home session with deckId=null completes successfully; deck path still uses countByDeckId.
4. Mobile LessonSummaryScreen:
   - When deckId is null (Home): primary CTA returns to Home tab; do not navigate to /lessons/start?deckId=...
   - When deckId is present: keep start-another + back-to-deck behavior.
```

## Security Requirements

```txt
- Only the session owner can complete.
- Blocked users rejected.
- Do not complete another user’s session.
```

## Acceptance Criteria

```txt
- Home START → answer until nextCard is null → completeLesson succeeds → summary shown.
- Deck Start lesson complete still returns deckId and deck totalCards.
- Specs for complete-lesson pass; API/mobile typecheck/lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- --testPathPatterns=complete-lesson --watchman=false
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-27.01 Fix completeLesson for Home sessions with null deckId
```

---

# TASK-27.02 Fix lesson progress bar when due cards < lessonSize

## Status

DONE

## Context

During EPIC-26 manual smoke (Step 9 — Deck Start on **Demo Spanish Basics**):

- Deck had **3** due cards (`hello` / `goodbye` / `thank you`).
- User settings / session `lessonSize` was **5**.
- Lesson review UI progress bar showed **of 5** (e.g. card 1 of 5) while only **3** cards were in the lesson.

Likely cause in mobile `useActiveLesson`:

```txt
totalCards = lesson?.lessonSize ?? lesson?.cards.length ?? 0
```

Progress denominator prefers `lessonSize` over the actual cards in the active lesson. Deck `startLesson.totalCards` is also deck-wide `countByDeckId`, not the lesson queue size — do not use that for the in-lesson progress bar without clarifying semantics.

## Goal

Progress bar during an active lesson must reflect cards in **this** lesson session (e.g. 1/3 … 3/3 when only 3 cards are reviewed), not the settings cap when fewer cards are available.

## Related Documents

```txt
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/smoke/learning-steps.md
docs/tasks/done/26-learning-steps.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/hooks/use-active-lesson.ts
(optional) apps/mobile tests / related lesson store if needed for the chosen denominator
docs/tasks/27-learning-steps-bugfixes.md
```

## Requirements

```txt
1. In-lesson progress total must match the cards reviewed in the current session when due/available cards < lessonSize.
2. When the session reaches lessonSize (or grows via nextCard re-queue up to lessonSize), progress total must still be coherent (never show a smaller total than reviewed; cap at lessonSize as the max lesson length).
3. Do not change lesson selection / start algorithms — this is a progress UI (and only API totalCards semantics if required for a correct denominator).
4. Keep accessibility labels / progressbar values consistent with the visible fraction.
```

## Security Requirements

```txt
- No permission or auth changes.
```

## Acceptance Criteria

```txt
- Smoke: Deck Start with 3 due cards and lessonSize=5 → progress shows of 3 (not of 5) through the lesson.
- Home / fuller queues still show progress up to the actual lesson length (≤ lessonSize).
- Mobile typecheck / lint / format pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-27.02 Fix lesson progress bar when due cards < lessonSize
```

---

# TASK-27.03 Reset Decks tab stack to list on re-tap

## Status

DONE

## Context

During manual smoke / deck navigation: on deck detail (`/decks/:deckId`), tapping the **Decks** tab in the bottom tab bar does nothing — the user stays on the detail screen instead of returning to the decks list.

Cause: `decks` is a nested Stack inside Tabs. Re-selecting an already focused tab only focuses that tab route; it does not pop the nested stack to `decks/index`.

## Goal

When the Decks tab is already focused and the user taps Decks again, navigate to the decks list (`/decks`). Switching to Decks from another tab must keep the previous nested stack state (do not reset on first focus from elsewhere).

## Related Documents

```txt
docs/tasks/done/05-decks-cards.md
docs/smoke/learning-steps.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/app/(tabs)/_layout.tsx
docs/tasks/27-learning-steps-bugfixes.md
```

## Requirements

```txt
1. Add a Decks tabPress listener: if the Decks tab is already focused, router.dismissTo('/decks').
2. Do not reset the decks stack when switching to Decks from Home/Profile (only when already focused).
3. No other tab behavior changes required for this task.
```

## Security Requirements

```txt
- No permission or auth changes.
```

## Acceptance Criteria

```txt
- On /decks/:deckId, tap Decks tab → land on decks list.
- From Home, tap Decks → still opens last decks stack state (or list if none); second tap on Decks while deep → list.
- Mobile typecheck / lint / format pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-27.03 Reset Decks tab stack to list on re-tap
```

---

# TASK-27.04 Always open decks list when selecting Decks tab

## Status

DONE

## Context

After TASK-27.03, re-tapping Decks while already on the tab returned to the list, but switching away and back restored the nested stack:

```txt
Decks → open deck → Home → Decks → still on previous deck detail
```

Users expect the **Decks** tab to mean the decks list, not “resume last deck screen”.

## Goal

Every press of the Decks tab navigates to `/decks` (list), whether the tab was already focused or the user is coming from Home/Profile.

## Related Documents

```txt
docs/tasks/27-learning-steps-bugfixes.md (TASK-27.03)
docs/smoke/learning-steps.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/app/(tabs)/_layout.tsx
docs/tasks/27-learning-steps-bugfixes.md
```

## Requirements

```txt
1. Decks tabPress: preventDefault + router.navigate('/decks').
2. Covers both re-tap on Decks and Home → Decks after visiting a deck.
3. Do not change Home/Profile tab press behavior.
```

## Security Requirements

```txt
- No permission or auth changes.
```

## Acceptance Criteria

```txt
- Decks → deck → Home → Decks → decks list (not the previous deck).
- On /decks/:deckId, tap Decks → decks list.
- Mobile typecheck / lint / format pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-27.04 Always open decks list when selecting Decks tab
```

---

# TASK-27.05 Deck list cards: title only + column learning counters

## Status

DONE

## Context

During Decks smoke / UI review, horizontal deck cards had uneven heights and cluttered bodies:

- list cards showed **description** (belongs on deck detail only);
- learning counters were a single middot-separated line (`compact`), hard to scan on narrow cards.

No tooltips — not useful on mobile; full text lives on deck detail.

## Goal

Deck list / rail cards show **title only** (no description). Learning group counters render as three stacked lines (To learn / Practiced / Learned). Description remains on deck detail headers.

## Related Documents

```txt
docs/smoke/learning-steps.md
docs/tasks/done/05-decks-cards.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/deck-list-item.tsx
apps/mobile/src/features/decks/components/deck-learning-stats-compact.tsx
apps/mobile/src/features/public-decks/components/public-deck-list-item.tsx
apps/mobile/src/features/groups/components/group-shared-deck-list-item.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/tasks/27-learning-steps-bugfixes.md
```

## Requirements

```txt
1. Remove description from DeckListItem, PublicDeckListItem, GroupSharedDeckListItem.
2. Keep description on deck detail headers (own + public).
3. DeckLearningStatsCompact: three lines for toLearn / practiced / learned (+ due line unchanged).
4. Replace decks.learningCounters.compact with per-line i18n keys.
5. No tooltip UI.
```

## Security Requirements

```txt
- No permission or auth changes.
```

## Acceptance Criteria

```txt
- Decks rail cards show title, status, counters — not description.
- Counters appear as a vertical stack of three group lines.
- Opening a deck still shows description on detail.
- Mobile typecheck / lint / format pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Expected Commit Message

```txt
TASK-27.05 Deck list cards: title only + column learning counters
```

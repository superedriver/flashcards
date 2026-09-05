# EPIC-31 Bulk Card Add via Front Paste

## Epic Goal

Let the deck owner paste a `Front,Back` list into the Add Card Front field and walk through those cards one by one, with backend duplicate checks on every create.

This epic covers:

```txt
- Live SoT for bulk paste + pair duplicates
- Pure Front,Back parser with tests
- Duplicate lookup across the owner's live decks
- checkCardDuplicates query (paste preview)
- createCard rejects the same pair
- Add Card stays after save; in-memory bulk queue; Skip; confirm dialogs
- Smoke checklist
```

This epic does **not** include:

```txt
- CSV import changes (headers, example/notes, CSV duplicate scope)
- Edit Card paste queue
- Quoted CSV / escaping / multiline fields / header detection
- Non-ASCII separators
- Tightening Front 2000 / Back 4000 limits
- Duplicate checks on updateCard
- Persisting the bulk queue (refresh loses it)
- Merging two bulk pastes
- Native iOS/Android App Store release work beyond making paste work in Expo
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/05-decks-cards.md
docs/tasks/done/08-csv-import.md
docs/tasks/done/15-frontend-decks-cards.md
```

After TASK-31.01, also follow:

```txt
docs/domain/bulk-card-add.md
```

## Epic Prerequisites

EPIC-30 is complete (in `docs/tasks/done/`).

Expected state:

```txt
- Owner can open Add Card and createCard works
- CardForm is Tamagui/RHF; Front is a single-line field
- After create, Add Card currently navigates to deck detail (this epic changes that)
- createCard does not check duplicates yet
- CSV import is separate and stays unchanged
- Local stack: Postgres + API (:3000) + mobile
```

## Agreed Decisions (Source of Truth)

`docs/domain/bulk-card-add.md` is the live SoT after TASK-31.01. This section is the decision record used to write that document.

### Duplicate pair

```txt
Duplicate = same Front + Back after trim and case-insensitive compare.
Inner whitespace is significant. Same Front + different Back is not a duplicate.
```

### Where duplicates are searched

```txt
Only live (deletedAt is null) cards in decks the user owns (deletedAt is null).
Ignore soft-deleted cards and decks.
Ignore group/public decks the user does not own.
CSV import duplicate rules stay as they are (target deck only).
```

### When to check

```txt
Always, including a single Create Card with no bulk queue.
Backend is source of truth.
createCard rejects a duplicate.
Paste (2–100 valid rows) calls checkCardDuplicates before the queue starts.
Create Card in a queue calls checkCardDuplicates again (edited Front/Back, rest of queue, DB).
```

### Duplicate message priority

```txt
If the pair exists in the current deck: "This card is already in this deck."
Do not also name another deck.
Else if it exists in another owned live deck: name that deck title.
Else if it collides with an earlier row in the same paste/queue: in-batch duplicate.
```

### Bulk trigger

```txt
Only paste into Front on Add Card (not Edit Card, not typing).
Start bulk only if the paste has 2–100 valid rows and no invalid non-empty row.
Manual typing never starts bulk.
Web, iOS, and Android.
```

### Format (v1)

```txt
One physical line = one card: Front,Back
Exactly one ASCII comma. Front and Back required after trim.
Trim outer whitespace only. No quotes, escaping, or multiline fields.
Empty lines are ignored as cards but still count toward line numbers.
Do not treat a Front,Back header as special (it becomes a card).
Front max 2000, Back max 4000 (same as createCard).
```

### Failed bulk start

```txt
Do not start the queue. Leave the raw pasted text in Front.
Show one compact error block under Front.
Check order: format (all physical lines) → if any format error, stop (no duplicate API)
  → if valid count > 100, stop with the 100-card message
  → if valid count < 2, not bulk (raw text stays; no error block)
  → else checkCardDuplicates → if any hit, stop with per-line duplicate errors.
```

### Line numbers

```txt
Physical 1-based index in the pasted text, including empty lines.
```

### Queue

```txt
Memory only. First pair fills Front/Back. Rest stay in RAM in paste order.
Title: Add Card (N) where N includes the current card. Submit stays Create Card.
After save: persist the edited current card; queue tail unchanged; clear Example and Notes;
  load next Front/Back. After last save or Skip of the last card: empty form, no counter.
Skip: drop current, do not save, load next. Label Skip / Пропустити.
Create error: do not advance, do not shrink N, keep fields, keep queue.
```

### After Create Card (bulk or not)

```txt
Stay on Add Card with a cleared form. Do not go to deck detail.
```

### Confirms

```txt
Replace queue: paste while a queue is active.
Dirty form without a queue: confirm only if Back, Example, or Notes is dirty.
  Front-only dirty: paste replaces / may start bulk with no confirm.
Leave (Cancel, Back, gesture, tab change) while queue length > 0:
  "N unsaved cards in the queue. Leave and lose them?"
```

### i18n

```txt
All new UI strings en and uk, added in the task that introduces them.
```

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not refactor unrelated code.
4. Follow Agreed Decisions; after 31.01 follow docs/domain/bulk-card-add.md.
5. Backend is source of truth for duplicates. Frontend must not decide from a local card list.
6. Do not change CSV import.
7. Do not change updateCard duplicate policy.
8. Do not weaken auth, permissions, or the security checklist.
9. Translate any new user-facing strings (en/uk) in the task that adds them.
10. Each task’s Commands to Run must pass before commit. If blocked, stop and ask.
11. Do not push.
```

## Recommended Task Order

```txt
31.01                            live SoT
31.02                            parser + tests
31.03 → 31.04 → 31.05            repository, use case, GraphQL query
31.06                            createCard reject duplicate
31.07                            stay on Add Card after save
31.08                            duplicate copy on Create Card
31.09 → 31.10 → 31.11            paste parse, start queue, skip/advance
31.12                            confirm dialogs
31.13                            smoke
```

## Epic Summary

```md
- [x] TASK-31.01 Add live bulk-card-add source of truth
- [x] TASK-31.02 Add bulk Front,Back parser and unit tests
- [x] TASK-31.03 Add owner duplicate lookup on the card repository
- [x] TASK-31.04 Add CheckCardDuplicatesUseCase
- [x] TASK-31.05 Add checkCardDuplicates GraphQL query
- [x] TASK-31.06 Reject duplicate cards in CreateCardUseCase
- [x] TASK-31.07 Stay on Add Card after a successful create
- [x] TASK-31.08 Show duplicate errors on Create Card
- [ ] TASK-31.09 Parse Front paste into bulk rows or field errors
- [ ] TASK-31.10 Start an in-memory bulk queue after a valid paste
- [ ] TASK-31.11 Advance the bulk queue after create and skip
- [ ] TASK-31.12 Confirm replace, dirty paste, and leave with a bulk queue
- [ ] TASK-31.13 Add bulk-card-add smoke checks
```

---

# TASK-31.01 Add live bulk-card-add source of truth

## Status

DONE

## Context

Bulk Front paste and pair duplicates were agreed in chat. Live docs still describe only single-card create and CSV import.

## Goal

Write `docs/domain/bulk-card-add.md` from Agreed Decisions and point architecture + security at it.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
docs/tasks/README.md
```

## Files to Create

```txt
docs/domain/bulk-card-add.md
```

## Files to Modify

```txt
docs/architecture.md
docs/security/security-checklist.md
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Copy Agreed Decisions into bulk-card-add.md in product language.
2. architecture.md: Add Card paste bulk vs CSV; createCard duplicate rule; do not change CSV section rules.
3. security-checklist: checkCardDuplicates is authenticated, owner-only, max 100 pairs.
4. Do not rewrite docs/tasks/done/*.
5. Mark TASK-31.01 DONE.
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
- Keep CSV as a separate flow. Bulk is not confirmCsvImport.
```

## Acceptance Criteria

```txt
- A reader of live SoT knows when bulk starts, how duplicates are defined, and that createCard stays on Add Card.
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
- Do not implement the parser yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.01 Add live bulk-card-add source of truth
```

---

# TASK-31.02 Add bulk Front,Back parser and unit tests

## Status

DONE

## Context

Paste format must be deterministic before GraphQL or UI. Frontend will mirror this parser; tests live next to the domain function.

## Goal

Add a Nest-free parser in the decks domain with table-driven tests.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/src/modules/decks/domain/services/parse-bulk-card-lines.ts
apps/api/src/modules/decks/domain/services/parse-bulk-card-lines.spec.ts
apps/api/src/modules/decks/domain/services/normalize-card-pair.ts
apps/api/src/modules/decks/domain/services/normalize-card-pair.spec.ts
```

## Files to Modify

```txt
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. parseBulkCardLines(text): empty-line skip for cards; physical line numbers; exactly one ASCII comma;
   trim ends; required Front/Back; length 2000/4000; collect all format errors; valid pairs in order.
2. Classify: tooManyValid (>100), formatErrors, validPairs (2–100 only matters to callers).
3. normalizeCardPair for duplicate keys: trim + case-insensitive.
4. Tests: happy list, empty lines, two commas, missing side, >100, \r\n, inner spaces, case fold.
5. Mark TASK-31.02 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Domain only. No Nest, Prisma, or GraphQL.
```

## Implementation Notes

```txt
- Do not call the parser from a resolver in this task.
```

## Acceptance Criteria

```txt
- Invalid rows never appear in validPairs.
- API unit tests for the parser pass.
- pnpm --filter @flashcards/api build, format:check, and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- parse-bulk-card-lines normalize-card-pair
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
- Do not add GraphQL.
- Do not change CSV parser.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.02 Add bulk Front,Back parser and unit tests
```

---

# TASK-31.03 Add owner duplicate lookup on the card repository

## Status

DONE

## Context

Duplicate search needs live owned-deck cards, not the current deck list in the client cache.

## Goal

Extend CardRepositoryPort with a lookup that returns matching live cards for an owner and a list of normalized pairs.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/modules/decks/application/ports/card-repository.port.ts
apps/api/src/modules/decks/infrastructure/persistence/prisma-card.repository.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Add findLiveDuplicatesForOwner({ ownerId, pairs: { front, back }[] }).
2. Return card id, deck id, deck title, front, back for matches.
3. Filter: card.deletedAt null, deck.deletedAt null, deck.ownerId = ownerId.
4. Compare using the same normalizeCardPair rule (in SQL or in memory after a bounded fetch — prefer a precise query).
5. Mark TASK-31.03 DONE.
```

## Security Requirements

```txt
- Do not return other users’ cards.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Prisma stays in infrastructure. Port has no Prisma types.
```

## Implementation Notes

```txt
- Pairs length is at most 100 (enforced later in the use case; repository may assume that).
```

## Acceptance Criteria

```txt
- Port + Prisma implementation exist.
- Soft-deleted cards/decks are excluded.
- API build, format:check, and lint pass.
```

## Commands to Run

```bash
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
- Do not add GraphQL yet.
- Do not change createCard yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.03 Add owner duplicate lookup on the card repository
```

---

# TASK-31.04 Add CheckCardDuplicatesUseCase

## Status

DONE

## Context

Paste and Create Card need one orchestration: auth, owner, in-batch collisions, DB collisions, current-deck priority.

## Goal

Add CheckCardDuplicatesUseCase and tests. No GraphQL in this task.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/api/src/modules/decks/application/use-cases/check-card-duplicates.use-case.ts
apps/api/src/modules/decks/application/use-cases/check-card-duplicates.use-case.spec.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/decks.module.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Input: currentUser, deckId, pairs[{ front, back }] (max 100).
2. Reject unauthenticated/blocked; require canCreateCard on the deck.
3. Reject >100 pairs (VALIDATION_ERROR).
4. Normalize pairs. Detect in-batch duplicates (later index loses).
5. Lookup DB via repository. Prefer CURRENT_DECK over OTHER_DECK over IN_BATCH.
6. Result per input index: kind + deckTitle when OTHER_DECK.
7. Unit tests for the three kinds and current-deck priority.
8. Mark TASK-31.04 DONE.
```

## Security Requirements

```txt
- Operation requires authenticated user. Blocked users rejected.
- Backend enforces owner create permission.
- Do not leak other users’ deck titles.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use case must not import GraphQL or Prisma.
```

## Implementation Notes

```txt
- Parser is not required here; pairs are already split.
```

## Acceptance Criteria

```txt
- Use case tests cover current deck, other owned deck, in-batch, and no-hit.
- API build, format:check, and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- check-card-duplicates
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
- Do not add the GraphQL operation yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.04 Add CheckCardDuplicatesUseCase
```

---

# TASK-31.05 Add checkCardDuplicates GraphQL query

## Status

DONE

## Context

The mobile paste path must ask the API before starting a queue.

## Goal

Expose checkCardDuplicates and register it on DecksResolver.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/api/src/modules/decks/presentation/graphql/inputs/check-card-duplicates.input.ts
apps/api/src/modules/decks/presentation/graphql/types/check-card-duplicates-payload.type.ts
```

## Files to Modify

```txt
apps/api/src/modules/decks/presentation/graphql/resolvers/decks.resolver.ts
docs/security/security-checklist.md
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Query checkCardDuplicates(input: { deckId, pairs: [{ front, back }] }).
2. Resolver only parses input and calls the use case.
3. Auth guard. Add the operation to the security checklist protected list.
4. Mark TASK-31.05 DONE.
```

## Security Requirements

```txt
- Authenticated. Blocked users rejected.
- Frontend visibility is not security.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Resolver must not access Prisma or contain duplicate logic.
```

## Implementation Notes

```txt
- Keep payload indexes aligned with the input pairs array.
```

## Acceptance Criteria

```txt
- Authenticated owner can query; unauthorized is rejected.
- API build, format:check, and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api build
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None (human: GraphQL playground optional).
```

## Do Not Do

```txt
- Do not implement mobile paste yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.05 Add checkCardDuplicates GraphQL query
```

---

# TASK-31.06 Reject duplicate cards in CreateCardUseCase

## Status

DONE

## Context

createCard is the enforcement point even if the client skips the preview query.

## Goal

Reject a duplicate pair with CARD_DUPLICATE. Map it to GraphQL BAD_USER_INPUT + appCode.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/api/src/common/errors/error-codes.ts
apps/api/src/common/errors/map-to-graphql-error.ts
apps/api/src/modules/decks/application/use-cases/create-card.use-case.ts
apps/api/src/modules/decks/application/use-cases/create-card.use-case.spec.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Add ErrorCodes.CARD_DUPLICATE. Map to BAD_USER_INPUT.
2. After validating front/back, lookup duplicates for the owner; if any, throw CARD_DUPLICATE.
3. Prefer current-deck vs other-deck in the error message (English, for logs; UI maps appCode later).
4. Tests: duplicate in current deck, other owned deck, unique pair succeeds.
5. Mark TASK-31.06 DONE.
```

## Security Requirements

```txt
- Do not leak other users’ data in the error.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Resolver stays a pass-through.
```

## Implementation Notes

```txt
- Reuse the repository method from 31.03. One pair.
```

## Acceptance Criteria

```txt
- Duplicate createCard fails with CARD_DUPLICATE; unique still creates.
- API tests, build, format:check, and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- create-card.use-case
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
- Do not change updateCard.
- Do not change CSV confirm.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.06 Reject duplicate cards in CreateCardUseCase
```

---

# TASK-31.07 Stay on Add Card after a successful create

## Status

DONE

## Context

create-card-screen currently replace()s to deck detail. Product wants to stay and clear the form for the next card (bulk or not).

## Goal

On successful createCard, reset the form and stay on Add Card. No bulk queue yet.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/components/card-form.tsx
docs/domain/bulk-card-add.md
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Successful create does not navigate to deck detail.
2. Front, Back, Example, Notes clear. Dirty/unsaved guard resets.
3. Cancel still leaves the screen (existing unsaved confirm if dirty).
4. Mark TASK-31.07 DONE.
```

## Security Requirements

```txt
- Do not store tokens in localStorage.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Use existing createCard mutation.
```

## Implementation Notes

```txt
- CardForm may need a reset() via react-hook-form; keep Edit Card unchanged.
```

## Acceptance Criteria

```txt
- After Create Card the user is still on Add Card with empty fields.
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
None (human: add one card, confirm stay + empty form).
```

## Do Not Do

```txt
- Do not add paste/bulk yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.07 Stay on Add Card after a successful create
```

---

# TASK-31.08 Show duplicate errors on Create Card

## Status

DONE

## Context

createCard now returns CARD_DUPLICATE. Add Card still shows a generic failure.

## Goal

Before create, call checkCardDuplicates for the one pair. Show this-deck vs other-deck copy. Map CARD_DUPLICATE if the mutation still fails.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/security/security-checklist.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/graphql/check-card-duplicates.graphql
```

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Codegen checkCardDuplicates.
2. On submit: query then createCard. Block submit when the query reports a hit.
3. Copy: this deck vs “already in deck {title}”.
4. en/uk.
5. Mark TASK-31.08 DONE.
```

## Security Requirements

```txt
- Use generated Apollo hooks. Do not fetch with raw secrets.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not treat a local DeckCards cache as the duplicate SoT.
```

## Implementation Notes

```txt
- Run codegen as this package already does for other .graphql files.
```

## Acceptance Criteria

```txt
- Duplicate pair shows the agreed copy and does not create a card.
- Unique pair still creates.
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
None (human: duplicate in this deck and in another owned deck).
```

## Do Not Do

```txt
- Do not add the paste queue yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.08 Show duplicate errors on Create Card
```

---

# TASK-31.09 Parse Front paste into bulk rows or field errors

## Status

TODO

## Context

Bulk starts only on paste into Front. Format errors must not call the duplicate API.

## Goal

On paste into Front (Add Card only), parse with the same rules as 31.02. Invalid → error block, raw text stays. Valid count < 2 → normal paste. Valid 2–100 → do not start queue yet (next task). >100 → limit message.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/utils/parse-bulk-card-lines.ts
```

## Files to Modify

```txt
apps/mobile/src/features/decks/components/card-form.tsx
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Mirror API parser behavior (SoT). Typing does not parse as bulk.
2. Web, iOS, Android paste into Front.
3. Error block under Front: title + per-line format errors or the 100-card line.
4. Raw pasted text remains in Front on failure.
5. Edit Card unchanged.
6. en/uk.
7. Mark TASK-31.09 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Presentation only. No duplicate API in this task.
```

## Implementation Notes

```txt
- Prefer onPaste / clipboard string; do not start bulk from onChangeText of a single keystroke.
```

## Acceptance Criteria

```txt
- Two-comma line shows a physical line error and does not navigate away.
- One valid line stays as normal Front text.
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
None (human: paste bad list on web and one native platform).
```

## Do Not Do

```txt
- Do not call checkCardDuplicates yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.09 Parse Front paste into bulk rows or field errors
```

---

# TASK-31.10 Start an in-memory bulk queue after a valid paste

## Status

TODO

## Context

A fully valid 2–100 row paste still needs a duplicate preview. Hits must not start the queue.

## Goal

On valid paste, call checkCardDuplicates. Any hit → error block, raw text stays. No hit → queue in memory, fill first Front/Back, title Add Card (N).

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
```

## Files to Create

```txt
apps/mobile/src/features/decks/hooks/use-bulk-card-queue.ts
```

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/components/card-form.tsx
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Duplicate errors use physical line numbers and agreed copy (this deck / other deck / in-batch).
2. Queue is memory-only. Example/Notes stay empty on start.
3. Title Add Card (N) includes the current card. Submit remains Create Card.
4. Dirty Back/Example/Notes confirm is the next task; this task may no-op that confirm.
5. en/uk.
6. Mark TASK-31.10 DONE.
```

## Security Requirements

```txt
- Use the generated checkCardDuplicates hook.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not persist the queue.
```

## Implementation Notes

```txt
- If a queue is already active, leave replace-confirm to 31.12; until then ignore a second paste or keep it simple and do not merge.
```

## Acceptance Criteria

```txt
- Valid unique paste fills Front/Back and shows Add Card (N).
- Duplicate paste shows the error block and does not fill Back from the list.
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
None (human: paste 3 unique rows; paste a pair that exists in this deck).
```

## Do Not Do

```txt
- Do not implement Skip/advance yet (Create Card may still save only the first and clear everything — acceptable until 31.11).
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.10 Start an in-memory bulk queue after a valid paste
```

---

# TASK-31.11 Advance the bulk queue after create and skip

## Status

TODO

## Context

After a queue exists, Create Card and Skip must walk it without leaving Add Card.

## Goal

Successful create saves the edited current card, drops it from the queue, clears Example/Notes, loads next. Skip drops without save. Last item returns to a normal empty Add Card.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/components/card-form.tsx
apps/mobile/src/features/decks/hooks/use-bulk-card-queue.ts
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Before create, re-check duplicates (DB + remaining queue except current).
2. Create failure: no advance, N unchanged, fields kept, error shown.
3. Skip / Пропустити is a secondary text action, only while a queue is active.
4. Skip last = empty form, counter gone.
5. Mark TASK-31.11 DONE.
```

## Security Requirements

```txt
- Duplicate SoT remains the API.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Still one createCard per card. No bulk create mutation.
```

## Implementation Notes

```txt
- Re-check uses checkCardDuplicates with the edited current pair.
```

## Acceptance Criteria

```txt
- Three-card paste: save, save, save → empty Add Card, three cards in the deck.
- Skip middle card never creates it.
- Failed create keeps the same Front/Back.
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
None (human: walk a 3-card queue; Skip; force a create error).
```

## Do Not Do

```txt
- Do not add replace/leave confirms yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.11 Advance the bulk queue after create and skip
```

---

# TASK-31.12 Confirm replace, dirty paste, and leave with a bulk queue

## Status

TODO

## Context

A second paste, a dirty Back/Example/Notes, or leaving the screen can destroy an unsaved queue.

## Goal

Add the three confirms from SoT. Wire leave to the existing beforeRemove guard while a queue remains.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/decks/screens/create-card-screen.tsx
apps/mobile/src/features/decks/components/card-form.tsx
apps/mobile/src/features/decks/hooks/use-unsaved-changes-guard.ts
apps/mobile/src/i18n/resources/en/decks.ts
apps/mobile/src/i18n/resources/uk/decks.ts
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Active queue + new valid bulk paste → replace confirm. Confirm = new queue. Cancel = unchanged.
2. No queue + dirty Back/Example/Notes + bulk paste → confirm to clear those fields. Front-only dirty: no confirm.
3. Queue length > 0 on Cancel/Back/gesture/tab: leave confirm with N. Confirm clears queue and leaves.
4. en/uk.
5. Mark TASK-31.12 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not persist the queue to survive the confirm.
```

## Implementation Notes

```txt
- Reuse confirmAction. Extend the leave guard to treat “queue remaining” like dirty.
```

## Acceptance Criteria

```txt
- Replace, dirty-form, and leave dialogs match SoT.
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
None (human: replace paste, paste over dirty Back, Back with N>0).
```

## Do Not Do

```txt
- Do not merge two queues.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.12 Confirm replace, dirty paste, and leave with a bulk queue
```

---

# TASK-31.13 Add bulk-card-add smoke checks

## Status

TODO

## Context

Queue, paste, and duplicate rules are easy to regress in manual QA.

## Goal

Add a smoke checklist and a short section in MVP smoke tests.

## Related Documents

```txt
docs/tasks/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/release/mvp-smoke-tests.md
```

## Files to Create

```txt
docs/smoke/bulk-card-add.md
```

## Files to Modify

```txt
docs/release/mvp-smoke-tests.md
docs/tasks/31-bulk-card-add.md
```

## Requirements

```txt
1. Checklist: paste trigger, format errors, 100 cap, duplicates this/other/in-batch,
   queue counter, skip, stay on Add Card, leave confirm, CSV unchanged.
2. Mark TASK-31.13 and Epic Status DONE.
```

## Security Requirements

```txt
- Docs-only. Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not rewrite docs/tasks/done/*.
```

## Implementation Notes

```txt
- Manual checks remain human.
```

## Acceptance Criteria

```txt
- Smoke file exists and mvp-smoke-tests mentions bulk Front paste.
- pnpm docs:lint and format:check pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: run the new smoke against local web + one native paste).
```

## Do Not Do

```txt
- Do not add product features.
- Do not push.
```

## Expected Commit Message

```txt
TASK-31.13 Add bulk-card-add smoke checks
```

---

# Cursor Execution Rules

When working on a task in this epic, Cursor must follow these rules:

```txt
1. Read this epic and all Related Documents listed in the task first.
2. Implement only the current task. Do not start 31.02 from 31.01.
3. Do not add product features that are not in the task.
4. After 31.01, treat docs/domain/bulk-card-add.md as live SoT.
5. Do not weaken auth, permissions, or the security checklist.
6. Run all Commands to Run. Fix issues they find. Then commit with the Expected Commit Message.
7. If blocked, stop and ask.
8. Do not push.
```

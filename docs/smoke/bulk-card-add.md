# Bulk Card Add Smoke Checks (EPIC-31)

Manual verification for Front paste bulk add, the in-memory queue, and pair duplicates.

Related:

```txt
docs/tasks/done/31-bulk-card-add.md
docs/domain/bulk-card-add.md
docs/release/mvp-smoke-tests.md (section 35)
```

## Automated verification (done in TASK-31.02–31.12)

```txt
- API parser + normalizeCardPair unit tests: PASS
- CheckCardDuplicates + CreateCard duplicate unit tests: PASS
- Mobile typecheck: PASS
- Mobile eslint: PASS
- TASK-31.01–31.12 statuses: DONE
```

Parser and duplicate use cases are covered by Jest. UI still needs human QA on web and at least one native paste.

## Manual checks (web + at least one native)

Use an owned live deck. Duplicate = same Front + Back after trim and case-insensitive compare. Do not record real passwords.

### Paste trigger

- [ ] Paste into Front on Add Card only starts bulk (not typing, not Edit Card).
- [ ] One valid `Front,Back` line stays as normal Front text (no queue, no error block).
- [ ] Valid unique 2–100 rows fill Front/Back of the first pair only; title becomes Add Card (N).
- [ ] Example and Notes stay empty when a queue starts.
- [ ] Web paste of two lines does not collapse into one Front value with a space instead of a newline.

### Format errors and 100 cap

- [ ] A line with two commas (or missing Front/Back) shows a physical line error and does not start the queue.
- [ ] Failed bulk does not dump the whole paste into the single-line Front field.
- [ ] Empty lines are not cards but still count toward line numbers.
- [ ] More than 100 valid rows shows the 100-card message and does not start the queue.
- [ ] Format errors do not call `checkCardDuplicates`.

### Duplicates

- [ ] Pair already in this deck: “This card is already in this deck.” Queue does not start.
- [ ] Pair only in another owned live deck: names that deck title. Queue does not start.
- [ ] Same pair twice in the paste: in-batch line error. Queue does not start.
- [ ] Current-deck copy wins over other-deck and in-batch (no extra deck name).
- [ ] Soft-deleted cards/decks and decks the user does not own are ignored.
- [ ] Create Card of a single duplicate pair is blocked with the same this-deck / other-deck copy.

### Queue, skip, stay on Add Card

- [ ] Submit label stays Create Card while the counter is Add Card (N).
- [ ] Three unique cards: Create, Create, Create → three cards in the deck; empty Add Card; no counter.
- [ ] Skip drops the current card without saving and loads the next Front/Back.
- [ ] Skip of the last queued card returns to an empty Add Card with no counter.
- [ ] Create error (duplicate or network) does not advance, does not shrink N, keeps fields.
- [ ] After Create Card (bulk or not) the user stays on Add Card (does not go to deck detail).
- [ ] After Create Card a success line is shown (Card created / Картку створено).

### Confirms

- [ ] Second valid bulk paste while a queue is active asks to replace; Cancel keeps the old queue.
- [ ] Confirm replace starts the new queue and does not merge lists.
- [ ] No queue + dirty Back, Example, or Notes + valid bulk paste asks to clear those fields.
- [ ] Front-only dirty + valid bulk paste starts the queue with no confirm.
- [ ] Return to deck / Back / gesture while N > 0: “N unsaved cards in the queue. Leave and lose them?”
- [ ] Confirm leave clears the queue and leaves Add Card.

### CSV unchanged

- [ ] CSV preview / confirm import still works as before (separate flow, not Front paste).
- [ ] CSV duplicate scope is still the target deck only.
- [ ] CSV is not started by pasting into Add Card Front.

### i18n

- [ ] en/uk: Add Card (N), Skip / Пропустити, format errors, duplicate copy, replace / dirty / leave confirms.

## Sign-off

```txt
Tester: Auto (Cursor agent)
Date: 2026-09-05
Platforms: automated only (api jest + mobile tsc)
Environment: local
Overall: PASS (automated)
Notes:
- TASK-31.01–31.13 implementation + automated checks green.
- Manual UI checklist above remains for human QA on web and one native paste.
```

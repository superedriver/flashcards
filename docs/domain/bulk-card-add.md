# Bulk Card Add via Front Paste

## Purpose

This document defines how **Add Card** accepts a pasted `Front,Back` list and how **Front + Back** duplicates are detected.

It is the live source of truth for paste parsing, the in-memory bulk queue, and pair-duplicate checks on `createCard`.

CSV import stays a separate flow. Do not apply these rules to `previewCsvImport` / `confirmCsvImport`.

Relevant task files:

```txt
docs/tasks/31-bulk-card-add.md
docs/tasks/done/05-decks-cards.md
docs/tasks/done/08-csv-import.md
docs/tasks/done/15-frontend-decks-cards.md
docs/architecture.md
docs/domain/permissions.md
```

## Product terminology

```txt
User-facing:
  Add Card / Додати картку — the create-card screen.
  Create Card / Створити картку — submit.
  Skip / Пропустити — drop the current queued card without saving.

Technical:
  createCard, checkCardDuplicates, Front, Back.
```

## Duplicate pair

A duplicate is the same Front + Back after:

```txt
- trim outer whitespace
- case-insensitive compare
```

Inner whitespace is significant. The same Front with a different Back is not a duplicate.

## Where duplicates are searched

```txt
Only live cards (deletedAt is null) in decks the user owns (deck.deletedAt is null).
Ignore soft-deleted cards and decks.
Ignore group/public decks the user does not own.
CSV import still checks duplicates in the target deck only.
```

## When to check

```txt
Always, including a single Create Card with no bulk queue.
Backend is the source of truth.
createCard rejects a duplicate.
Paste of 2–100 valid rows calls checkCardDuplicates before the queue starts.
Create Card while a queue is active calls checkCardDuplicates again
  (edited Front/Back, remaining queue pairs, database).
updateCard does not use this rule.
```

`checkCardDuplicates` is authenticated, owner-only (`canCreateCard` on the deck), and accepts at most 100 pairs.

## Duplicate message priority

When a pair hits more than one place, use the first matching rule:

```txt
1. Current deck: "This card is already in this deck."
   Do not also name another deck.
2. Another owned live deck: say it is already in that deck’s title.
3. Earlier row in the same paste or remaining queue: in-batch duplicate.
```

## Bulk trigger

```txt
Only paste into Front on Add Card.
Not Edit Card. Not typing into Front.
Start bulk only if the paste has 2–100 valid rows and no invalid non-empty row.
Web, iOS, and Android.
```

## Format (v1)

```txt
One physical line = one card: Front,Back
Exactly one ASCII comma. Front and Back required after trim.
Trim outer whitespace only. No quotes, escaping, or multiline fields.
Empty lines are not cards but still count toward line numbers.
A line that reads Front,Back is a normal card, not a header.
Front max 2000 characters. Back max 4000 characters (same as createCard).
```

## Failed bulk start

Do not start the queue. Leave the raw pasted text in Front. Show one compact error block under Front.

Check order:

```txt
1. Format (all physical lines). If any format error: stop. Do not call the duplicate API.
2. If valid count > 100: stop. One message: at most 100 cards.
3. If valid count < 2: not bulk. Raw text stays. No error block.
4. Else checkCardDuplicates. If any hit: stop with per-line duplicate errors.
```

## Line numbers

Physical 1-based index in the pasted text, including empty lines.

## Queue

```txt
Memory only. Refresh loses the queue.
First pair fills Front and Back. The rest stay in RAM in paste order.
Page title: Add Card (N). N includes the current card.
Submit label stays Create Card.
After a successful save: keep the edited current card; leave the tail unchanged;
  clear Example and Notes; load the next Front and Back.
After the last save, or Skip of the last card: empty form, no counter, normal Add Card.
Skip: drop current, do not save, load next.
Create error: do not advance, do not shrink N, keep fields, keep the queue.
```

## After Create Card

Bulk or not:

```txt
Stay on Add Card with a cleared form (Front, Back, Example, Notes).
Dirty/unsaved guard resets with the empty form.
Do not navigate to deck detail.
```

## Confirms

```txt
Replace queue: paste while a queue is already active.
  Confirm replaces. Cancel keeps the old queue. Do not merge.
Dirty form and no queue: confirm only if Back, Example, or Notes is dirty.
  Front-only dirty: paste replaces Front / may start bulk with no confirm.
Leave (Cancel, Back, gesture, tab change) while queue length > 0:
  N unsaved cards in the queue. Leave and lose them?
```

## Permissions

```txt
Add Card, checkCardDuplicates, and createCard require an authenticated owner
(or the same canCreateCard rule as today).
Blocked users are rejected.
Frontend visibility is UX only.
```

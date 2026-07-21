# Learning Steps Smoke Checks (EPIC-26)

Manual + automated verification checklist for learning steps (replaces SM-2 review flow).

Related:

```txt
docs/tasks/26-learning-steps.md
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
```

## Automated verification

```txt
- packages/srs learning-steps unit tests: PENDING
- API lesson / review / home-start / progress suites: PENDING
- Mobile typecheck: PENDING
- Mobile eslint: PENDING
- TASK-26.01–26.18 statuses: PENDING
```

## Manual checks (web + at least one native)

Run against local or staging API after learning-steps migration.

### Migration / state

- [ ] Existing users’ review states reset to step 0 / due now / count 0 after migrate.
- [ ] Creating a card creates `CardReviewState` for the owner (step 0).
- [ ] CSV import / copy deck / preview approve create review states for new cards.

### Groups & counters

- [ ] Home shows aggregate **To learn / Practiced / Learned** for active target (own decks only).
- [ ] Decks list shows per-deck counters.
- [ ] Deck detail card rows show group badges; lesson UI does **not** show group badges.

### Home START

- [ ] Home has counters + START (no deck list).
- [ ] START pulls due cards across multiple own decks of active target (limit = lessonSize).
- [ ] Public/group decks are not included until copied into own.
- [ ] Empty: zero cards → add-cards CTA; has cards but none due → no-review-now CTA.

### Deck lesson

- [ ] Deck detail **Start lesson** still starts a single-deck session.
- [ ] Know / Don't know update step and dueAt per algorithm (spot-check 0→1 = +90s).

### Prompt direction

- [ ] Steps 0–2: front first.
- [ ] Steps 5–7: back first.
- [ ] Steps 3 / 4 / 8: direction can differ across attempts (random).

### Re-queue

- [ ] After a short-interval Know, the same card can reappear later in the same session once due (no countdown UI).
- [ ] When nothing is due, lesson completes / shows empty without waiting.

### i18n

- [ ] en/uk strings for groups and Home empty CTAs.

## Sign-off

```txt
Tester:
Date:
Platforms:
Environment:
Overall: PENDING
Notes:
```

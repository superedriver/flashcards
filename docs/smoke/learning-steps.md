# Learning Steps Smoke Checks (EPIC-26)

Manual + automated verification checklist for learning steps (replaces SM-2 review flow).

Related:

```txt
docs/tasks/done/26-learning-steps.md
docs/algorithms/learning-steps.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
```

## Automated verification (done in TASK-26.20)

```txt
- packages/srs learning-steps unit tests: PASS (39)
- API lesson / review / home-start / progress suites: PASS (55)
- API build: PASS
- Mobile typecheck: PASS
- Mobile eslint: PASS
- Root format:check + lint: PASS
- TASK-26.01–26.19 statuses: DONE
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

### Home Start review

- [ ] Home has Due now hero + 📖/✏️/✅ stats + Start review (no deck list).
- [ ] Start review pulls due cards across multiple own decks of active target (limit = lessonSize).
- [ ] Public/group decks are not included until copied into own.
- [ ] Empty: zero cards → add-cards CTA; has cards but none due → no-review-now CTA.

### Deck lesson

- [ ] Deck detail **Start lesson** still starts a single-deck session.
- [ ] Know / Don't know update step and dueAt per algorithm (spot-check 0→1 = +90s).

### Presentation mode

- [ ] Steps 0–2: `TARGET_TEXT_AUDIO` (target text, auto-speak, 🔊).
- [ ] Steps 3–4: mix of `TARGET_TEXT_AUDIO` and `SOURCE_TEXT` across attempts.
- [ ] Steps 5–8: mix of `SOURCE_TEXT` and `TARGET_AUDIO_ONLY` across attempts.
- [ ] Full presentation-mode, speak, and Can’t listen checklist:
      [docs/smoke/review-presentation.md](./review-presentation.md).

### Re-queue

- [ ] After a short-interval Know, the same card can reappear later in the same session once due (no countdown UI).
- [ ] When nothing is due, lesson completes / shows empty without waiting.

### i18n

- [ ] en/uk strings for groups and Home empty CTAs.

## Sign-off

```txt
Tester: Auto (Cursor agent)
Date: 2026-07-24
Platforms: automated only (srs + api jest + mobile tsc/eslint)
Environment: local
Overall: PASS (automated)
Notes:
- All TASK-26.01–26.20 implementation + automated checks green.
- Manual device/UI smoke checklist above remains for human QA on web/native
  after applying Phase A/B migrations.
- Algorithm, Home START, nextCard, and group counters covered by unit suites.
```

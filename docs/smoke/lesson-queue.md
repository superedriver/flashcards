# Lesson Queue Smoke Checks (EPIC-29)

Manual + automated verification for Home snapshot vs owned-deck live queue.

Related:

```txt
docs/tasks/29-lesson-queue.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
```

## Automated verification (done in TASK-29.02–29.10)

```txt
- Lesson-queue picker unit tests: PASS
- StartLesson / StartHomeLesson / SubmitReview use-case tests: PASS
- API build: PASS
- Mobile typecheck: PASS
- Root format:check + lint: PASS
- TASK-29.01–29.10 statuses: DONE
```

Picker, start, and submit-review rules are covered by Jest. UI still needs human QA on web and at least one native build.

## Manual checks (web + at least one native)

Apply `StudySession` snapshot/queueState migration first. Use own decks only; do not record real passwords.

### Home snapshot cap

- [ ] Home START uses `UserSettings.lessonSize` unique ready cards from own decks of the active target.
- [ ] Extra ready cards that were not in the snapshot never appear in that session.
- [ ] Cards in the snapshot may repeat if they become ready again (max 3 shows).
- [ ] Home START is hidden when `dueCount = 0`.

### Deck live join

- [ ] Owned deck Start has no lessonSize cap; newly ready cards of that deck can join mid-session.
- [ ] Start is shown only for the owner when `dueCount > 0`.
- [ ] Owner with zero due cards does not see Start.
- [ ] Non-owner of a public/group deck does not see Start (copy remains the study path).

### Queue rules

- [ ] A cardId is shown at most 3 times in one session.
- [ ] After answering A, other cards fill the frozen gap; if no other ready/showable cards exist, the gap shrinks and A can show again if still ready.
- [ ] Review screen has no progress bar and no “card X of Y”.

### Leave and summary

- [ ] Confirmed leave calls `abandonLesson`, does not open summary, and next Start is a new session.
- [ ] Completing when nothing is showable opens summary; Know / Don't know counts are attempts (repeats included).

### i18n

- [ ] en/uk Start / leave / summary strings still present on Home and deck detail.

## Sign-off

```txt
Tester: Auto (Cursor agent)
Date: 2026-08-19
Platforms: automated only (api jest + mobile tsc)
Environment: local
Overall: PASS (automated)
Notes:
- TASK-29.01–29.11 implementation + automated checks green.
- Manual UI checklist above remains for human QA on web/native
  after applying the lesson-queue Prisma migration.
```

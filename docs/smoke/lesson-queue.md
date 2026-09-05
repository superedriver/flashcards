# Lesson Queue Smoke Checks (EPIC-29)

Manual + automated verification for Home snapshot vs owned-deck live queue.

Related:

```txt
docs/tasks/done/29-lesson-queue.md
docs/tasks/30-sot-discrepancies.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
```

## Automated verification (done in TASK-29.02–29.10, TASK-30.02–30.03)

```txt
- Lesson-queue picker unit tests: PASS
- StartLesson / StartHomeLesson / SubmitReview use-case tests: PASS
- API build: PASS
- Mobile typecheck: PASS
- Root format:check + lint: PASS
- TASK-29.01–29.11 and TASK-30.01–30.03 statuses: DONE
```

Picker, start, and submit-review rules are covered by Jest. UI still needs human QA on web and at least one native build.

## Manual checks (web + at least one native)

Apply `StudySession` snapshot/queueState migration first. Use own decks only; do not record real passwords.

### Home snapshot cap

- [ ] Home Start review uses `UserSettings.lessonSize` unique ready cards from own decks of the active target.
- [ ] Extra ready cards that were not in the snapshot never appear in that session.
- [ ] Cards in the snapshot may repeat if they become ready again (max 3 answers).
- [ ] Home Start review is hidden when `dueCount = 0`.

### Deck live join

- [ ] Owned deck Start has no lessonSize cap; newly ready cards of that deck can join mid-session.
- [ ] Own My Decks cards show Start review in the footer when `dueCount > 0`; Start review starts the owned-deck review without opening detail. Tap card still opens detail.
- [ ] Start is shown only for the owner when `dueCount > 0` (Own cards + deck detail).
- [ ] Owner with zero due cards does not see Start.
- [ ] Non-owner of a public/group deck does not see Start (copy remains the study path). No Start on Group / Public / No language cards.

### Queue rules

- [ ] A cardId is answered at most 3 times in one session (display without an answer does not count).
- [ ] Display, answer, and freeze N are separate: showing A does not freeze N; answering A does.
- [ ] Cards that become due between display of A and the answer of A count toward N
      (example: show A with only B ready; C and D due before the answer → N = 3 → A, B, C, D, A).
- [ ] After answering A, other **answered** cards fill the frozen gap; display without an answer
      does not fill it. If no other ready/showable cards exist, the gap shrinks and A can show
      again if still ready.
- [ ] Review screen has no progress bar and no “card X of Y”.

### Leave and summary

- [ ] Confirmed leave calls `abandonLesson`, does not open summary, and next Start is a new session.
- [ ] Completing when nothing is showable opens summary; no Cards in this review / Know / Don't know / Known % on that screen.
- [ ] Empty `/lessons/start` (dueCount 0) shows No cards due, not Start review; Back to deck primary; All decks text.

### i18n

- [ ] en/uk Start / leave / summary use Review / Повторення, not Lesson / Урок.
- [ ] Summary completion title is "Review complete" / "Повторення завершено".

## Sign-off

```txt
Tester: Auto (Cursor agent)
Date: 2026-08-19
Platforms: automated only (api jest + mobile tsc)
Environment: local
Overall: PASS (automated)
Notes:
- TASK-29.01–29.11 and TASK-30.01–30.03 implementation + automated checks green.
- Manual UI checklist above remains for human QA on web/native
  after applying the lesson-queue Prisma migration.
```

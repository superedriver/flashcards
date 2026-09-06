# Review Presentation Smoke Checks (EPIC-32)

Manual verification for step-based review presentation modes, speak/🔊, and Can’t listen.

Related:

```txt
docs/tasks/done/32-review-presentation-modes.md
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/release/mvp-smoke-tests.md (section 36)
```

## Automated verification (done in TASK-32.02–32.08)

```txt
- packages/srs presentation-mode + effective-mapping tests: PASS
- API start-lesson / start-home-lesson / submit-review / disable-audio-only tests: PASS
- API build: PASS
- Mobile typecheck: PASS
- Root format:check + lint: PASS
- TASK-32.01–32.08 statuses: DONE
```

SRS mapping, GraphQL `presentationMode`, and `disableAudioOnly` are covered by unit tests. UI still needs human QA on web and at least one native review.

## Manual checks (web + at least one native)

Apply the `StudySession.audioOnlyDisabled` migration first. Use an owned deck with cards across learning steps. Do not record real passwords.

### Step table (base mode)

- [ ] Steps 0–2: `TARGET_TEXT_AUDIO` (target text, auto-speak, 🔊).
- [ ] Steps 3–4: mix of `TARGET_TEXT_AUDIO` and `SOURCE_TEXT` across attempts (about 50/50).
- [ ] Steps 5–8: mix of `SOURCE_TEXT` and `TARGET_AUDIO_ONLY` across attempts (about 50/50).
- [ ] `TARGET_TEXT` never appears from the step table alone (only after Can’t listen).

### Four effective modes

- [ ] `TARGET_TEXT_AUDIO`: question is target text; flip shows source only.
- [ ] `SOURCE_TEXT`: question is source text; flip shows target text.
- [ ] `TARGET_AUDIO_ONLY`: question is a large speaker (no target text); flip shows source only.
- [ ] `TARGET_TEXT`: question is target text with no auto-speak and no 🔊; flip shows source only.

### Speak and 🔊

- [ ] `TARGET_TEXT_AUDIO`: auto-speaks the target on the question; 🔊 replays; no speak after flip.
- [ ] `SOURCE_TEXT`: no speak/🔊 on the question; after flip, target text with no speak and no 🔊.
- [ ] `TARGET_AUDIO_ONLY`: auto-speaks on the question; 🔊 replays only (does not flip); no speak after flip.
- [ ] `TARGET_TEXT`: never auto-speaks and never shows 🔊.
- [ ] A new utterance stops the previous one.

### Flip

- [ ] Tap/click the card flips; 🔊 does not flip.
- [ ] Know / Don’t know still require the answer side and still advance the queue as before.

### Can’t listen

- [ ] The text action Can’t listen / Не можу прослухати is only on `TARGET_AUDIO_ONLY` and only before reveal.
- [ ] It does not flip, does not submit Know/Don’t know, and does not change learning step or queue.
- [ ] After success, the same card stays unrevealed and becomes `TARGET_TEXT` (target text appears).
- [ ] Later `TARGET_AUDIO_ONLY` in this session is returned as `TARGET_TEXT`.
- [ ] `TARGET_TEXT_AUDIO` still speaks on the question after the flag is set; `SOURCE_TEXT` still never speaks.
- [ ] A new review session can show audio-only again (`audioOnlyDisabled` defaults false).
- [ ] TTS/autoplay failure does not auto-call Can’t listen.

### Queue and SRS unchanged

- [ ] Know / Don’t know intervals, max-3-answers, Home snapshot, and deck live join still match lesson-queue / learning-steps smoke.
- [ ] The client does not infer mode from `learningStep`; it only renders `presentationMode`.

### i18n

- [ ] en/uk: Can’t listen / Не можу прослухати.

## Sign-off

```txt
Tester: Auto (Cursor agent)
Date: 2026-09-05
Platforms: automated only (srs + api jest + mobile tsc)
Environment: local
Overall: PASS (automated)
Notes:
- TASK-32.01–32.09 implementation + automated checks green.
- Manual UI checklist above remains for human QA on web and one native review
  after applying the StudySession.audioOnlyDisabled migration.
```

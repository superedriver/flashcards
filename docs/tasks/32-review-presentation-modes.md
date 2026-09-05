# EPIC-32 Review Presentation Modes

## Epic Goal

Show review cards in step-based presentation modes so the learner moves from seeing-and-hearing the target word, to recalling it from the source, to listening without text.

This epic covers:

```txt
- Live SoT for ReviewPresentationMode (base vs effective)
- SRS base-mode resolver (replaces promptDirection)
- Session audioOnlyDisabled flag and TARGET_TEXT fallback
- GraphQL presentationMode on LessonCard; remove promptDirection
- disableAudioOnly mutation
- Review UI renders effective mode only (no FRONT_TO_BACK / BACK_TO_FRONT)
- TARGET_AUDIO_ONLY layout + Can’t listen
- Smoke checklist
```

This epic does **not** include:

```txt
- Changing learning-step intervals, Know / Don’t know transitions, or long-review counts
- Changing the lesson queue, Home snapshot, gap freeze, or max-3-answers
- A new TTS provider (keep expo-speech)
- Persisting audioOnlyDisabled across sessions or on the user
- Auto-disabling audio-only when the browser blocks autoplay
- Offline review, extra answer buttons, or progress counters
- Edit Card / Add Card presentation
```

## Epic Status

TODO

## Related Documents

Cursor must read these documents before working on this epic:

```txt
docs/architecture.md
docs/backend-clean-architecture.md
docs/domain/permissions.md
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/security/security-checklist.md
docs/tasks/README.md
docs/tasks/cursor-task-template.md
docs/tasks/done/26-learning-steps.md
docs/tasks/done/29-lesson-queue.md
docs/tasks/done/30-sot-discrepancies.md
```

After TASK-32.01, also follow the updated:

```txt
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
```

## Epic Prerequisites

EPIC-31 is complete (in `docs/tasks/done/`).

Expected state:

```txt
- Review uses promptDirection FRONT_TO_BACK / BACK_TO_FRONT
- UI derives prompt/answer and speak from promptDirection + front/back
- Speak: auto-speak target when that side is visible; 🔊 to replay
- Learning steps 0–8, submitReview, and the queue work
- StudySession has no audioOnlyDisabled field
- Local stack: Postgres + API (:3000) + mobile
```

## Agreed Decisions (Source of Truth)

After TASK-32.01, `docs/domain/lesson-flow.md` and `docs/algorithms/learning-steps.md` are the live SoT. This section is the decision record used to write those updates.

### Modes (effective — what the UI renders)

```txt
TARGET_TEXT_AUDIO
  Question: target text, auto-speak, 🔊 replay.
  Tap/click card: flip. Answer: source only. No speak on source.

SOURCE_TEXT
  Question: source text, no speak, no 🔊.
  Tap/click card: flip. Answer: target text, auto-speak, 🔊 replay.

TARGET_AUDIO_ONLY
  Question: speaker icon (no target text), auto-speak, 🔊 replay.
  Tap/click card: flip. Answer: source only.
  “Can’t listen” / “Не можу прослухати” is a separate text action under the card,
  only while the question side is showing.

TARGET_TEXT
  Session fallback only. Never produced by the SRS step table.
  Question: target text, no auto-speak, no 🔊.
  Tap/click card: flip. Answer: source only.
```

Card `front` remains target; `back` remains source. The UI must switch on `presentationMode`, not on FRONT_TO_BACK / BACK_TO_FRONT.

### Base mode (SRS)

Resolved per attempt from `learningStep` + `randomBit` (same 50/50 service as today). Do not persist the choice. Resolve again when the same card is shown later in the session (`nextCard`).

```txt
Steps 0–2: TARGET_TEXT_AUDIO
Steps 3–4: 50% TARGET_TEXT_AUDIO / 50% SOURCE_TEXT
           randomBit 0 → TARGET_TEXT_AUDIO
           randomBit 1 → SOURCE_TEXT
Steps 5–8: 50% SOURCE_TEXT / 50% TARGET_AUDIO_ONLY
           randomBit 0 → SOURCE_TEXT
           randomBit 1 → TARGET_AUDIO_ONLY
```

`calculateNextLearningState` is unchanged.

### Effective mode (session resolver)

SRS returns the **base** mode. The lesson/session layer maps to **effective** mode using `StudySession.audioOnlyDisabled`. GraphQL sends only the effective mode.

```txt
audioOnlyDisabled = false
  TARGET_TEXT_AUDIO → TARGET_TEXT_AUDIO
  SOURCE_TEXT       → SOURCE_TEXT
  TARGET_AUDIO_ONLY → TARGET_AUDIO_ONLY

audioOnlyDisabled = true
  TARGET_TEXT_AUDIO → TARGET_TEXT_AUDIO
  SOURCE_TEXT       → SOURCE_TEXT
  TARGET_AUDIO_ONLY → TARGET_TEXT
```

The flag disables the listening **task**, not pronunciation help. TARGET_TEXT_AUDIO and SOURCE_TEXT (including speak-after-flip) stay as they are.

### Can’t listen

```txt
Not an answer. Does not flip. Does not change learning step or queue.
Current card: question side stays; mode becomes TARGET_TEXT (target text appears).
Set audioOnlyDisabled = true on this ACTIVE StudySession.
Later TARGET_AUDIO_ONLY in this session → TARGET_TEXT.
New session: audioOnlyDisabled defaults to false; audio-only is available again.
Do not auto-set the flag when TTS/autoplay fails.
```

### Speak (UI, from effective mode only)

```txt
Speak only for TARGET_TEXT_AUDIO (question) and TARGET_AUDIO_ONLY (question),
and for SOURCE_TEXT after flip (target answer).
TARGET_TEXT: never speak, no 🔊.
Stop previous speech before a new utterance. TTS = expo-speech + deck targetLanguage.
```

### GraphQL

```txt
LessonCard.presentationMode: ReviewPresentationMode
  TARGET_TEXT_AUDIO | SOURCE_TEXT | TARGET_AUDIO_ONLY | TARGET_TEXT
Remove LessonCard.promptDirection and the PromptDirection enum from the lesson payload.
disableAudioOnly(input: { sessionId, cardId }) → current LessonCard with effective mode.
```

### i18n

```txt
All new UI strings en and uk, added in the task that introduces them.
Can’t listen / Не можу прослухати.
```

## Epic Rules

```txt
1. One task = one focused commit. Do not combine tasks.
2. Do not start the next task until the current task is Status DONE and committed.
3. Do not refactor unrelated code.
4. Follow Agreed Decisions; after 32.01 follow lesson-flow.md + learning-steps.md.
5. UI must not decide the mode. It only renders presentationMode from the API.
6. Do not change learning-step formulas, submitReview scheduling, or queue rules.
7. Do not weaken auth, permissions, or the security checklist.
8. Translate any new user-facing strings (en/uk) in the task that adds them.
9. Each task’s Commands to Run must pass before commit. If blocked, stop and ask.
10. Do not push.
```

## Recommended Task Order

```txt
32.01                            live SoT
32.02                            SRS base-mode resolver
32.03                            effective-mode helper
32.04                            Prisma audioOnlyDisabled
32.05                            start/submit + GraphQL presentationMode
32.06                            mobile renders modes
32.07                            disableAudioOnly mutation
32.08                            TARGET_AUDIO_ONLY UI + Can’t listen
32.09                            smoke
```

## Epic Summary

```md
- [x] TASK-32.01 Add live review-presentation source of truth
- [ ] TASK-32.02 Add resolveReviewPresentationMode in SRS
- [ ] TASK-32.03 Add effective presentation-mode mapping
- [ ] TASK-32.04 Add audioOnlyDisabled on StudySession
- [ ] TASK-32.05 Return presentationMode from lesson start and submit
- [ ] TASK-32.06 Render review cards from presentationMode
- [ ] TASK-32.07 Add disableAudioOnly mutation
- [ ] TASK-32.08 Add audio-only review UI and Can’t listen
- [ ] TASK-32.09 Add review-presentation smoke checks
```

---

# TASK-32.01 Add live review-presentation source of truth

## Status

DONE

## Context

Review still documents promptDirection. Product agreed on ReviewPresentationMode, TARGET_TEXT fallback, and audioOnlyDisabled.

## Goal

Replace the Prompt Direction sections in live SoT with presentation modes. Point architecture at the new contract.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
docs/domain/lesson-flow.md
docs/algorithms/learning-steps.md
docs/architecture.md
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. Copy Agreed Decisions into lesson-flow.md (modes, speak, Can’t listen, GraphQL).
2. Replace Prompt Direction in learning-steps.md with base-mode table + effective mapping.
3. architecture.md lesson flow: question/answer and speak come from presentationMode.
4. Do not rewrite docs/tasks/done/*.
5. Mark TASK-32.01 DONE.
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
- Keep front = target and back = source as card fields.
- State clearly that GraphQL returns effective mode only.
```

## Acceptance Criteria

```txt
- A reader knows the four modes, the step table, and that Can’t listen is not an answer.
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
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.01 Add live review-presentation source of truth
```

---

# TASK-32.02 Add resolveReviewPresentationMode in SRS

## Status

TODO

## Context

`resolvePromptDirection` still returns FRONT_TO_BACK / BACK_TO_FRONT. Base presentation must live in `@flashcards/srs` so the API does not invent step rules.

## Goal

Add `resolveReviewPresentationMode({ learningStep, randomBit })` and tests. Keep `resolvePromptDirection` until TASK-32.05 so the API still builds.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/algorithms/learning-steps.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
packages/srs/src/types.ts
packages/srs/src/learning-steps.ts
packages/srs/src/learning-steps.test.ts
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. Add ReviewPresentationMode union including TARGET_TEXT.
2. resolveReviewPresentationMode never returns TARGET_TEXT.
3. Implement the agreed step table and randomBit mapping.
4. Tests for 0–2, 3–4, 5–8, and invalid step/randomBit.
5. Mark TASK-32.02 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Pure package. No Nest, Prisma, or GraphQL.
- Do not change calculateNextLearningState.
```

## Implementation Notes

```txt
- Leave resolvePromptDirection in place for this task.
```

## Acceptance Criteria

```txt
- SRS unit tests for the new resolver pass.
- Existing learning-steps tests still pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs test
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not change GraphQL yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.02 Add resolveReviewPresentationMode in SRS
```

---

# TASK-32.03 Add effective presentation-mode mapping

## Status

TODO

## Context

The session flag must not live in scheduling math, but the AUDIO_ONLY → TARGET_TEXT map is a pure function the use cases will call.

## Goal

Add `toEffectivePresentationMode(base, audioOnlyDisabled)` next to the SRS resolver, with tests.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/algorithms/learning-steps.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
packages/srs/src/learning-steps.ts
packages/srs/src/learning-steps.test.ts
packages/srs/src/index.ts
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. If audioOnlyDisabled and base is TARGET_AUDIO_ONLY → TARGET_TEXT.
2. All other bases pass through unchanged (including TARGET_TEXT_AUDIO).
3. Table-driven tests for both flag values and every base mode.
4. Mark TASK-32.03 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Pure function. No session entity, Nest, or Prisma.
```

## Implementation Notes

```txt
- Use cases are still on promptDirection; this task only adds the helper.
```

## Acceptance Criteria

```txt
- Mapping matches Agreed Decisions.
- SRS tests pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs test
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not add Prisma yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.03 Add effective presentation-mode mapping
```

---

# TASK-32.04 Add audioOnlyDisabled on StudySession

## Status

TODO

## Context

Can’t listen is session-scoped. The flag must persist for the ACTIVE row and default off on a new session.

## Goal

Add `audioOnlyDisabled Boolean @default(false)` on StudySession and thread it through the domain type, mapper, and repository.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/backend-clean-architecture.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
apps/api/prisma/migrations/<timestamp>_study_session_audio_only_disabled/migration.sql
```

## Files to Modify

```txt
apps/api/prisma/schema.prisma
apps/api/src/modules/lessons/domain/types/study-session.type.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session.mapper.ts
apps/api/src/modules/lessons/infrastructure/mappers/study-session.mapper.spec.ts
apps/api/src/modules/lessons/application/ports/study-session-repository.port.ts
apps/api/src/modules/lessons/infrastructure/persistence/prisma-study-session.repository.ts
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. Default false. Existing rows get false.
2. Mapper round-trips the field.
3. Repository create sets false; add updateAudioOnlyDisabled({ id, audioOnlyDisabled }) or equivalent.
4. Mark TASK-32.04 DONE.
```

## Security Requirements

```txt
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Prisma stays in infrastructure. Port has no Prisma types.
```

## Implementation Notes

```txt
- Do not call the flag from start/submit yet.
```

## Acceptance Criteria

```txt
- prisma validate + generate succeed.
- API build, format:check, and lint pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api exec prisma validate
pnpm --filter @flashcards/api exec prisma generate
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
- Do not change GraphQL yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.04 Add audioOnlyDisabled on StudySession
```

---

# TASK-32.05 Return presentationMode from lesson start and submit

## Status

TODO

## Context

Start and nextCard still attach promptDirection. The payload must carry effective presentationMode so the client can stop using FRONT_TO_BACK.

## Goal

Resolve base mode, apply toEffectivePresentationMode with the session flag, return `presentationMode` on LessonCard. Remove `promptDirection` from the application type, GraphQL LessonCard, and `@flashcards/srs` exports used by the API.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/domain/lesson-flow.md
docs/backend-clean-architecture.md
docs/security/security-checklist.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
packages/srs/src/types.ts
packages/srs/src/learning-steps.ts
packages/srs/src/learning-steps.test.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.ts
apps/api/src/modules/lessons/application/use-cases/start-home-lesson.use-case.spec.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.ts
apps/api/src/modules/lessons/application/use-cases/submit-review.use-case.spec.ts
apps/api/src/modules/lessons/presentation/graphql/types/learning-enums.type.ts
apps/api/src/modules/lessons/presentation/graphql/types/lesson-card.type.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. New sessions use audioOnlyDisabled false (so AUDIO_ONLY can appear).
2. nextCard uses the session’s current flag.
3. GraphQL enum ReviewPresentationMode; field presentationMode; delete PromptDirection from LessonCard.
4. Delete resolvePromptDirection once nothing imports it.
5. Tests: step 0 → TARGET_TEXT_AUDIO; step 6 with randomBit 1 → TARGET_AUDIO_ONLY when flag false;
   same card → TARGET_TEXT when flag true.
6. Mark TASK-32.05 DONE.
```

## Security Requirements

```txt
- startLesson / startHomeLesson / submitReview stay authenticated.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Resolver stays a pass-through.
- Do not change queue selection or calculateNextLearningState.
```

## Implementation Notes

```txt
- Mobile will not typecheck against the new schema until 32.06; this task is API + SRS.
- Random bit service may keep its current class name.
```

## Acceptance Criteria

```txt
- API lesson tests pass. promptDirection is gone from LessonCard GraphQL.
- Unique pairs still schedule as before.
```

## Commands to Run

```bash
pnpm --filter @flashcards/srs test
pnpm --filter @flashcards/api test -- start-lesson start-home-lesson submit-review
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
- Do not add disableAudioOnly yet.
- Do not change queue math.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.05 Return presentationMode from lesson start and submit
```

---

# TASK-32.06 Render review cards from presentationMode

## Status

TODO

## Context

Mobile still maps prompt/answer and speak from promptDirection. After 32.05 the schema field is presentationMode.

## Goal

Codegen, replace promptDirection on the client, and render question/answer/speak from effective presentationMode. Audio-only may still be a blank prompt plus 🔊 until 32.08.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/graphql/lessons.graphql
apps/mobile/src/features/lessons/types/active-lesson.ts
apps/mobile/src/features/lessons/utils/map-lesson-card.ts
apps/mobile/src/features/lessons/utils/get-review-sides.ts
apps/mobile/src/features/lessons/hooks/use-review-speech.ts
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/graphql/generated/index.ts
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. Fragment requests presentationMode, not promptDirection.
2. getReviewSides (or replacement) switches on presentationMode:
   TARGET_* → prompt front / answer back; SOURCE_TEXT → prompt back / answer front.
   TARGET_AUDIO_ONLY prompt text may be empty this task.
3. Speak rules from Agreed Decisions. TARGET_TEXT: no speak, no 🔊.
4. Mark TASK-32.06 DONE.
```

## Security Requirements

```txt
- Use generated Apollo hooks. Do not store tokens in localStorage.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not infer mode from learningStep on the client.
```

## Implementation Notes

```txt
- Keep tap-to-flip and swipe answers.
- Large speaker + Can’t listen wait for 32.08.
```

## Acceptance Criteria

```txt
- Mobile typecheck and lint pass.
- SOURCE_TEXT and TARGET_TEXT_AUDIO match the agreed sides and speak behavior.
```

## Commands to Run

```bash
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None (human: one TARGET_TEXT_AUDIO and one SOURCE_TEXT card).
```

## Do Not Do

```txt
- Do not call disableAudioOnly yet.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.06 Render review cards from presentationMode
```

---

# TASK-32.07 Add disableAudioOnly mutation

## Status

TODO

## Context

The client cannot set the session flag itself. The API must persist audioOnlyDisabled and return the current card’s effective mode.

## Goal

Add authenticated `disableAudioOnly(input: { sessionId, cardId })` that sets the flag on the caller’s ACTIVE session and returns that LessonCard with effective presentationMode.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/domain/lesson-flow.md
docs/security/security-checklist.md
docs/backend-clean-architecture.md
```

## Files to Create

```txt
apps/api/src/modules/lessons/application/use-cases/disable-audio-only.use-case.ts
apps/api/src/modules/lessons/application/use-cases/disable-audio-only.use-case.spec.ts
apps/api/src/modules/lessons/presentation/graphql/inputs/disable-audio-only.input.ts
```

## Files to Modify

```txt
apps/api/src/modules/lessons/lessons.module.ts
apps/api/src/modules/lessons/presentation/graphql/resolvers/lessons.resolver.ts
docs/security/security-checklist.md
apps/mobile/src/features/lessons/graphql/lessons.graphql
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. Reject unauthenticated/blocked users. Session must be ACTIVE and owned by currentUser.
2. cardId must belong to the session (queue/snapshot). Otherwise NOT_FOUND / FORBIDDEN as existing lesson errors do.
3. Set audioOnlyDisabled true (idempotent).
4. Return the LessonCard for cardId with effective mode (AUDIO_ONLY → TARGET_TEXT).
5. Do not record a review, do not advance the queue, do not change learning step.
6. Add the operation to the security checklist protected list.
7. Codegen the mobile mutation (UI button is 32.08).
8. Mark TASK-32.07 DONE.
```

## Security Requirements

```txt
- Authenticated. Blocked users rejected.
- Backend enforces session ownership.
- Frontend visibility is not security.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Resolver must not access Prisma or contain mapping logic.
```

## Implementation Notes

```txt
- Reuse the same LessonCard mapper as start/submit.
```

## Acceptance Criteria

```txt
- Use case tests: happy path, already true, other user’s session, completed session.
- API build and mobile typecheck pass.
```

## Commands to Run

```bash
pnpm --filter @flashcards/api test -- disable-audio-only
pnpm --filter @flashcards/api build
pnpm --filter @flashcards/mobile typecheck
pnpm format:check
pnpm lint
```

## Manual Checks

```txt
None
```

## Do Not Do

```txt
- Do not treat Can’t listen as Know/Don’t know.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.07 Add disableAudioOnly mutation
```

---

# TASK-32.08 Add audio-only review UI and Can’t listen

## Status

TODO

## Context

TARGET_AUDIO_ONLY still looks like an empty flashcard. Product wants a speaker icon, replay 🔊, and Can’t listen that calls disableAudioOnly.

## Goal

Audio-only question layout; Can’t listen; after success, replace the current card with the returned LessonCard (TARGET_TEXT, still unrevealed).

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/domain/lesson-flow.md
```

## Files to Create

```txt
None
```

## Files to Modify

```txt
apps/mobile/src/features/lessons/components/review-flashcard.tsx
apps/mobile/src/features/lessons/screens/lesson-review-screen.tsx
apps/mobile/src/i18n/resources/en/lessons.ts
apps/mobile/src/i18n/resources/uk/lessons.ts
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. TARGET_AUDIO_ONLY question: large speaker in the card, no target text, tap card still flips to source.
2. 🔊 still replays only; it does not flip.
3. Can’t listen / Не можу прослухати under the card, only for TARGET_AUDIO_ONLY and only before reveal.
4. On success: do not flip; show TARGET_TEXT for this card; later cards follow the API.
5. en/uk.
6. Mark TASK-32.08 DONE.
```

## Security Requirements

```txt
- Use the generated mutation hook.
- Do not commit secrets.
```

## Architecture Constraints

```txt
- Do not set a local “audio off” flag as the source of truth after the mutation returns.
```

## Implementation Notes

```txt
- Leave review, skip, and answer actions unchanged besides the new text action.
```

## Acceptance Criteria

```txt
- Audio-only is distinguishable from TARGET_TEXT.
- Can’t listen does not submit Know/Don’t know.
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
None (human: audio-only card, replay, Can’t listen, then a later AUDIO_ONLY in the same session).
```

## Do Not Do

```txt
- Do not auto-call the mutation when TTS fails.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.08 Add audio-only review UI and Can’t listen
```

---

# TASK-32.09 Add review-presentation smoke checks

## Status

TODO

## Context

Mode mix, speak rules, and Can’t listen are easy to regress in manual QA.

## Goal

Add a smoke checklist and a short MVP smoke section. Mark the epic DONE.

## Related Documents

```txt
docs/tasks/32-review-presentation-modes.md
docs/domain/lesson-flow.md
docs/release/mvp-smoke-tests.md
docs/smoke/learning-steps.md
```

## Files to Create

```txt
docs/smoke/review-presentation.md
```

## Files to Modify

```txt
docs/release/mvp-smoke-tests.md
docs/smoke/learning-steps.md
docs/tasks/32-review-presentation-modes.md
```

## Requirements

```txt
1. Checklist: step table, four effective modes, speak/🔊, flip sides, Can’t listen,
   flag does not change TARGET_TEXT_AUDIO or SOURCE_TEXT, new session resets,
   queue/SRS unchanged.
2. Point MVP smoke at the new file. Update learning-steps smoke “front first / back first”
   to presentation modes.
3. Mark TASK-32.09 and Epic Status DONE.
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
- Smoke file exists and mvp-smoke-tests mentions presentation modes.
- pnpm docs:lint and format:check pass.
```

## Commands to Run

```bash
pnpm format:check
pnpm docs:lint
```

## Manual Checks

```txt
None (human: web + one native review with audio-only).
```

## Do Not Do

```txt
- Do not add product features.
- Do not push.
```

## Expected Commit Message

```txt
TASK-32.09 Add review-presentation smoke checks
```

---

# Cursor Execution Rules

When working on a task in this epic, Cursor must follow these rules:

```txt
1. Read this epic and all Related Documents listed in the task first.
2. Implement only the current task. Do not start 32.02 from 32.01.
3. Do not add product features that are not in the task.
4. After 32.01, treat lesson-flow.md and learning-steps.md as live SoT.
5. Do not weaken auth, permissions, or the security checklist.
6. Run all Commands to Run. Fix issues they find. Then commit with the Expected Commit Message.
7. If blocked, stop and ask.
8. Do not push.
```
